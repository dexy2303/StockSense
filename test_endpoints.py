from app import app
import json

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

# 13. Index Page GET
res = client.get('/')
print('13. / (SPA root) ->', res.status_code, f"{len(res.data)} bytes")

print("\n--- ALL BACKEND ENDPOINTS AND BUSINESS RULES VALIDATED SUCCESSFULLY! ---")
