import re
import secrets
import urllib.parse
import requests
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from services.firestore_service import db_service
from utils.helpers import (
    api_response, api_error, generate_reference_id, get_iso_timestamp,
    save_profile_image, is_allowed_image_filename
)

auth_bp = Blueprint('auth', __name__)

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')

def is_valid_email(email_str):
    if not email_str:
        return False
    return bool(EMAIL_REGEX.match(email_str.strip()))

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Renders login page and authenticates existing users"""
    # If already logged in, redirect directly to dashboard
    if request.method == 'GET' and session.get('user_id'):
        return redirect(url_for('index'))

    if request.method == 'GET':
        return render_template('login.html')

    # Handle POST (Supports both application/json and form-data)
    data = request.get_json(silent=True) if request.is_json else request.form
    data = data or {}

    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', '')).strip()

    is_json = request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest'

    # Validation
    if not email:
        msg = "Email address is required"
        return api_error(msg, 400) if is_json else (render_template('login.html', error=msg, email=email), 400)

    if not is_valid_email(email):
        msg = "Please enter a valid email address format"
        return api_error(msg, 400) if is_json else (render_template('login.html', error=msg, email=email), 400)

    if not password:
        msg = "Password is required"
        return api_error(msg, 400) if is_json else (render_template('login.html', error=msg, email=email), 400)

    # User lookup
    user = db_service.get_user_by_email(email)
    if not user:
        msg = "Invalid email or password. Please verify your credentials."
        return api_error(msg, 401) if is_json else (render_template('login.html', error=msg, email=email), 401)

    # Password hash verification
    stored_hash = user.get('password_hash', '')
    if not stored_hash or not check_password_hash(stored_hash, password):
        msg = "Invalid email or password. Please verify your credentials."
        return api_error(msg, 401) if is_json else (render_template('login.html', error=msg, email=email), 401)

    # Store user identity in Flask session
    session.clear()
    session['user_id'] = str(user.get('id', ''))
    session['user_email'] = user.get('email', '')
    session['user_name'] = user.get('full_name', 'Alex Morgan')
    session['user_role'] = user.get('role', 'admin')
    session['auth_provider'] = user.get('auth_provider', 'email')
    session['profile_picture'] = user.get('profile_picture') or Config.DEFAULT_AVATAR_URL
    session.permanent = True


    if is_json:
        return api_response({
            'id': session['user_id'],
            'email': session['user_email'],
            'name': session['user_name'],
            'role': session['user_role'],
            'auth_provider': session['auth_provider'],
            'redirect': url_for('index')
        }, f"Welcome back, {session['user_name']}!")

    flash(f"Welcome back, {session['user_name']}!", "success")
    return redirect(url_for('index'))


@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    """Renders signup page and registers new user accounts"""
    if request.method == 'GET' and session.get('user_id'):
        return redirect(url_for('index'))

    if request.method == 'GET':
        return render_template('signup.html')

    # Handle POST (Supports both application/json and form-data)
    data = request.get_json(silent=True) if request.is_json else request.form
    data = data or {}

    full_name = str(data.get('full_name') or data.get('fullName') or data.get('name') or '').strip()
    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', '')).strip()
    confirm_password = str(data.get('confirm_password') or data.get('confirmPassword') or '').strip()

    is_json = request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest'

    # Validations
    if not full_name or len(full_name) < 2:
        msg = "Please enter your full name (at least 2 characters)"
        return api_error(msg, 400) if is_json else (render_template('signup.html', error=msg, full_name=full_name, email=email), 400)

    if not email or not is_valid_email(email):
        msg = "Please enter a valid business email address"
        return api_error(msg, 400) if is_json else (render_template('signup.html', error=msg, full_name=full_name, email=email), 400)

    if not password:
        msg = "Password is required"
        return api_error(msg, 400) if is_json else (render_template('signup.html', error=msg, full_name=full_name, email=email), 400)

    if len(password) < 6:
        msg = "Password must be at least 6 characters long"
        return api_error(msg, 400) if is_json else (render_template('signup.html', error=msg, full_name=full_name, email=email), 400)

    if password != confirm_password:
        msg = "Passwords do not match. Please verify both password entries."
        return api_error(msg, 400) if is_json else (render_template('signup.html', error=msg, full_name=full_name, email=email), 400)

    # Check for duplicate email registration
    existing_user = db_service.get_user_by_email(email)
    if existing_user:
        msg = f"An account with email '{email}' already exists. Please log in instead."
        return api_error(msg, 409) if is_json else (render_template('signup.html', error=msg, full_name=full_name, email=email), 409)

    # Process optional profile picture upload
    avatar_file = request.files.get('avatar') or request.files.get('profile_picture') or request.files.get('profile_image')
    profile_picture = Config.DEFAULT_AVATAR_URL
    if avatar_file and getattr(avatar_file, 'filename', None):
        success, res_val = save_profile_image(avatar_file)
        if not success:
            return api_error(res_val, 400) if is_json else (render_template('signup.html', error=res_val, full_name=full_name, email=email), 400)
        profile_picture = res_val

    # Securely hash password with Werkzeug
    password_hash = generate_password_hash(password)
    user_id = generate_reference_id('USR')
    now = get_iso_timestamp()

    new_user = {
        'id': user_id,
        'full_name': full_name,
        'email': email,
        'password_hash': password_hash,
        'auth_provider': 'email',
        'google_id': '',
        'profile_picture': profile_picture,
        'role': 'admin',
        'created_at': now,
        'updated_at': now
    }

    # Save to Firestore users collection
    db_service.create('users', new_user, doc_id=user_id)

    # Automatically authenticate and initialize session
    session.clear()
    session['user_id'] = user_id
    session['user_email'] = email
    session['user_name'] = full_name
    session['user_role'] = 'admin'
    session['auth_provider'] = 'email'
    session['profile_picture'] = profile_picture
    session.permanent = True


    if is_json:
        return api_response({
            'id': user_id,
            'email': email,
            'name': full_name,
            'role': 'admin',
            'auth_provider': 'email',
            'redirect': url_for('index')
        }, f"Account registered successfully! Welcome to StockSense, {full_name}.", 201)

    flash(f"Account registered successfully! Welcome to StockSense, {full_name}.", "success")
    return redirect(url_for('index'))


@auth_bp.route('/auth/google/login', methods=['GET'])
def google_login():
    """Initiates Google OAuth 2.0 authorization redirect or demo fallback"""
    force_mock = request.args.get('mock') == '1'
    is_configured = bool(Config.GOOGLE_CLIENT_ID and not Config.GOOGLE_CLIENT_ID.startswith('your-google'))

    if force_mock or not is_configured:
        # Hackathon demo fallback for instant Google OAuth evaluation
        mock_user_info = {
            'google_id': 'google-demo-104928374829',
            'email': 'alex.google@stocksense.com',
            'full_name': 'Alex Morgan (Google)',
            'profile_picture': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
        }
        user = db_service.upsert_google_user(mock_user_info)
        session.clear()
        session['user_id'] = str(user['id'])
        session['user_email'] = user['email']
        session['user_name'] = user['full_name']
        session['user_role'] = user.get('role', 'admin')
        session['auth_provider'] = 'google'
        session['profile_picture'] = user.get('profile_picture', '')
        session.permanent = True
        flash(f"Signed in with Google as {user['full_name']} (Demo Account)", "success")
        return redirect(url_for('index'))

    # Live Google OAuth 2.0 Flow
    state = secrets.token_urlsafe(24)
    session['oauth_state'] = state

    redirect_uri = Config.GOOGLE_REDIRECT_URI or url_for('auth.google_callback', _external=True)

    google_params = {
        'client_id': Config.GOOGLE_CLIENT_ID,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'openid email profile',
        'state': state,
        'access_type': 'offline',
        'prompt': 'select_account'
    }

    google_auth_url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urllib.parse.urlencode(google_params)
    return redirect(google_auth_url)


@auth_bp.route('/auth/google/callback', methods=['GET'])
def google_callback():
    """Handles Google OAuth authorization code return and fetches user profile"""
    error = request.args.get('error')
    if error:
        flash(f"Google sign-in was cancelled: {error}", "warning")
        return redirect(url_for('auth.login'))

    code = request.args.get('code')
    state = request.args.get('state')

    # Verify state against CSRF
    expected_state = session.get('oauth_state')
    if not state or state != expected_state:
        flash("Google authentication state mismatch. Please try again.", "danger")
        return redirect(url_for('auth.login'))

    redirect_uri = Config.GOOGLE_REDIRECT_URI or url_for('auth.google_callback', _external=True)

    try:
        # Exchange authorization code for access tokens
        token_endpoint = 'https://oauth2.googleapis.com/token'
        token_data = {
            'code': code,
            'client_id': Config.GOOGLE_CLIENT_ID,
            'client_secret': Config.GOOGLE_CLIENT_SECRET,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code'
        }
        token_res = requests.post(token_endpoint, data=token_data, timeout=10)
        if token_res.status_code != 200:
            flash(f"Failed to obtain Google access token: {token_res.text}", "danger")
            return redirect(url_for('auth.login'))

        tokens = token_res.json()
        access_token = tokens.get('access_token')

        # Fetch authenticated user profile
        userinfo_endpoint = 'https://www.googleapis.com/oauth2/v3/userinfo'
        headers = {'Authorization': f"Bearer {access_token}"}
        userinfo_res = requests.get(userinfo_endpoint, headers=headers, timeout=10)
        if userinfo_res.status_code != 200:
            flash("Failed to retrieve Google profile information.", "danger")
            return redirect(url_for('auth.login'))

        userinfo = userinfo_res.json()

        # Upsert user record into Firestore users collection
        google_payload = {
            'google_id': userinfo.get('sub'),
            'email': userinfo.get('email'),
            'full_name': userinfo.get('name') or userinfo.get('given_name', 'Google Operator'),
            'profile_picture': userinfo.get('picture', '')
        }

        user = db_service.upsert_google_user(google_payload)

        # Initialize session
        session.clear()
        session['user_id'] = str(user['id'])
        session['user_email'] = user['email']
        session['user_name'] = user['full_name']
        session['user_role'] = user.get('role', 'admin')
        session['auth_provider'] = 'google'
        session['profile_picture'] = user.get('profile_picture', '')
        session.permanent = True

        flash(f"Signed in successfully as {user['full_name']} via Google!", "success")
        return redirect(url_for('index'))

    except Exception as e:
        print(f"[StockSense OAuth] Error in Google callback: {e}")
        flash("An error occurred during Google authentication. Please try again.", "danger")
        return redirect(url_for('auth.login'))


@auth_bp.route('/logout', methods=['GET', 'POST'])
def logout():
    """Terminates session and redirects user to login page"""
    session.clear()
    is_json = request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    if is_json:
        return api_response({'redirect': url_for('auth.login')}, "You have been logged out successfully")
    flash("You have been signed out of StockSense.", "info")
    return redirect(url_for('auth.login'))


@auth_bp.route('/api/auth/me', methods=['GET'])
def current_user():
    """Retrieves authenticated session user profile"""
    if not session.get('user_id'):
        return api_error("Not authenticated. Please sign in.", 401)
    return api_response({
        'id': session.get('user_id'),
        'email': session.get('user_email'),
        'name': session.get('user_name'),
        'role': session.get('user_role'),
        'auth_provider': session.get('auth_provider', 'email'),
        'profile_picture': session.get('profile_picture') or Config.DEFAULT_AVATAR_URL
    }, "Current user profile")

