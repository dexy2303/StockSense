import os
import uuid
import datetime
import random
from flask import jsonify
from werkzeug.utils import secure_filename
from config import Config

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

def is_allowed_image_filename(filename):
    """Checks if a filename possesses an authorized image extension"""
    if not filename or '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in Config.ALLOWED_IMAGE_EXTENSIONS

def save_profile_image(file_storage):
    """
    Validates, sanitizes, and safely saves an uploaded avatar image.
    Returns (success: bool, url_or_error: str)
    """
    if not file_storage or not getattr(file_storage, 'filename', None):
        return False, "No file provided"
    
    filename = file_storage.filename.strip()
    if not is_allowed_image_filename(filename):
        allowed = ", ".join(Config.ALLOWED_IMAGE_EXTENSIONS)
        return False, f"Invalid image format. Allowed formats: {allowed.upper()}"
    
    # Check file size (max 5MB for avatars)
    try:
        file_storage.seek(0, os.SEEK_END)
        size = file_storage.tell()
        file_storage.seek(0)
        if size > 5 * 1024 * 1024:
            return False, "Image file size exceeds the 5 MB limit"
    except Exception:
        pass

    # Sanitize and create collision-resistant unique filename
    ext = filename.rsplit('.', 1)[1].lower()
    raw_base = filename.rsplit('.', 1)[0]
    safe_base = secure_filename(raw_base)[:20]
    unique_token = uuid.uuid4().hex[:12]
    unique_name = f"avatar_{unique_token}_{safe_base}.{ext}" if safe_base else f"avatar_{unique_token}.{ext}"
    
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    destination_path = os.path.join(Config.UPLOAD_FOLDER, unique_name)
    file_storage.save(destination_path)
    
    return True, f"/static/uploads/avatars/{unique_name}"

