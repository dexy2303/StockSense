from flask import Blueprint, request
from services.firestore_service import db_service
from utils.helpers import api_response, api_error, get_iso_timestamp

products_bp = Blueprint('products', __name__, url_prefix='/api')

def format_product_metrics(p):
    """Enriches product with computed totalStock and stock status"""
    main_stock = int(p.get('mainWarehouseStock', 0) or 0)
    prod_stock = int(p.get('productionFloorStock', 0) or 0)
    total_stock = main_stock + prod_stock
    reorder_level = int(p.get('reorderLevel', 0) or 0)

    if total_stock == 0:
        status = 'Out of Stock'
    elif total_stock <= reorder_level:
        status = 'Low Stock'
    else:
        status = 'In Stock'

    return {
        **p,
        'mainWarehouseStock': main_stock,
        'productionFloorStock': prod_stock,
        'totalStock': total_stock,
        'reorderLevel': reorder_level,
        'status': status
    }

@products_bp.route('/products', methods=['GET'])
def get_products():
    """Retrieve all inventory products with live stock balances"""
    products = db_service.get_all('products')
    formatted = [format_product_metrics(p) for p in products]
    return api_response(formatted, "Products retrieved successfully")

@products_bp.route('/products/<id>', methods=['GET'])
def get_product(id):
    """Retrieve single product by ID"""
    product = db_service.get_by_id('products', str(id))
    if not product:
        return api_error(f"Product with ID '{id}' not found", 404)
    return api_response(format_product_metrics(product), "Product details retrieved")

@products_bp.route('/products', methods=['POST'])
def create_product():
    """Add new product with initial warehouse allocation and duplicate SKU check"""
    data = request.get_json(silent=True) or {}
    
    name = data.get('name', '').strip()
    sku = data.get('sku', '').strip().upper()
    category = data.get('category', '').strip()
    unit = data.get('unit', '').strip()
    reorder_level = data.get('reorderLevel')
    initial_stock = data.get('initialStock', 0)
    warehouse = data.get('warehouse', 'Main Warehouse')

    # Validations
    if not name or not sku or not category or not unit:
        return api_error("Missing required product fields: name, sku, category, unit", 400)

    try:
        reorder_level = int(reorder_level)
        initial_stock = int(initial_stock)
        if reorder_level < 0 or initial_stock < 0:
            return api_error("Stock quantities and reorder level must be non-negative", 400)
    except (ValueError, TypeError):
        return api_error("Invalid numeric value for stock or reorder level", 400)

    # Business rule: Prevent duplicate SKU
    if db_service.is_sku_duplicate(sku):
        return api_error(f"Product with SKU code '{sku}' already exists in catalog", 409)

    main_stock = initial_stock if warehouse == 'Main Warehouse' else 0
    prod_stock = initial_stock if warehouse == 'Production Floor' else 0

    new_id = str(len(db_service.get_all('products')) + 1)
    new_product = {
        'id': new_id,
        'name': name,
        'sku': sku,
        'category': category,
        'unit': unit,
        'mainWarehouseStock': main_stock,
        'productionFloorStock': prod_stock,
        'reorderLevel': reorder_level,
        'createdAt': get_iso_timestamp()
    }

    saved = db_service.create('products', new_product, doc_id=new_id)

    # Log initial inventory movement if initial stock > 0
    if initial_stock > 0:
        db_service.log_movement(
            movement_type='Receipt',
            product_id=new_id,
            product_name=name,
            sku=sku,
            source='Initial Stock Allocation',
            destination=warehouse,
            warehouse=warehouse,
            quantity=initial_stock,
            reference='Catalog Creation Inbound',
            user='Admin User'
        )

    return api_response(format_product_metrics(saved), "Product created successfully", 201)

@products_bp.route('/products/<id>', methods=['PUT'])
def update_product(id):
    """Update catalog specs and warehouse stock quantities"""
    product = db_service.get_by_id('products', str(id))
    if not product:
        return api_error(f"Product with ID '{id}' not found", 404)

    data = request.get_json(silent=True) or {}
    name = data.get('name', product.get('name')).strip()
    sku = data.get('sku', product.get('sku')).strip().upper()
    category = data.get('category', product.get('category')).strip()
    unit = data.get('unit', product.get('unit')).strip()

    try:
        reorder_level = int(data.get('reorderLevel', product.get('reorderLevel', 0)))
        main_stock = int(data.get('mainWarehouseStock', product.get('mainWarehouseStock', 0)))
        prod_stock = int(data.get('productionFloorStock', product.get('productionFloorStock', 0)))
        if reorder_level < 0 or main_stock < 0 or prod_stock < 0:
            return api_error("Stock and reorder values cannot be negative", 400)
    except (ValueError, TypeError):
        return api_error("Invalid numeric values for stock quantities", 400)

    # Business rule: Check duplicate SKU excluding current product
    if db_service.is_sku_duplicate(sku, exclude_id=id):
        return api_error(f"Another product with SKU code '{sku}' already exists", 409)

    updates = {
        'name': name,
        'sku': sku,
        'category': category,
        'unit': unit,
        'reorderLevel': reorder_level,
        'mainWarehouseStock': main_stock,
        'productionFloorStock': prod_stock
    }

    updated = db_service.update('products', str(id), updates)
    return api_response(format_product_metrics(updated), "Product updated successfully")

@products_bp.route('/products/<id>', methods=['DELETE'])
def delete_product(id):
    """Remove product and associated inventory from catalog"""
    product = db_service.get_by_id('products', str(id))
    if not product:
        return api_error(f"Product with ID '{id}' not found", 404)

    db_service.delete('products', str(id))
    return api_response({'id': id}, f"Product '{product.get('name')}' deleted successfully")

@products_bp.route('/low-stock', methods=['GET'])
def get_low_stock():
    """Returns products that have fallen below safety reorder threshold"""
    products = db_service.get_all('products')
    low_stock_items = []
    
    for p in products:
        formatted = format_product_metrics(p)
        if formatted['totalStock'] <= formatted['reorderLevel']:
            low_stock_items.append(formatted)

    return api_response(low_stock_items, f"Found {len(low_stock_items)} low stock alerting products")

@products_bp.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Returns top-level warehouse inventory KPI metrics"""
    products = db_service.get_all('products')
    movements = db_service.get_all('movements')
    receipts = db_service.get_all('receipts')
    deliveries = db_service.get_all('deliveries')
    transfers = db_service.get_all('transfers')
    adjustments = db_service.get_all('adjustments')

    total_products = len(products)
    total_stock_units = 0
    low_stock_count = 0
    for p in products:
        m = int(p.get('mainWarehouseStock', 0) or 0)
        f = int(p.get('productionFloorStock', 0) or 0)
        tot = m + f
        total_stock_units += tot
        if tot <= int(p.get('reorderLevel', 0) or 0):
            low_stock_count += 1

    return api_response({
        'totalProducts': total_products,
        'totalStockUnits': total_stock_units,
        'lowStockAlerts': low_stock_count,
        'totalMovements': len(movements),
        'totalReceipts': len(receipts),
        'totalDeliveries': len(deliveries),
        'totalTransfers': len(transfers),
        'totalAdjustments': len(adjustments)
    }, "Dashboard statistics retrieved")
