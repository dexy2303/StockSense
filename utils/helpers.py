import datetime
import random
from flask import jsonify

def api_response(data=None, message="Operation successful", status_code=200):
    """Clean standard success response format required by StockSense API"""
    payload = {
        "success": True,
        "message": message,
        "data": data if data is not None else {}
    }
    return jsonify(payload), status_code

def api_error(message="Operation failed", status_code=400, data=None):
    """Clean standard error response format required by StockSense API"""
    payload = {
        "success": False,
        "message": message
    }
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status_code

def get_iso_timestamp():
    """Returns current UTC ISO-formatted string timestamp"""
    return datetime.datetime.now(datetime.timezone.utc).isoformat()

def get_current_date_str():
    """Returns current date in YYYY-MM-DD format"""
    return datetime.datetime.now().strftime("%Y-%m-%d")

def generate_reference_id(prefix):
    """Generates unique chronological sequence reference ID e.g. REC-2026-1045"""
    year = datetime.datetime.now().year
    rand_seq = random.randint(1000, 9999)
    return f"{prefix}-{year}-{rand_seq}"
