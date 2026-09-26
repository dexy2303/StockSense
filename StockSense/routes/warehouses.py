from flask import Blueprint, request
from services.firestore_service import db_service
from utils.helpers import api_response, api_error, get_iso_timestamp

warehouses_bp = Blueprint('warehouses', __name__, url_prefix='/api')

@warehouses_bp.route('/warehouses', methods=['GET'])
def get_warehouses():
    """Retrieve all warehouse facilities with computed stock loads and capacities"""
    warehouses = db_service.get_all('warehouses')
    products = db_service.get_all('products')

    results = []
    for wh in warehouses:
        wh_name = wh.get('name')
        wh_capacity = int(wh.get('capacity', 10000))
        
        # Calculate stored stock units & active SKUs count for this warehouse
        stored_units = 0
        stocked_skus = 0
        for p in products:
            qty = 0
            if wh_name == 'Main Warehouse':
                qty = int(p.get('mainWarehouseStock', 0) or 0)
            elif wh_name == 'Production Floor':
                qty = int(p.get('productionFloorStock', 0) or 0)

            stored_units += qty
            if qty > 0:
                stocked_skus += 1

        load_percentage = round((stored_units / wh_capacity) * 100, 1) if wh_capacity > 0 else 0

        results.append({
            **wh,
            'storedUnits': stored_units,
            'stockedSkus': stocked_skus,
            'capacity': wh_capacity,
            'availableCapacity': max(0, wh_capacity - stored_units),
            'loadPercentage': min(100.0, load_percentage)
        })

    return api_response(results, "Warehouses retrieved successfully")

@warehouses_bp.route('/warehouses', methods=['POST'])
def create_warehouse():
    """Register a new storage or processing facility"""
    data = request.get_json(silent=True) or {}
    name = data.get('name', '').strip()
    code = data.get('code', '').strip().upper()
    location = data.get('location', '').strip()
    capacity = data.get('capacity', 5000)
    supervisor = data.get('supervisor', 'Warehouse Staff').strip()

    if not name or not code or not location:
        return api_error("Missing required fields: name, code, location", 400)

    try:
        capacity = int(capacity)
        if capacity <= 0:
            return api_error("Capacity must be greater than zero", 400)
    except (ValueError, TypeError):
        return api_error("Capacity must be a valid positive number", 400)

    new_id = f"wh-{code.lower()}"
    new_wh = {
        'id': new_id,
        'name': name,
        'code': code,
        'location': location,
        'capacity': capacity,
        'supervisor': supervisor,
        'status': 'Operational',
        'createdAt': get_iso_timestamp()
    }

    saved = db_service.create('warehouses', new_wh, doc_id=new_id)
    return api_response(saved, "Warehouse registered successfully", 201)

@warehouses_bp.route('/warehouses/<id>/stock', methods=['GET'])
def get_warehouse_stock(id):
    """Retrieve detailed product stock allocations in specified warehouse"""
    warehouse = db_service.get_by_id('warehouses', str(id))
    if not warehouse:
        return api_error(f"Warehouse with ID '{id}' not found", 404)

    wh_name = warehouse.get('name')
    products = db_service.get_all('products')

    stock_items = []
    for p in products:
        qty = 0
        if wh_name == 'Main Warehouse':
            qty = int(p.get('mainWarehouseStock', 0) or 0)
        elif wh_name == 'Production Floor':
            qty = int(p.get('productionFloorStock', 0) or 0)

        stock_items.append({
            'productId': p.get('id'),
            'productName': p.get('name'),
            'sku': p.get('sku'),
            'category': p.get('category'),
            'unit': p.get('unit'),
            'allocatedStock': qty,
            'reorderLevel': p.get('reorderLevel', 0),
            'status': 'In Stock' if qty > p.get('reorderLevel', 0) else ('Low Stock' if qty > 0 else 'Out of Stock')
        })

    return api_response({
        'warehouse': warehouse,
        'inventory': stock_items
    }, f"Stock allocations for {wh_name} retrieved")
