# StockSense Modular API Routes Package
from routes.products import products_bp
from routes.warehouses import warehouses_bp
from routes.receipts import receipts_bp
from routes.deliveries import deliveries_bp
from routes.transfers import transfers_bp
from routes.adjustments import adjustments_bp
from routes.movements import movements_bp

__all__ = [
    'products_bp',
    'warehouses_bp',
    'receipts_bp',
    'deliveries_bp',
    'transfers_bp',
    'adjustments_bp',
    'movements_bp'
]
