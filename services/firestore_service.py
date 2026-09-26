"""
StockSense - Google Cloud Firestore Service Layer
Provides unified data access with live Firestore connectivity
and a robust offline/in-memory fallback for hackathon demos.
"""

import os
import datetime
from config import Config
from utils.helpers import get_iso_timestamp, get_current_date_str

# Attempt Firestore client import
try:
    from google.cloud import firestore
    FIRESTORE_AVAILABLE = True
except ImportError:
    FIRESTORE_AVAILABLE = False


class FirestoreService:
    def __init__(self):
        self.client = None
        self.is_live = False
        self.mock_db = {}
        self._initialize()

    def _initialize(self):
        """Initializes Google Cloud Firestore client or sets up mock store fallback"""
        if FIRESTORE_AVAILABLE and Config.GCP_PROJECT_ID:
            try:
                # If credentials file path provided, set explicitly
                if Config.GOOGLE_APPLICATION_CREDENTIALS and os.path.exists(Config.GOOGLE_APPLICATION_CREDENTIALS):
                    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = Config.GOOGLE_APPLICATION_CREDENTIALS
                
                # Connect to Firestore
                self.client = firestore.Client(
                    project=Config.GCP_PROJECT_ID,
                    database=Config.FIRESTORE_DATABASE
                )
                self.is_live = True
                print(f"[StockSense Firestore] Connected to GCP Project: {Config.GCP_PROJECT_ID}")
                return
            except Exception as e:
                print(f"[StockSense Firestore] GCP Connection attempt failed: {e}")
                self.client = None
                self.is_live = False

        if Config.USE_MOCK_FALLBACK:
            print("[StockSense Firestore] Running with Hackathon In-Memory Datastore fallback.")
            self._seed_mock_database()
        else:
            raise RuntimeError("Firestore is unavailable and USE_MOCK_FALLBACK is disabled.")

    def _seed_mock_database(self):
        """Seeds standard realistic data matching StockSense warehouse operations"""
        self.mock_db = {
            'products': {
                '1': {
                    'id': '1',
                    'name': 'Steel Rods',
                    'sku': 'SR-101',
                    'category': 'Raw Materials',
                    'unit': 'kg',
                    'mainWarehouseStock': 350,
                    'productionFloorStock': 70,
                    'reorderLevel': 150,
                    'createdAt': get_iso_timestamp()
                },
                '2': {
                    'id': '2',
                    'name': 'Screws',
                    'sku': 'SCR-502',
                    'category': 'Fasteners',
                    'unit': 'boxes',
                    'mainWarehouseStock': 120,
                    'productionFloorStock': 45,
                    'reorderLevel': 50,
                    'createdAt': get_iso_timestamp()
                },
                '3': {
                    'id': '3',
                    'name': 'Wood Panels',
                    'sku': 'WP-204',
                    'category': 'Raw Materials',
                    'unit': 'pcs',
                    'mainWarehouseStock': 18,
                    'productionFloorStock': 4,
                    'reorderLevel': 30,
                    'createdAt': get_iso_timestamp()
                },
                '4': {
                    'id': '4',
                    'name': 'Paint',
                    'sku': 'PNT-303',
                    'category': 'Chemicals & Coatings',
                    'unit': 'liters',
                    'mainWarehouseStock': 0,
                    'productionFloorStock': 0,
                    'reorderLevel': 25,
                    'createdAt': get_iso_timestamp()
                },
                '5': {
                    'id': '5',
                    'name': 'Chairs',
                    'sku': 'CHR-880',
                    'category': 'Finished Goods',
                    'unit': 'pcs',
                    'mainWarehouseStock': 85,
                    'productionFloorStock': 15,
                    'reorderLevel': 40,
                    'createdAt': get_iso_timestamp()
                },
                '6': {
                    'id': '6',
                    'name': 'Packaging Boxes',
                    'sku': 'PKG-412',
                    'category': 'Packaging',
                    'unit': 'boxes',
                    'mainWarehouseStock': 25,
                    'productionFloorStock': 10,
                    'reorderLevel': 50,
                    'createdAt': get_iso_timestamp()
                },
                '7': {
                    'id': '7',
                    'name': 'Safety Gloves',
                    'sku': 'GLV-601',
                    'category': 'Safety & PPE',
                    'unit': 'pairs',
                    'mainWarehouseStock': 210,
                    'productionFloorStock': 30,
                    'reorderLevel': 60,
                    'createdAt': get_iso_timestamp()
                },
                '8': {
                    'id': '8',
                    'name': 'Aluminum Sheets',
                    'sku': 'AL-705',
                    'category': 'Raw Materials',
                    'unit': 'pcs',
                    'mainWarehouseStock': 0,
                    'productionFloorStock': 0,
                    'reorderLevel': 20,
                    'createdAt': get_iso_timestamp()
                }
            },
            'warehouses': {
                'wh-main': {
                    'id': 'wh-main',
                    'name': 'Main Warehouse',
                    'code': 'WH-MAIN-01',
                    'location': 'Building A, Sector 4, Central Logistics Hub',
                    'capacity': 10000,
                    'supervisor': 'Alex Morgan',
                    'status': 'Operational'
                },
                'wh-prod': {
                    'id': 'wh-prod',
                    'name': 'Production Floor',
                    'code': 'WH-PROD-02',
                    'location': 'Building B, Sector 2, Manufacturing Floor',
                    'capacity': 3000,
                    'supervisor': 'Marcus Reed',
                    'status': 'Operational'
                }
            },
            'receipts': {
                'REC-2024-1042': {
                    'id': 'REC-2024-1042',
                    'supplier': 'Apex Industrial Supplies',
                    'productId': '1',
                    'productName': 'Steel Rods',
                    'productSku': 'SR-101',
                    'warehouse': 'Main Warehouse',
                    'quantity': 150,
                    'unit': 'kg',
                    'unitCost': 14.50,
                    'date': '2024-09-26',
                    'status': 'Completed',
                    'notes': 'PO-8921, verified and stacked on Rack A-12',
                    'createdAt': get_iso_timestamp()
                },
                'REC-2024-1041': {
                    'id': 'REC-2024-1041',
                    'supplier': 'FastenerHub Co.',
                    'productId': '2',
                    'productName': 'Screws',
                    'productSku': 'SCR-502',
                    'warehouse': 'Production Floor',
                    'quantity': 80,
                    'unit': 'boxes',
                    'unitCost': 8.20,
                    'date': '2024-09-26',
                    'status': 'Completed',
                    'notes': 'Direct line replenishment for Assembly Line 2',
                    'createdAt': get_iso_timestamp()
                }
            },
            'deliveries': {
                'DEL-2024-0542': {
                    'id': 'DEL-2024-0542',
                    'customer': 'Apex Robotics Ltd',
                    'orderRef': 'SO-8840',
                    'productId': '5',
                    'productName': 'Chairs',
                    'productSku': 'CHR-880',
                    'warehouse': 'Main Warehouse',
                    'quantity': 25,
                    'unit': 'pcs',
                    'date': '2024-09-26',
                    'status': 'Completed',
                    'notes': 'Direct pallet dispatch to customer receiving gate 2',
                    'createdAt': get_iso_timestamp()
                }
            },
            'transfers': {
                'TRF-2024-0219': {
                    'id': 'TRF-2024-0219',
                    'reference': 'TR-8910',
                    'productId': '1',
                    'productName': 'Steel Rods',
                    'productSku': 'SR-101',
                    'sourceWarehouse': 'Main Warehouse',
                    'destWarehouse': 'Production Floor',
                    'quantity': 40,
                    'unit': 'kg',
                    'date': '2024-09-26',
                    'status': 'Completed',
                    'notes': 'Shift 1 raw material replenishment',
                    'createdAt': get_iso_timestamp()
                }
            },
            'adjustments': {
                'ADJ-2024-0087': {
                    'id': 'ADJ-2024-0087',
                    'productId': '1',
                    'productName': 'Steel Rods',
                    'productSku': 'SR-101',
                    'warehouse': 'Main Warehouse',
                    'recordedQty': 360,
                    'countedQty': 350,
                    'difference': -10,
                    'reason': 'Physical Count Difference',
                    'date': '2024-09-26',
                    'status': 'Completed',
                    'notes': 'Quarterly stock audit reconciliation',
                    'createdAt': get_iso_timestamp()
                }
            },
            'movements': {},
            'users': {
                'usr-1': {
                    'id': 'usr-1',
                    'name': 'Alex Morgan',
                    'email': 'alex.m@stocksense.io',
                    'role': 'Warehouse Administrator',
                    'facility': 'Main Warehouse'
                },
                'usr-2': {
                    'id': 'usr-2',
                    'name': 'Marcus Reed',
                    'email': 'marcus.r@stocksense.io',
                    'role': 'Floor Supervisor',
                    'facility': 'Production Floor'
                }
            },
            'settings': {
                'general': {
                    'companyName': 'StockSense Global Logistics Inc.',
                    'facilityCode': 'WH-MAIN-01',
                    'contactEmail': 'ops@stocksense.io',
                    'currency': 'USD',
                    'timezone': 'America/New_York'
                }
            },
            'notifications': {}
        }

        # Initialize mock movement records from seed transactions
        self.mock_db['movements']['MOV-001'] = {
            'id': 'MOV-001',
            'transactionId': 'REC-2024-1042',
            'type': 'Receipt',
            'productId': '1',
            'productName': 'Steel Rods',
            'sku': 'SR-101',
            'source': 'Apex Industrial Supplies',
            'destination': 'Main Warehouse',
            'warehouse': 'Main Warehouse',
            'quantity': 150,
            'quantityDisplay': '+150 kg',
            'reference': 'PO-8921 Inbound',
            'date': '2024-09-26',
            'user': 'Alex Morgan',
            'status': 'Completed',
            'createdAt': get_iso_timestamp()
        }
        self.mock_db['movements']['MOV-002'] = {
            'id': 'MOV-002',
            'transactionId': 'DEL-2024-0542',
            'type': 'Delivery',
            'productId': '5',
            'productName': 'Chairs',
            'sku': 'CHR-880',
            'source': 'Main Warehouse',
            'destination': 'Apex Robotics Ltd',
            'warehouse': 'Main Warehouse',
            'quantity': -25,
            'quantityDisplay': '-25 pcs',
            'reference': 'SO-8840 Dispatch',
            'date': '2024-09-26',
            'user': 'Marcus Reed',
            'status': 'Completed',
            'createdAt': get_iso_timestamp()
        }
        self.mock_db['movements']['MOV-003'] = {
            'id': 'MOV-003',
            'transactionId': 'TRF-2024-0219',
            'type': 'Transfer',
            'productId': '1',
            'productName': 'Steel Rods',
            'sku': 'SR-101',
            'source': 'Main Warehouse',
            'destination': 'Production Floor',
            'warehouse': 'Main Warehouse → Production Floor',
            'quantity': 40,
            'quantityDisplay': '40 kg',
            'reference': 'TR-8910 Rebalance',
            'date': '2024-09-26',
            'user': 'Devon Clark',
            'status': 'Completed',
            'createdAt': get_iso_timestamp()
        }
        self.mock_db['movements']['MOV-004'] = {
            'id': 'MOV-004',
            'transactionId': 'ADJ-2024-0087',
            'type': 'Adjustment',
            'productId': '1',
            'productName': 'Steel Rods',
            'sku': 'SR-101',
            'source': 'System: 360',
            'destination': 'Physical: 350',
            'warehouse': 'Main Warehouse',
            'quantity': -10,
            'quantityDisplay': '-10 units',
            'reference': 'Physical Count Difference',
            'date': '2024-09-26',
            'user': 'Alex Morgan',
            'status': 'Completed',
            'createdAt': get_iso_timestamp()
        }

    # --------------------------------------------------------------------------
    # Generic CRUD Operations
    # --------------------------------------------------------------------------
    def get_all(self, collection_name):
        """Retrieves all documents in a collection"""
        if self.is_live and self.client:
            docs = self.client.collection(collection_name).stream()
            results = []
            for doc in docs:
                data = doc.to_dict()
                data['id'] = doc.id
                results.append(data)
            return results
        else:
            return list(self.mock_db.get(collection_name, {}).values())

    def get_by_id(self, collection_name, doc_id):
        """Retrieves a single document by ID"""
        if self.is_live and self.client:
            doc_ref = self.client.collection(collection_name).document(str(doc_id))
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()
                data['id'] = doc.id
                return data
            return None
        else:
            return self.mock_db.get(collection_name, {}).get(str(doc_id))

    def create(self, collection_name, data, doc_id=None):
        """Creates a document in Firestore with auto or explicit ID"""
        if not doc_id:
            doc_id = data.get('id') or str(datetime.datetime.now().timestamp()).replace('.', '')
        data['id'] = str(doc_id)
        if 'createdAt' not in data:
            data['createdAt'] = get_iso_timestamp()

        if self.is_live and self.client:
            self.client.collection(collection_name).document(str(doc_id)).set(data)
        else:
            if collection_name not in self.mock_db:
                self.mock_db[collection_name] = {}
            self.mock_db[collection_name][str(doc_id)] = data
        return data

    def update(self, collection_name, doc_id, updates):
        """Updates fields of an existing document"""
        updates['updatedAt'] = get_iso_timestamp()
        if self.is_live and self.client:
            doc_ref = self.client.collection(collection_name).document(str(doc_id))
            doc_ref.update(updates)
            updated_doc = doc_ref.get()
            data = updated_doc.to_dict()
            data['id'] = updated_doc.id
            return data
        else:
            doc = self.get_by_id(collection_name, str(doc_id))
            if doc:
                doc.update(updates)
                self.mock_db[collection_name][str(doc_id)] = doc
                return doc
            return None

    def delete(self, collection_name, doc_id):
        """Deletes a document by ID"""
        if self.is_live and self.client:
            self.client.collection(collection_name).document(str(doc_id)).delete()
            return True
        else:
            if collection_name in self.mock_db and str(doc_id) in self.mock_db[collection_name]:
                del self.mock_db[collection_name][str(doc_id)]
                return True
            return False

    # --------------------------------------------------------------------------
    # Specialized Inventory Business Operations
    # --------------------------------------------------------------------------
    def is_sku_duplicate(self, sku, exclude_id=None):
        """Checks if a SKU already exists in catalog"""
        products = self.get_all('products')
        target_sku = sku.strip().upper()
        for p in products:
            if exclude_id and str(p.get('id')) == str(exclude_id):
                continue
            if p.get('sku', '').strip().upper() == target_sku:
                return True
        return False

    def log_movement(self, movement_type, product_id, product_name, sku, source, destination, warehouse, quantity, reference, user='Alex Morgan', status='Completed'):
        """Logs an immutable entry to the central movements stock ledger"""
        mov_id = f"MOV-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}-{datetime.datetime.now().microsecond // 1000}"
        
        # Calculate human-readable display string
        qty_num = int(quantity)
        if movement_type == 'Receipt':
            qty_display = f"+{abs(qty_num)}"
        elif movement_type == 'Delivery':
            qty_display = f"-{abs(qty_num)}"
        elif movement_type == 'Adjustment':
            qty_display = f"{'+' if qty_num > 0 else ''}{qty_num}"
        else:
            qty_display = f"{qty_num}"

        entry = {
            'id': mov_id,
            'type': movement_type,
            'productId': str(product_id),
            'productName': product_name,
            'sku': sku,
            'source': source,
            'destination': destination,
            'warehouse': warehouse,
            'quantity': qty_num,
            'quantityDisplay': qty_display,
            'reference': reference or f"{movement_type} execution",
            'date': get_current_date_str(),
            'user': user,
            'status': status,
            'createdAt': get_iso_timestamp()
        }
        return self.create('movements', entry, doc_id=mov_id)


# Singleton Firestore service instance
db_service = FirestoreService()
