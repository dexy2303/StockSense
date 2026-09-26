from app import app
import json
import io

client = app.test_client()


print("--- Testing API Endpoints ---")

# 1. Health check
res = client.get('/api/health')
print('1. /api/health ->', res.status_code, res.get_json()['data']['database']['mode'])

# 2. Products GET
res = client.get('/api/products')
data = res.get_json()['data']
print('2. /api/products GET ->', res.status_code, f"{len(data)} products")

# 3. Product POST (Add product)
new_prod = {
    "name": "Industrial Carbon Steel Tube",
    "sku": "CST-900",
    "category": "Raw Materials",
    "unit": "Meters",
    "reorderLevel": 20,
    "initialStock": 50,
    "warehouse": "Main Warehouse"
}
res = client.post('/api/products', json=new_prod)
print('3. /api/products POST ->', res.status_code, res.get_json()['message'])
created_id = res.get_json()['data']['id']

# 4. Duplicate SKU check (should fail with 409)
res = client.post('/api/products', json=new_prod)
print('4. Duplicate SKU Check ->', res.status_code, res.get_json()['message'])
assert res.status_code == 409, "Expected 409 for duplicate SKU"

# 5. Low stock query
res = client.get('/api/low-stock')
print('5. /api/low-stock ->', res.status_code, f"{len(res.get_json()['data'])} low stock items")

# 6. Warehouses GET
res = client.get('/api/warehouses')
print('6. /api/warehouses GET ->', res.status_code, f"{len(res.get_json()['data'])} facilities")

# 7. Receipts POST (Receive stock)
receipt_payload = {
    "supplier": "Apex Industrial Supplies",
    "productId": created_id,
    "warehouse": "Main Warehouse",
    "quantity": 100,
    "unitCost": 45.0,
    "date": "2026-09-26",
    "notes": "Incoming replenishment shipment"
}
res = client.post('/api/receipts', json=receipt_payload)
print('7. /api/receipts POST ->', res.status_code, res.get_json()['data']['id'])

# 8. Deliveries POST (Customer order - sufficiency check)
# First try excessive quantity (should fail with 400)
deliv_excessive = {
    "customer": "MegaCorp Ltd",
    "productId": created_id,
    "warehouse": "Main Warehouse",
    "quantity": 999999,
    "date": "2026-09-26",
    "notes": "Large order exceeding stock"
}
res = client.post('/api/deliveries', json=deliv_excessive)
print('8a. /api/deliveries POST (Excessive) ->', res.status_code, res.get_json()['message'])
assert res.status_code == 400, "Expected 400 for excessive delivery quantity"

# Valid delivery
deliv_valid = {
    "customer": "MegaCorp Ltd",
    "productId": created_id,
    "warehouse": "Main Warehouse",
    "quantity": 25,
    "date": "2026-09-26",
    "notes": "Urgent dispatch"
}
res = client.post('/api/deliveries', json=deliv_valid)
print('8b. /api/deliveries POST (Valid) ->', res.status_code, res.get_json()['data']['id'])

# 9. Transfers POST (Inter-warehouse transfer)
# Test same facility prevention
trf_same = {
    "productId": created_id,
    "sourceWarehouse": "Main Warehouse",
    "destWarehouse": "Main Warehouse",
    "quantity": 10
}
res = client.post('/api/transfers', json=trf_same)
print('9a. /api/transfers POST (Same Facility) ->', res.status_code, res.get_json()['message'])
assert res.status_code == 400, "Expected 400 for same facility transfer"

# Valid transfer
trf_valid = {
    "productId": created_id,
    "sourceWarehouse": "Main Warehouse",
    "destWarehouse": "Production Floor",
    "quantity": 30,
    "date": "2026-09-26",
    "reference": "TRF-TEST-001"
}
res = client.post('/api/transfers', json=trf_valid)
print('9b. /api/transfers POST (Valid) ->', res.status_code, res.get_json()['data']['id'])

# 10. Adjustments POST (Stock count reconciliation)
adj_valid = {
    "productId": created_id,
    "warehouse": "Production Floor",
    "countedQty": 28,
    "reason": "Physical Count Difference",
    "date": "2026-09-26",
    "notes": "Found 2 units scrap damage during floor count"
}
res = client.post('/api/adjustments', json=adj_valid)
print('10. /api/adjustments POST ->', res.status_code, res.get_json()['data']['id'])

# 11. Movements GET (Audit ledger)
res = client.get('/api/movements')
movements = res.get_json()['data']
print('11. /api/movements GET ->', res.status_code, f"{len(movements)} logged movements")

