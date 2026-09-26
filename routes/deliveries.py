from flask import Blueprint, request
from services.firestore_service import db_service
from utils.helpers import api_response, api_error, generate_reference_id, get_iso_timestamp, get_current_date_str

deliveries_bp = Blueprint('deliveries', __name__, url_prefix='/api')

@deliveries_bp.route('/deliveries', methods=['GET'])
def get_deliveries():
    """Retrieve all outbound customer delivery orders"""
    deliveries = db_service.get_all('deliveries')
    deliveries.sort(key=lambda d: d.get('createdAt', d.get('date', '')), reverse=True)
    return api_response(deliveries, "Deliveries retrieved successfully")

@deliveries_bp.route('/deliveries', methods=['POST'])
def create_delivery():
    """Dispatch customer shipment and decrement warehouse inventory with stock validation"""
    data = request.get_json(silent=True) or {}
    
    customer = data.get('customer', '').strip()
    product_id = str(data.get('productId', '')).strip()
    warehouse = data.get('warehouse', 'Main Warehouse').strip()
    quantity_raw = data.get('quantity')
    delivery_date = data.get('date') or get_current_date_str()
    order_ref = data.get('orderRef', '').strip()
    notes = data.get('notes', '').strip()
    status = data.get('status', 'Completed').strip()

    # Validation
    if not customer or not product_id or not warehouse:
        return api_error("Missing required fields: customer, productId, warehouse", 400)

    try:
        quantity = int(quantity_raw)
        if quantity <= 0:
            return api_error("Quantity must be greater than zero", 400)
    except (ValueError, TypeError):
        return api_error("Invalid quantity specified", 400)

    # Retrieve target product
    product = db_service.get_by_id('products', product_id)
    if not product:
        return api_error(f"Target product with ID '{product_id}' not found", 404)

    main_stock = int(product.get('mainWarehouseStock', 0) or 0)
    prod_stock = int(product.get('productionFloorStock', 0) or 0)
    available_stock = main_stock if warehouse == 'Main Warehouse' else prod_stock

    # Business rule: Prevent delivery if stock is insufficient
    if quantity > available_stock:
        return api_error(
            f"Insufficient stock in {warehouse} for '{product.get('name')}'. Available: {available_stock}, Requested: {quantity}",
            400,
            data={'available': available_stock, 'requested': quantity}
        )

    # Decrement inventory upon completed status
    if status == 'Completed':
        if warehouse == 'Main Warehouse':
            main_stock -= quantity
        elif warehouse == 'Production Floor':
            prod_stock -= quantity

        db_service.update('products', product_id, {
            'mainWarehouseStock': main_stock,
            'productionFloorStock': prod_stock
        })

        # Business rule: Automatically log delivery to movement ledger
        db_service.log_movement(
            movement_type='Delivery',
            product_id=product_id,
            product_name=product.get('name'),
            sku=product.get('sku'),
            source=warehouse,
            destination=customer,
            warehouse=warehouse,
            quantity=quantity,
            reference=order_ref or f"Outbound delivery to {customer}",
            user='Marcus Reed',
            status='Completed'
        )

    delivery_id = generate_reference_id('DEL')
    new_delivery = {
        'id': delivery_id,
        'customer': customer,
        'orderRef': order_ref or f"SO-{delivery_id.split('-')[-1]}",
        'productId': product_id,
        'productName': product.get('name'),
        'productSku': product.get('sku'),
        'warehouse': warehouse,
        'quantity': quantity,
        'unit': product.get('unit', 'pcs'),
        'date': delivery_date,
        'status': status,
        'notes': notes,
        'createdAt': get_iso_timestamp()
    }

    saved = db_service.create('deliveries', new_delivery, doc_id=delivery_id)
    return api_response(saved, "Delivery order dispatched and inventory decremented successfully", 201)
