from flask import Blueprint, request
from services.firestore_service import db_service
from utils.helpers import api_response, api_error, generate_reference_id, get_iso_timestamp, get_current_date_str

receipts_bp = Blueprint('receipts', __name__, url_prefix='/api')

@receipts_bp.route('/receipts', methods=['GET'])
def get_receipts():
    """Retrieve all inbound supplier receipts"""
    receipts = db_service.get_all('receipts')
    # Sort descending by date/creation
    receipts.sort(key=lambda r: r.get('createdAt', r.get('date', '')), reverse=True)
    return api_response(receipts, "Receipts retrieved successfully")

@receipts_bp.route('/receipts', methods=['POST'])
def create_receipt():
    """Register incoming goods consignment and increment warehouse inventory"""
    data = request.get_json(silent=True) or {}
    
    supplier = data.get('supplier', '').strip()
    product_id = str(data.get('productId', '')).strip()
    warehouse = data.get('warehouse', 'Main Warehouse').strip()
    quantity_raw = data.get('quantity')
    unit_cost_raw = data.get('unitCost', 0)
    receipt_date = data.get('date') or get_current_date_str()
    notes = data.get('notes', '').strip()
    status = data.get('status', 'Completed').strip()

    # Validation
    if not supplier or not product_id or not warehouse:
        return api_error("Missing required fields: supplier, productId, warehouse", 400)

    try:
        quantity = int(quantity_raw)
        if quantity <= 0:
            return api_error("Quantity received must be greater than zero", 400)
    except (ValueError, TypeError):
        return api_error("Invalid quantity specified", 400)

    try:
        unit_cost = float(unit_cost_raw) if unit_cost_raw else 0.0
    except (ValueError, TypeError):
        unit_cost = 0.0

    # Retrieve target product
    product = db_service.get_by_id('products', product_id)
    if not product:
        return api_error(f"Target product with ID '{product_id}' not found", 404)

    # Business rule: Increment product warehouse stock when status is Completed
    if status == 'Completed':
        main_stock = int(product.get('mainWarehouseStock', 0) or 0)
        prod_stock = int(product.get('productionFloorStock', 0) or 0)

        if warehouse == 'Main Warehouse':
            main_stock += quantity
        elif warehouse == 'Production Floor':
            prod_stock += quantity
        else:
            main_stock += quantity

        db_service.update('products', product_id, {
            'mainWarehouseStock': main_stock,
            'productionFloorStock': prod_stock
        })

        # Business rule: Automatically log every stock receipt in movement ledger
        db_service.log_movement(
            movement_type='Receipt',
            product_id=product_id,
            product_name=product.get('name'),
            sku=product.get('sku'),
            source=supplier,
            destination=warehouse,
            warehouse=warehouse,
            quantity=quantity,
            reference=notes or f"PO Inbound from {supplier}",
            user='Alex Morgan',
            status='Completed'
        )

    receipt_id = generate_reference_id('REC')
    new_receipt = {
        'id': receipt_id,
        'supplier': supplier,
        'productId': product_id,
        'productName': product.get('name'),
        'productSku': product.get('sku'),
        'warehouse': warehouse,
        'quantity': quantity,
        'unit': product.get('unit', 'pcs'),
        'unitCost': unit_cost,
        'date': receipt_date,
        'status': status,
        'notes': notes,
        'createdAt': get_iso_timestamp()
    }

    saved = db_service.create('receipts', new_receipt, doc_id=receipt_id)
    return api_response(saved, "Stock received and allocated successfully", 201)