# 12. Recent Movements GET
res = client.get('/api/movements/recent?limit=5')
print('12. /api/movements/recent ->', res.status_code, f"{len(res.get_json()['data'])} recent items")

# 13. Unauthenticated Index Page GET (Should redirect to /login)
res = client.get('/')
print('13. / (Unauthenticated redirect check) ->', res.status_code, 'Location:', res.headers.get('Location'))
assert res.status_code == 302, f"Expected 302 redirect to /login, got {res.status_code}"
assert '/login' in res.headers.get('Location', '')

# 14. GET /login and GET /signup templates
res = client.get('/login')
assert res.status_code == 200, f"Expected 200 for /login, got {res.status_code}"
print('14a. /login GET ->', res.status_code, 'Login page rendered')

res = client.get('/signup')
assert res.status_code == 200, f"Expected 200 for /signup, got {res.status_code}"
print('14b. /signup GET ->', res.status_code, 'Signup page rendered')

# 15. User Signup POST
signup_payload = {
    "full_name": "Marcus Vance",
    "email": "marcus.vance@stocksense.com",
    "password": "Password@123",
    "confirm_password": "Password@123"
}
res = client.post('/signup', json=signup_payload)
print('15. /signup POST ->', res.status_code, res.get_json()['message'])
assert res.status_code == 201, f"Expected 201 on signup, got {res.status_code}"

# 16. Duplicate Email Check (Should fail with 409)
res = client.post('/signup', json=signup_payload)
print('16. Duplicate Email Check ->', res.status_code, res.get_json()['message'])
assert res.status_code == 409, f"Expected 409 for duplicate email, got {res.status_code}"

# 17. Invalid Login (Wrong password)
bad_login = {
    "email": "marcus.vance@stocksense.com",
    "password": "WrongPassword!"
}
res = client.post('/login', json=bad_login)
print('17. Invalid Login Check ->', res.status_code, res.get_json()['message'])
assert res.status_code == 401, f"Expected 401 for wrong credentials, got {res.status_code}"

# 18. Valid Login (Pre-seeded demo admin or newly created user)
valid_login = {
    "email": "admin@stocksense.com",
    "password": "Admin@123"
}
res = client.post('/login', json=valid_login)
print('18. Valid Login POST ->', res.status_code, res.get_json()['message'])
assert res.status_code == 200, f"Expected 200 for valid login, got {res.status_code}"

# 19. Authenticated Index Page Access
res = client.get('/')
print('19. / (Authenticated SPA root) ->', res.status_code, f"{len(res.data)} bytes")
assert res.status_code == 200, f"Expected 200 for authenticated index, got {res.status_code}"

# 20. Current User API check
res = client.get('/api/auth/me')
print('20. /api/auth/me ->', res.status_code, res.get_json()['data']['email'])
assert res.status_code == 200, f"Expected 200 for /api/auth/me, got {res.status_code}"

# 21. Logout GET (Should clear session and redirect to /login)
res = client.get('/logout')
print('21. /logout ->', res.status_code, 'Location:', res.headers.get('Location'))
assert res.status_code == 302, f"Expected 302 redirect after logout, got {res.status_code}"

# 22. Subsequent unauthenticated index access should redirect again
res = client.get('/')
assert res.status_code == 302, "Expected session to be cleared after logout"

# 23. Google OAuth Login flow (/auth/google/login in evaluation/mock mode)
res = client.get('/auth/google/login?mock=1')
print('23. /auth/google/login ->', res.status_code, 'Location:', res.headers.get('Location'))
assert res.status_code == 302, f"Expected 302 redirect on Google login, got {res.status_code}"
assert res.headers.get('Location') in ['/', 'http://localhost/']

# 24. Authenticated Google User Session (/api/auth/me)
res = client.get('/api/auth/me')
user_data = res.get_json()['data']
print('24. /api/auth/me (Google User) ->', res.status_code, user_data['name'], f"[{user_data['auth_provider']}]")
assert res.status_code == 200, f"Expected 200 for Google auth/me, got {res.status_code}"
assert user_data['auth_provider'] == 'google', f"Expected auth_provider 'google', got {user_data['auth_provider']}"
assert user_data['email'] == 'alex.google@stocksense.com'

# 25. Authenticated Index for Google User
res = client.get('/')
assert res.status_code == 200, f"Expected 200 for Google authenticated index, got {res.status_code}"

# 26. Logout Google User
res = client.get('/logout')
assert res.status_code == 302, f"Expected 302 redirect on logout, got {res.status_code}"

