import os
from flask import Flask, render_template, jsonify, redirect, url_for, session
from config import Config
from services.firestore_service import db_service
from utils.helpers import api_response, get_iso_timestamp
from routes import (
    products_bp,
    warehouses_bp,
    receipts_bp,
    deliveries_bp,
    transfers_bp,
    adjustments_bp,
    movements_bp,
    auth_bp,
    profile_bp
)

app = Flask(__name__)
app.config.from_object(Config)

# Ensure avatar upload directories exist
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

# Register API & Auth blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(products_bp)
app.register_blueprint(warehouses_bp)
app.register_blueprint(receipts_bp)
app.register_blueprint(deliveries_bp)
app.register_blueprint(transfers_bp)
app.register_blueprint(adjustments_bp)
app.register_blueprint(movements_bp)

@app.route('/')
def index():
    """Serves the main StockSense Single-Page Application (Protected)"""
    if not session.get('user_id'):
        return redirect(url_for('auth.login'))
    return render_template(
        'index.html',
        current_user={
            'id': session.get('user_id'),
            'name': session.get('user_name', 'Alex Morgan'),
            'email': session.get('user_email', 'admin@stocksense.com'),
            'role': session.get('user_role', 'admin'),
            'auth_provider': session.get('auth_provider', 'email'),
            'profile_picture': session.get('profile_picture') or Config.DEFAULT_AVATAR_URL
        }
    )


@app.route('/api/health', methods=['GET'])
def health_check():
    """System health check and Firestore connection status"""
    status_mode = "live" if db_service.is_live else "in-memory-mock"
    return api_response({
        'status': 'healthy',
        'app': 'StockSense Inventory Management System',
        'version': '1.0.0',
        'timestamp': get_iso_timestamp(),
        'database': {
            'type': 'Google Cloud Firestore',
            'mode': status_mode,
            'isLive': db_service.is_live
        },
        'collections': {
            'products': len(db_service.get_all('products')),
            'warehouses': len(db_service.get_all('warehouses')),
            'receipts': len(db_service.get_all('receipts')),
            'deliveries': len(db_service.get_all('deliveries')),
            'transfers': len(db_service.get_all('transfers')),
            'adjustments': len(db_service.get_all('adjustments')),
            'movements': len(db_service.get_all('movements'))
        }
    }, "StockSense backend is running smoothly")

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        'success': False,
        'message': 'Requested resource or API endpoint not found',
        'error': 'NOT_FOUND'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'message': 'An internal server error occurred',
        'error': 'INTERNAL_SERVER_ERROR'
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=Config.DEBUG)
