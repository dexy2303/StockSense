from flask import Blueprint, request
from services.firestore_service import db_service
from utils.helpers import api_response, api_error, get_iso_timestamp

movements_bp = Blueprint('movements', __name__, url_prefix='/api')

@movements_bp.route('/movements', methods=['GET'])
def get_movements():
    """Retrieve unified stock movement audit ledger with filtering"""
    movements = db_service.get_all('movements')
    
    # Query filters
    m_type = request.args.get('type', '').strip()
    warehouse = request.args.get('warehouse', '').strip()
    product_id = request.args.get('productId', '').strip()
    search = request.args.get('search', '').strip().lower()
    limit = request.args.get('limit', type=int)

    filtered = []
    for m in movements:
        # Filter by type
        if m_type and m_type.upper() != 'ALL':
            if m.get('movementType', '').upper() != m_type.upper():
                continue

        # Filter by warehouse / location
        if warehouse and warehouse.upper() != 'ALL':
            from_loc = str(m.get('fromLocation', ''))
            to_loc = str(m.get('toLocation', ''))
            if warehouse not in from_loc and warehouse not in to_loc:
                continue

        # Filter by product ID
        if product_id:
            if str(m.get('productId', '')) != product_id:
                continue

        # Search term filter
        if search:
            name = str(m.get('productName', '')).lower()
            sku = str(m.get('sku', '')).lower()
            ref = str(m.get('reference', '')).lower()
            notes = str(m.get('notes', '')).lower()
            if search not in name and search not in sku and search not in ref and search not in notes:
                continue

        filtered.append(m)

    # Sort descending by timestamp / createdAt
    filtered.sort(key=lambda x: x.get('createdAt', x.get('timestamp', '')), reverse=True)

    if limit and limit > 0:
        filtered = filtered[:limit]

    return api_response(filtered, f"Retrieved {len(filtered)} stock movement records")

@movements_bp.route('/movements/recent', methods=['GET'])
def get_recent_movements():
    """Retrieve recent stock movements feed for dashboard display"""
    limit = request.args.get('limit', default=10, type=int)
    movements = db_service.get_all('movements')
    movements.sort(key=lambda x: x.get('createdAt', x.get('timestamp', '')), reverse=True)
    return api_response(movements[:limit], "Recent movements retrieved successfully")