# 27. User Signup with Profile Picture Upload (multipart/form-data)
avatar_bytes = io.BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4")
signup_form_data = {
    'full_name': 'Sarah Connor',
    'email': 'sarah.connor@stocksense.com',
    'password': 'Password@123',
    'confirm_password': 'Password@123',
    'avatar': (avatar_bytes, 'sarah_avatar.png')
}
res = client.post('/signup', data=signup_form_data, content_type='multipart/form-data')
print('27. /signup with avatar POST ->', res.status_code, 'Location:', res.headers.get('Location'))
assert res.status_code in [201, 302]

# Verify the uploaded avatar was saved and set in session
res = client.get('/api/auth/me')
me_data = res.get_json()['data']
print('27b. User avatar inspection ->', me_data['profile_picture'])
assert me_data['profile_picture'].startswith('/static/uploads/avatars/'), f"Expected avatar in /static/uploads/avatars/, got {me_data['profile_picture']}"

# 28. Signup with invalid file extension (should fail with 400)
bad_file = io.BytesIO(b"malicious script content")
bad_signup_data = {
    'full_name': 'Hacker Bob',
    'email': 'bob@badactor.com',
    'password': 'Password@123',
    'confirm_password': 'Password@123',
    'avatar': (bad_file, 'payload.exe')
}
res = client.post('/signup', data=bad_signup_data, content_type='multipart/form-data')
print('28. /signup with invalid file extension ->', res.status_code)
assert res.status_code == 400, f"Expected 400 for invalid file extension, got {res.status_code}"

# 29. Signup without avatar uses default placeholder
signup_no_avatar = {
    'full_name': 'David Miller',
    'email': 'david.miller@stocksense.com',
    'password': 'Password@123',
    'confirm_password': 'Password@123'
}
res = client.post('/signup', data=signup_no_avatar, content_type='multipart/form-data')
assert res.status_code in [201, 302]
res = client.get('/api/auth/me')
assert res.get_json()['data']['profile_picture'] == '/static/img/default-avatar.svg', f"Expected default avatar, got {res.get_json()['data']['profile_picture']}"
print('29. /signup without avatar -> default placeholder verified')

# 30. Direct avatar upload endpoint (/api/user/avatar)
new_avatar_bytes = io.BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4")
res = client.post('/api/user/avatar', data={'avatar': (new_avatar_bytes, 'updated_david.png')}, content_type='multipart/form-data')
print('30. /api/user/avatar POST ->', res.status_code, res.get_json()['data']['profile_picture'])
assert res.status_code == 200
assert res.get_json()['data']['profile_picture'].startswith('/static/uploads/avatars/')

# 31. Profile update endpoint (/api/user/profile)
res = client.get('/api/user/profile')
assert res.status_code == 200
profile_data = res.get_json()['data']
print('31a. /api/user/profile GET ->', profile_data['full_name'], profile_data['profile_picture'])

# Update name via /api/user/profile
res = client.post('/api/user/profile', data={'full_name': 'David Miller (Lead Ops)'}, content_type='multipart/form-data')
assert res.status_code == 200
assert res.get_json()['data']['full_name'] == 'David Miller (Lead Ops)'
print('31b. /api/user/profile POST update ->', res.get_json()['message'])

# 32. Google user custom avatar replacement & persistence
# Sign in with Google
client.get('/auth/google/login?mock=1')
res = client.get('/api/auth/me')
google_user = res.get_json()['data']
initial_pic = google_user['profile_picture']
print('32a. Google user initial avatar ->', initial_pic)

# Replace with custom uploaded image
custom_google_avatar = io.BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4")
res = client.post('/api/user/avatar', data={'avatar': (custom_google_avatar, 'my_custom_google.webp')}, content_type='multipart/form-data')
assert res.status_code == 200
uploaded_pic = res.get_json()['data']['profile_picture']
print('32b. Google user custom uploaded avatar ->', uploaded_pic)
assert uploaded_pic.startswith('/static/uploads/avatars/')

# Simulate future Google OAuth login for the same user
client.get('/auth/google/login?mock=1')
res = client.get('/api/auth/me')
persisted_pic = res.get_json()['data']['profile_picture']
print('32c. Google user avatar after re-login ->', persisted_pic)
assert persisted_pic == uploaded_pic, f"Expected custom avatar {uploaded_pic} to be preserved, got {persisted_pic}"

print("\n--- ALL BACKEND ENDPOINTS, AUTHENTICATION, GOOGLE OAUTH & AVATAR UPLOAD FLOWS VALIDATED SUCCESSFULLY! ---")



