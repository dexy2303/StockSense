import os
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'stocksense-hackathon-secret-key-2026')
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() in ('true', '1', 't')
    PORT = int(os.getenv('PORT', 5000))
    HOST = os.getenv('HOST', '127.0.0.1')
    
    # Google Cloud Firestore Configuration
    GCP_PROJECT_ID = os.getenv('GCP_PROJECT_ID', '')
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', '')
    FIRESTORE_DATABASE = os.getenv('FIRESTORE_DATABASE', '(default)')
    FIRESTORE_EMULATOR_HOST = os.getenv('FIRESTORE_EMULATOR_HOST', '')
    
    # Hackathon-friendly fallback: fallback to mock store if Firestore is not authenticated
    USE_MOCK_FALLBACK = os.getenv('USE_MOCK_FALLBACK', 'True').lower() in ('true', '1', 't')

    # Google OAuth 2.0 Credentials
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '')
    GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', '')

    # Profile Avatar Upload Settings
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads', 'avatars')
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB maximum request payload
    ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
    DEFAULT_AVATAR_URL = '/static/img/default-avatar.svg'
