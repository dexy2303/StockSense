from flask import Blueprint, request
from services.firestore_service import db_service
from utils.helpers import api_response, api_error, generate_reference_id, get_iso_timestamp, get_current_date_str

transfers_bp = Blueprint('transfers', __name__, url_prefix='/api')

@transfers_bp.route('/transfers', methods=['GET'])
def get_transfers():
    """Retrieve all inter-warehouse stock transfer records"""
    transfers = db_service.get_all('transfers')
    transfers.sort(key=lambda t: t.get('createdAt', t.get('date', '')), reverse=True)
    return api_response(transfers, "Transfers retrieved successfully")

@transfers_bp.route('/transfers', methods=['POST'])
def create_transfer():
    """Relocate inventory between facilities with source stock validation"""
    data = request.get_json(silent=True) or {}
    
    product_id = str(data.get('productId', '')).strip()
    source_wh = data.get('sourceWarehouse', '').strip()
    dest_wh = data.get('destWarehouse', '').strip()
    quantity_raw = data.get('quantity')
    transfer_date = data.get('date') or get_current_date_str()
    reference = data.get('reference', '').strip()
    notes = data.get('notes', '').strip()
    status = data.get('status', 'Completed').strip()

    # Validation
    if not product_id or not source_wh or not dest_wh:
        return api_error("Missing required fields: productId, sourceWarehouse, destWarehouse", 400)

    # Business rule: Prevent same source and destination warehouse
    if source_wh == dest_wh:
        return api_error("Source and destination warehouses cannot be the same", 400)

    try:
        quantity = int(quantity_raw)
        if quantity <= 0:
            return api_error("Transfer quantity must be greater than zero", 400)
    except (ValueError, TypeError):
        return api_error("Invalid quantity specified", 400)

    product = db_service.get_by_id('products', product_id)
    if not product:
        return api_error(f"Product with ID '{product_id}' not found", 404)

    main_stock = int(product.get('mainWarehouseStock', 0) or 0)
    prod_stock = int(product.get('productionFloorStock', 0) or 0)
    source_available = main_stock if source_wh == 'Main Warehouse' else prod_stock

    # Business rule: Prevent transfer if source stock is insufficient
    if quantity > source_available:
        return api_error(
            f"Insufficient stock in source facility '{source_wh}'. Available: {source_available}, Requested: {quantity}",
            400,
            data={'available': source_available, 'requested': quantity}
        )

    # Move stock between warehouses (net product total remains unchanged)
    if status == 'Completed':
        if source_wh == 'Main Warehouse' and dest_wh == 'Production Floor':
            main_stock -= quantity
            prod_stock += quantity
        elif source_wh == 'Production Floor' and dest_wh == 'Main Warehouse':
            prod_stock -= quantity
            main_stock += quantity

        db_service.update('products', product_id, {
            'mainWarehouseStock': main_stock,
            'productionFloorStock': prod_stock
        })

        # Business rule: Automatically log transfer to movement ledger
        db_service.log_movement(
            movement_type='Transfer',
            product_id=product_id,
            product_name=product.get('name'),
            sku=product.get('sku'),
            source=source_wh,
            destination=dest_wh,
            warehouse=f"{source_wh} → {dest_wh}",
            quantity=quantity,
            reference=reference or f"Transfer from {source_wh} to {dest_wh}",
            user='Devon Clark',
            status='Completed'
        )

    transfer_id = generate_reference_id('TRF')
    new_transfer = {
        'id': transfer_id,
        'reference': reference or f"TR-{transfer_id.split('-')[-1]}",
        'productId': product_id,
        'productName': product.get('name'),
        'productSku': product.get('sku'),
        'sourceWarehouse': source_wh,
        'destWarehouse': dest_wh,
        'quantity': quantity,
        'unit': product.get('unit', 'pcs'),
        'date': transfer_date,
        'status': status,
        'notes': notes,
        'createdAt': get_iso_timestamp()
    }

    saved = db_service.create('transfers', new_transfer, doc_id=transfer_id)
    return api_response(saved, "Stock transferred and facility balances updated successfully", 201)
