from flask import Blueprint, request
from services.firestore_service import db_service
from utils.helpers import api_response, api_error, generate_reference_id, get_iso_timestamp, get_current_date_str

adjustments_bp = Blueprint('adjustments', __name__, url_prefix='/api')

@adjustments_bp.route('/adjustments', methods=['GET'])
def get_adjustments():
    """Retrieve all stock adjustment reconciliation records"""
    adjustments = db_service.get_all('adjustments')
    adjustments.sort(key=lambda a: a.get('createdAt', a.get('date', '')), reverse=True)
    return api_response(adjustments, "Adjustments retrieved successfully")

@adjustments_bp.route('/adjustments', methods=['POST'])
def create_adjustment():
    """Apply stock count reconciliation against recorded physical stock"""
    data = request.get_json(silent=True) or {}

    product_id = str(data.get('productId', '')).strip()
    warehouse = data.get('warehouse', '').strip()
    counted_qty_raw = data.get('countedQty')
    reason = data.get('reason', '').strip()
    adj_date = data.get('date') or get_current_date_str()
    notes = data.get('notes', '').strip()
    status = data.get('status', 'Completed').strip()

    # Validation
    if not product_id or not warehouse:
        return api_error("Missing required fields: productId, warehouse", 400)

    if not reason:
        return api_error("Adjustment reason is required", 400)

    try:
        counted_qty = int(counted_qty_raw)
        if counted_qty < 0:
            return api_error("Counted quantity must be non-negative (>= 0)", 400)
    except (ValueError, TypeError):
        return api_error("Counted quantity must be a valid integer", 400)

    product = db_service.get_by_id('products', product_id)
    if not product:
        return api_error(f"Product with ID '{product_id}' not found", 404)

    # Determine recorded quantity in selected warehouse
    if warehouse == 'Main Warehouse':
        recorded_qty = int(product.get('mainWarehouseStock', 0) or 0)
        stock_field = 'mainWarehouseStock'
    elif warehouse == 'Production Floor':
        recorded_qty = int(product.get('productionFloorStock', 0) or 0)
        stock_field = 'productionFloorStock'
    else:
        recorded_qty = int(product.get('mainWarehouseStock', 0) or 0)
        stock_field = 'mainWarehouseStock'

    difference = counted_qty - recorded_qty

    # Generate record ID
    adj_id = data.get('id')
    if not adj_id or not str(adj_id).startswith('ADJ-'):
        adj_id = generate_reference_id('ADJ')

    adjustment_record = {
        'id': adj_id,
        'productId': product_id,
        'productName': product.get('name', ''),
        'productSku': product.get('sku', ''),
        'warehouse': warehouse,
        'recordedQty': recorded_qty,
        'countedQty': counted_qty,
        'difference': difference,
        'unit': product.get('unit', 'Units'),
        'reason': reason,
        'date': adj_date,
        'status': status,
        'notes': notes,
        'createdAt': get_iso_timestamp()
    }

    # Update product warehouse balance and log ledger movement if Completed
    if status == 'Completed':
        db_service.update('products', product_id, {
            stock_field: counted_qty
        })

        db_service.log_movement(
            movement_type='Adjustment',
            product_id=product_id,
            product_name=product.get('name', ''),
            sku=product.get('sku', ''),
            source=f"{warehouse} (Recorded: {recorded_qty})",
            destination=f"{warehouse} (Counted: {counted_qty})",
            warehouse=warehouse,
            quantity=difference,
            reference=adj_id,
            user='Alex Morgan',
            status=status
        )

    saved = db_service.create('adjustments', adjustment_record, doc_id=adj_id)
    return api_response(saved, "Stock adjustment applied successfully", 201)
