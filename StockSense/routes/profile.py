"""
StockSense - User Profile & Avatar Management Blueprint
Handles user profile inspection, profile attribute updates, and avatar uploads.
"""

from flask import Blueprint, request, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from services.firestore_service import db_service
from utils.helpers import api_response, api_error, save_profile_image, get_iso_timestamp

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/api/user/profile', methods=['GET'])
def get_profile():
    """Returns current authenticated operator's full profile"""
    user_id = session.get('user_id')
    if not user_id:
        return api_error("Authentication required. Please sign in.", 401)
    
    user = db_service.get_by_id('users', user_id)
    if not user:
        # Fallback to session data
        user = {
            'id': user_id,
            'full_name': session.get('user_name', 'Alex Morgan'),
            'email': session.get('user_email', 'admin@stocksense.com'),
            'role': session.get('user_role', 'admin'),
            'auth_provider': session.get('auth_provider', 'email'),
            'profile_picture': session.get('profile_picture') or Config.DEFAULT_AVATAR_URL
        }

    return api_response({
        'id': str(user.get('id', user_id)),
        'full_name': user.get('full_name') or session.get('user_name', 'Alex Morgan'),
        'email': user.get('email') or session.get('user_email', ''),
        'role': user.get('role', 'admin'),
        'auth_provider': user.get('auth_provider', 'email'),
        'google_id': user.get('google_id', ''),
        'profile_picture': user.get('profile_picture') or session.get('profile_picture') or Config.DEFAULT_AVATAR_URL,
        'created_at': user.get('created_at', ''),
        'updated_at': user.get('updated_at', '')
    }, "Operator profile retrieved successfully")


@profile_bp.route('/api/user/avatar', methods=['POST'])
def upload_avatar():
    """
    Dedicated endpoint for uploading and updating profile avatar picture.
    Supports standard image file types (JPG, JPEG, PNG, WEBP).
    Replaces any previous picture (including Google OAuth picture) with the custom upload.
    """
    user_id = session.get('user_id')
    if not user_id:
        return api_error("Authentication required. Please sign in.", 401)

    avatar_file = request.files.get('avatar') or request.files.get('file') or request.files.get('profile_picture')
    if not avatar_file or not getattr(avatar_file, 'filename', None):
        return api_error("Please select an image file to upload", 400)

    # Validate and safely save image to static/uploads/avatars/
    success, result_or_err = save_profile_image(avatar_file)
    if not success:
        return api_error(result_or_err, 400)

    avatar_url = result_or_err
    now = get_iso_timestamp()

    # Update in Firestore users collection
    updates = {
        'profile_picture': avatar_url,
        'updated_at': now
    }
    db_service.update('users', user_id, updates)

    # Update active Flask session
    session['profile_picture'] = avatar_url

    return api_response({
        'profile_picture': avatar_url,
        'user_id': user_id,
        'user_name': session.get('user_name', '')
    }, "Profile picture updated successfully!")


@profile_bp.route('/api/user/profile', methods=['POST', 'PUT'])
def update_profile():
    """
    Comprehensive operator profile update:
    Supports updating full_name, email, password, and optional avatar file in one request.
    """
    user_id = session.get('user_id')
    if not user_id:
        return api_error("Authentication required. Please sign in.", 401)

    user = db_service.get_by_id('users', user_id)
    if not user:
        return api_error("User profile not found in database", 404)

    is_json = request.is_json
    data = request.get_json(silent=True) if is_json else request.form
    data = data or {}

    updates = {}
    now = get_iso_timestamp()

    # 1. Full name update
    new_name = str(data.get('full_name') or data.get('name') or '').strip()
    if new_name:
        if len(new_name) < 2:
            return api_error("Full name must be at least 2 characters", 400)
        updates['full_name'] = new_name
        session['user_name'] = new_name

    # 2. Email update
    new_email = str(data.get('email') or '').strip().lower()
    if new_email and new_email != user.get('email', '').lower():
        from routes.auth import is_valid_email
        if not is_valid_email(new_email):
            return api_error("Please provide a valid email format", 400)
        # Check if email is already taken by another account
        existing = db_service.get_user_by_email(new_email)
        if existing and str(existing.get('id')) != str(user_id):
            return api_error(f"Email '{new_email}' is already in use by another operator account", 409)
        updates['email'] = new_email
        session['user_email'] = new_email

    # 3. Password update (if requested and user is email-based)
    new_pwd = str(data.get('new_password') or data.get('password') or '').strip()
    cur_pwd = str(data.get('current_password') or '').strip()
    if new_pwd:
        if len(new_pwd) < 6:
            return api_error("New password must be at least 6 characters long", 400)
        # Verify current password if user has a password set
        stored_hash = user.get('password_hash')
        if stored_hash and not cur_pwd:
            return api_error("Current password is required to set a new password", 400)
        if stored_hash and not check_password_hash(stored_hash, cur_pwd):
            return api_error("Current password verification failed", 401)
        updates['password_hash'] = generate_password_hash(new_pwd)

    # 4. Optional Avatar file update
    avatar_file = request.files.get('avatar') or request.files.get('profile_picture')
    if avatar_file and getattr(avatar_file, 'filename', None):
        success, avatar_res = save_profile_image(avatar_file)
        if not success:
            return api_error(avatar_res, 400)
        updates['profile_picture'] = avatar_res
        session['profile_picture'] = avatar_res

    if updates:
        updates['updated_at'] = now
        db_service.update('users', user_id, updates)

    # Return refreshed profile data
    updated_user = db_service.get_by_id('users', user_id) or user
    return api_response({
        'id': str(updated_user.get('id', user_id)),
        'full_name': updated_user.get('full_name', session.get('user_name')),
        'email': updated_user.get('email', session.get('user_email')),
        'role': updated_user.get('role', session.get('user_role')),
        'auth_provider': updated_user.get('auth_provider', session.get('auth_provider')),
        'profile_picture': updated_user.get('profile_picture') or session.get('profile_picture') or Config.DEFAULT_AVATAR_URL,
        'updated_at': updated_user.get('updated_at', now)
    }, "Profile updated successfully!")
