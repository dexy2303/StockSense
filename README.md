# StockSense
Build a modular Inventory Management System (IMS) that digitizes and streamlines all stock-related oper ations within a business. The goal is to replace manual registers, Excel sheets, and scattered tracking  methods with a centralized, real-time, easy-to-use app.
StockSense
Tech Stack
Main Features
Suggested Project Structure
Authentication Flow
User Profile Image
Firestore Collections
Setup
Recommended Next Tasks
Demo Flow
Notes
StockSense
StockSense is a smart inventory management web application built for warehouse and stock operations. It helps teams manage products, incoming stock, delivery flow, internal transfers, stock adjustments, user authentication, and profile management in one clean dashboard.

Tech Stack
Frontend: HTML, CSS, JavaScript

Backend: Python, Flask

Database: Google Cloud Firestore

Authentication: Email/password login, Google OAuth, Flask session auth

Storage: User profile image upload support

Main Features
Inventory Management
Product creation and update

SKU-based product tracking

Category management

Unit of measure support

Stock by warehouse or location

Reorder level alerts

Operations
Receipts for incoming goods

Delivery orders for outgoing goods

Internal stock transfers

Stock adjustments for damaged or mismatched items

Movement history and ledger tracking

User System
Signup and login

Google OAuth login

Protected dashboard routes

User profile page

Custom uploaded profile picture

Logout and session management

Dashboard UI
Sidebar navigation

Profile menu

Search and filters

Responsive tables and cards

Attractive profile styling

Professional business dashboard layout

Suggested Project Structure
bash
StockSense/
├── app.py
├── config.py
├── routes/
│   ├── auth.py
│   ├── profile.py
│   ├── products.py
│   ├── receipts.py
│   ├── deliveries.py
│   ├── transfers.py
│   ├── adjustments.py
│   └── movements.py
├── services/
│   └── firestore_service.py
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── uploads/
├── templates/
│   ├── login.html
│   ├── signup.html
│   ├── index.html
│   └── profile.html
└── .env
Authentication Flow
Email/Password
User signs up with full name, email, password, and optional profile picture.

Password is hashed before storing.

User logs in through Flask.

Flask creates a session.

Protected dashboard becomes accessible.

Google OAuth
User clicks Continue with Google.

Google authentication flow starts.

Flask handles OAuth callback.

User profile is created or updated in Firestore.

Session is created and user enters the dashboard.

User Profile Image
Users can upload their own profile image instead of using a random avatar.

Recommended flow:

validate file type

sanitize file name

generate unique file name

save image in upload folder or cloud storage

store image path/URL in Firestore

display uploaded image in navbar, sidebar, dropdown, and profile page

Firestore Collections
Suggested collections:

users
Fields:

id

full_name

email

password_hash

auth_provider

google_id

profile_picture

role

created_at

updated_at

products
Fields:

id

name

sku

category

unit

reorder_level

stock_by_location

created_at

updated_at

movements
Fields:

id

product_id

movement_type

quantity

source_location

destination_location

note

user_id

user_name

user_email

created_at

Setup
1. Install dependencies
bash
pip install flask google-cloud-firestore authlib python-dotenv werkzeug
2. Configure environment variables
Create a .env file:

text
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FIRESTORE_PROJECT_ID=your_project_id
3. Run the app
bash
flask run
Recommended Next Tasks
Build profile settings page

Add notification center

Add role-based access control

Add seeded demo data

Improve settings page design

Add final deployment polish

Move profile image storage to Google Cloud Storage

Demo Flow
A clean demo sequence can be:

Signup or login

Enter dashboard

View products

Receive stock

Transfer stock

Deliver stock

Adjust inventory

Check movement history

Open profile section

Show uploaded profile image and user details

Notes
This project is suitable for hackathon presentation and can later be extended into a production-ready warehouse management system with stronger permissions, cloud file storage, analytics, and reporting.
