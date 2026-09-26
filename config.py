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
