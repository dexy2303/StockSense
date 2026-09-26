/**
 * StockSense - Warehouse Inventory Management System
 * Vanilla JavaScript Frontend Architecture
 * Dashboard, Products Catalog, Receive Stock & Delivery Orders Operations
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

/* ==========================================================================
   Global State & Sample Datasets
   (Structured for future Flask REST API integration)
   ========================================================================== */

// Sample Products Catalog (at least 8 products specified in requirement)
// In production: Replace with fetch('/api/products') later
let productsData = [
    {
        id: 1,
        name: "Steel Rods",
        sku: "SR-101",
        category: "Raw Materials",
        unit: "kg",
        mainWarehouseStock: 350,
        productionFloorStock: 70,
        reorderLevel: 150
    },
    {
        id: 2,
        name: "Screws",
        sku: "SCR-502",
        category: "Fasteners",
        unit: "boxes",
        mainWarehouseStock: 120,
        productionFloorStock: 45,
        reorderLevel: 50
    },
    {
        id: 3,
        name: "Wood Panels",
        sku: "WP-204",
        category: "Raw Materials",
        unit: "pcs",
        mainWarehouseStock: 18,
        productionFloorStock: 4,
        reorderLevel: 30
    },
    {
        id: 4,
        name: "Paint",
        sku: "PNT-303",
        category: "Chemicals & Coatings",
        unit: "liters",
        mainWarehouseStock: 0,
        productionFloorStock: 0,
        reorderLevel: 25
    },
    {
        id: 5,
        name: "Chairs",
        sku: "CHR-880",
        category: "Finished Goods",
        unit: "pcs",
        mainWarehouseStock: 85,
        productionFloorStock: 15,
        reorderLevel: 40
    },
    {
        id: 6,
        name: "Packaging Boxes",
        sku: "PKG-412",
        category: "Packaging",
        unit: "boxes",
        mainWarehouseStock: 25,
        productionFloorStock: 10,
        reorderLevel: 50
    },
    {
        id: 7,
        name: "Safety Gloves",
        sku: "GLV-601",
        category: "Safety & PPE",
        unit: "pairs",
        mainWarehouseStock: 210,
        productionFloorStock: 30,
        reorderLevel: 60
    },
    {
        id: 8,
        name: "Aluminum Sheets",
        sku: "AL-705",
        category: "Raw Materials",
        unit: "pcs",
        mainWarehouseStock: 0,
        productionFloorStock: 0,
        reorderLevel: 20
    }
];

// Sample Suppliers Dataset
// In production: Replace with fetch('/api/suppliers') later
const suppliersData = [
    "Apex Industrial Supplies",
    "SteelWorks International",
    "FastenerHub Co.",
    "ChemTech Solutions",
    "Global Packaging Logistics",
    "Titanium & Alloy Works",
    "SafetyFirst Equipment"
];

// Warehouses Dataset (loaded from GET /api/warehouses)
let warehousesData = [
    { id: 'wh-main', name: 'Main Warehouse', code: 'WH-MAIN-01', capacity: 10000, storedUnits: 808, stockedSkus: 6, loadPercentage: 8.1, availableCapacity: 9192 },
    { id: 'wh-prod', name: 'Production Floor', code: 'WH-PROD-02', capacity: 3000, storedUnits: 174, stockedSkus: 6, loadPercentage: 5.8, availableCapacity: 2826 }
];

// Sample Inbound Receipts Dataset
// In production: Replace with fetch('/api/receipts') later
let receiptsData = [
    {
        id: "REC-2024-1042",
        supplier: "Apex Industrial Supplies",
        productId: 1,
        productName: "Steel Rods",
        productSku: "SR-101",
        warehouse: "Main Warehouse",
        quantity: 150,
        unit: "kg",
        unitCost: 14.50,
        date: "2024-09-26",
        status: "Completed",
        notes: "PO-8921, verified and stacked on Rack A-12"
    },
    {
        id: "REC-2024-1041",
        supplier: "FastenerHub Co.",
        productId: 2,
        productName: "Screws",
        productSku: "SCR-502",
        warehouse: "Production Floor",
        quantity: 80,
        unit: "boxes",
        unitCost: 8.20,
        date: "2024-09-26",
        status: "Completed",
        notes: "Direct line replenishment for Assembly Line 2"
    },
    {
        id: "REC-2024-1040",
        supplier: "ChemTech Solutions",
        productId: 4,
        productName: "Paint",
        productSku: "PNT-303",
        warehouse: "Main Warehouse",
        quantity: 50,
        unit: "liters",
        unitCost: 22.00,
        date: "2024-09-25",
        status: "Completed",
        notes: "Hazmat chemical storage locker inspection passed"
    },
    {
        id: "REC-2024-1039",
        supplier: "Global Packaging Logistics",
        productId: 6,
        productName: "Packaging Boxes",
        productSku: "PKG-412",
        warehouse: "Main Warehouse",
        quantity: 100,
        unit: "boxes",
        unitCost: 4.75,
        date: "2024-09-25",
        status: "Completed",
        notes: "Pallet #7 verified"
    },
    {
        id: "REC-2024-1038",
        supplier: "SafetyFirst Equipment",
        productId: 7,
        productName: "Safety Gloves",
        productSku: "GLV-601",
        warehouse: "Production Floor",
        quantity: 40,
        unit: "pairs",
        unitCost: 6.50,
        date: "2024-09-24",
        status: "Draft",
        notes: "Awaiting QA sign-off from shift lead"
    },
    {
        id: "REC-2024-1037",
        supplier: "SteelWorks International",
        productId: 8,
        productName: "Aluminum Sheets",
        productSku: "AL-705",
        warehouse: "Main Warehouse",
        quantity: 60,
        unit: "pcs",
        unitCost: 45.00,
        date: "2024-09-23",
        status: "Completed",
        notes: "Heavy haul consignment dock 3"
    }
];

// Sample Outbound Delivery Orders Dataset
// In production: Replace with fetch('/api/deliveries') later
let deliveriesData = [
    {
        id: "DEL-2024-0542",
        customer: "Apex Robotics Ltd",
        orderRef: "SO-8840",
        productId: 5,
        productName: "Chairs",
        productSku: "CHR-880",
        warehouse: "Main Warehouse",
        quantity: 25,
        unit: "pcs",
        date: "2024-09-26",
        status: "Completed",
        notes: "Direct pallet dispatch to customer receiving gate 2"
    },
    {
        id: "DEL-2024-0541",
        customer: "Apex Robotics Ltd",
        orderRef: "SO-8839",
        productId: 3,
        productName: "Wood Panels",
        productSku: "WP-204",
        warehouse: "Main Warehouse",
        quantity: 4,
        unit: "pcs",
        date: "2024-09-26",
        status: "Completed",
        notes: "Surface finish inspection approved"
    },
    {
        id: "DEL-2024-0540",
        customer: "Nexus Logistics",
        orderRef: "SO-8835",
        productId: 6,
        productName: "Packaging Boxes",
        productSku: "PKG-412",
        warehouse: "Main Warehouse",
        quantity: 15,
        unit: "boxes",
        date: "2024-09-25",
        status: "Packed",
        notes: "Stage in outbound bay 3 for courier collection"
    },
    {
        id: "DEL-2024-0539",
        customer: "Horizon Manufacturing",
        orderRef: "SO-8831",
        productId: 1,
        productName: "Steel Rods",
        productSku: "SR-101",
        warehouse: "Main Warehouse",
        quantity: 50,
        unit: "kg",
        date: "2024-09-25",
        status: "Completed",
        notes: "Priority freight dispatch"
    },
    {
        id: "DEL-2024-0538",
        customer: "Acme Automation Corp",
        orderRef: "SO-8828",
        productId: 2,
        productName: "Screws",
        productSku: "SCR-502",
        warehouse: "Production Floor",
        quantity: 20,
        unit: "boxes",
        date: "2024-09-24",
        status: "Pending",
        notes: "Awaiting transport trailer confirmation"
    },
    {
        id: "DEL-2024-0537",
        customer: "Vanguard Builders",
        orderRef: "SO-8822",
        productId: 7,
        productName: "Safety Gloves",
        productSku: "GLV-601",
        warehouse: "Main Warehouse",
        quantity: 30,
        unit: "pairs",
        date: "2024-09-23",
        status: "Completed",
        notes: "Signed bill of lading archived"
    }
];

// Sample Inter-Warehouse Stock Transfers Dataset
// In production: Replace with fetch('/api/transfers') later
let transfersData = [
    {
        id: "TRF-2024-0219",
        reference: "TR-8910",
        productId: 1,
        productName: "Steel Rods",
        productSku: "SR-101",
        sourceWarehouse: "Main Warehouse",
        destWarehouse: "Production Floor",
        quantity: 40,
        unit: "kg",
        date: "2024-09-26",
        status: "Completed",
        notes: "Shift 1 raw material replenishment for milling section"
    },
    {
        id: "TRF-2024-0218",
        reference: "TR-8908",
        productId: 2,
        productName: "Screws",
        productSku: "SCR-502",
        sourceWarehouse: "Main Warehouse",
        destWarehouse: "Production Floor",
        quantity: 20,
        unit: "boxes",
        date: "2024-09-26",
        status: "Completed",
        notes: "Fasteners restock for workstation B"
    },
    {
        id: "TRF-2024-0217",
        reference: "TR-8902",
        productId: 5,
        productName: "Chairs",
        productSku: "CHR-880",
        sourceWarehouse: "Production Floor",
        destWarehouse: "Main Warehouse",
        quantity: 10,
        unit: "pcs",
        date: "2024-09-25",
        status: "In Transit",
        notes: "Finished inspection batches staged for packaging bay"
    },
    {
        id: "TRF-2024-0216",
        reference: "TR-8899",
        productId: 7,
        productName: "Safety Gloves",
        productSku: "GLV-601",
        sourceWarehouse: "Main Warehouse",
        destWarehouse: "Production Floor",
        quantity: 15,
        unit: "pairs",
        date: "2024-09-25",
        status: "Completed",
        notes: "PPE supply restock"
    },
    {
        id: "TRF-2024-0215",
        reference: "TR-8895",
        productId: 3,
        productName: "Wood Panels",
        productSku: "WP-204",
        sourceWarehouse: "Main Warehouse",
        destWarehouse: "Production Floor",
        quantity: 5,
        unit: "pcs",
        date: "2024-09-24",
        status: "Draft",
        notes: "Pending carpentry supervisor confirmation"
    }
];

// Sample Inventory Stock Adjustments Dataset
// In production: Replace with fetch('/api/adjustments') later
let adjustmentsData = [
    {
        id: "ADJ-2024-0087",
        productId: 1,
        productName: "Steel Rods",
        productSku: "SR-101",
        warehouse: "Main Warehouse",
        recordedQty: 360,
        countedQty: 350,
        difference: -10,
        reason: "Physical Count Difference",
        date: "2024-09-26",
        status: "Completed",
        notes: "Quarterly stock audit reconciliation"
    },
    {
        id: "ADJ-2024-0086",
        productId: 4,
        productName: "Paint",
        productSku: "PNT-303",
        warehouse: "Main Warehouse",
        recordedQty: 5,
        countedQty: 0,
        difference: -5,
        reason: "Damaged",
        date: "2024-09-25",
        status: "Completed",
        notes: "Container seal breach during rack transit"
    },
    {
        id: "ADJ-2024-0085",
        productId: 2,
        productName: "Screws",
        productSku: "SCR-502",
        warehouse: "Production Floor",
        recordedQty: 40,
        countedQty: 45,
        difference: 5,
        reason: "Returned Items",
        date: "2024-09-25",
        status: "Completed",
        notes: "Surplus hardware returned from assembly line 1"
    },
    {
        id: "ADJ-2024-0084",
        productId: 3,
        productName: "Wood Panels",
        productSku: "WP-204",
        warehouse: "Main Warehouse",
        recordedQty: 20,
        countedQty: 18,
        difference: -2,
        reason: "Lost Inventory",
        date: "2024-09-24",
        status: "Reviewed",
        notes: "Discrepancy noted in Bay D, pending supervisor signoff"
    },
    {
        id: "ADJ-2024-0083",
        productId: 7,
        productName: "Safety Gloves",
        productSku: "GLV-601",
        warehouse: "Production Floor",
        recordedQty: 30,
        countedQty: 30,
        difference: 0,
        reason: "Physical Count Difference",
        date: "2024-09-23",
        status: "Completed",
        notes: "Routine cycle count - 100% matched"
    }
];

// Sample Low Stock Alert Items for Dashboard
// In production: Replace with fetch('/api/products/low-stock') later
let lowStockProducts = [
    {
        id: 1,
        name: "Industrial Steel Bearings",
        category: "Mechanical Components",
        sku: "BRG-8821-X",
        warehouse: "Central Hub",
        currentQty: 14,
        reorderLevel: 50,
        status: "Reorder"
    },
    {
        id: 2,
        name: "Hydraulic Seal Kit (Type B)",
        category: "Fluid Power",
        sku: "HSL-4090-K",
        warehouse: "West Coast Facility",
        currentQty: 6,
        reorderLevel: 30,
        status: "Reorder"
    },
    {
        id: 3,
        name: "Micro-Controller Unit V3",
        category: "Electronics",
        sku: "MCU-1044-A",
        warehouse: "Central Hub",
        currentQty: 18,
        reorderLevel: 75,
        status: "Reorder"
    },
    {
        id: 4,
        name: "Pneumatic Fitting 1/4\" Elbow",
        category: "Pneumatics",
        sku: "PFT-0250-E",
        warehouse: "East Coast Annex",
        currentQty: 22,
        reorderLevel: 100,
        status: "Reorder"
    },
    {
        id: 5,
        name: "Heavy Duty Conveyor Belt 5m",
        category: "Conveyor Systems",
        sku: "CVB-5000-HD",
        warehouse: "Central Hub",
        currentQty: 3,
        reorderLevel: 15,
        status: "Reorder"
    },
    {
        id: 6,
        name: "Thermal Transfer Ribbon 110mm",
        category: "Packaging & Labeling",
        sku: "TTR-1100-BK",
        warehouse: "West Coast Facility",
        currentQty: 12,
        reorderLevel: 60,
        status: "Reorder"
    },
    {
        id: 7,
        name: "Brushless DC Motor 24V",
        category: "Motors & Drives",
        sku: "BLDC-0240-M",
        warehouse: "East Coast Annex",
        currentQty: 5,
        reorderLevel: 25,
        status: "Reorder"
    },
    {
        id: 8,
        name: "Barcode Scanner Handheld LS220",
        category: "Warehouse Tech",
        sku: "BCS-0220-WL",
        warehouse: "Central Hub",
        currentQty: 4,
        reorderLevel: 20,
        status: "Reorder"
    }
];

// Sample Stock Movements Log
// In production: Replace with fetch('/api/movements') later
let stockMovements = [
    {
        id: "REC-2024-1042",
        timestamp: "Today, 09:24 AM",
        productName: "Steel Rods",
        type: "Receipt",
        quantity: "+150",
        route: "Apex Industrial Supplies → Main Warehouse",
        user: "Alex Morgan"
    },
    {
        id: "DEL-2024-0542",
        timestamp: "Today, 08:50 AM",
        productName: "Chairs",
        type: "Delivery",
        quantity: "-25",
        route: "Main Warehouse → Apex Robotics",
        user: "Marcus Reed"
    },
    {
        id: "TRF-2024-0219",
        timestamp: "Today, 08:15 AM",
        productName: "Pneumatic Fitting 1/4\" Elbow",
        type: "Transfer",
        quantity: "40",
        route: "Central Hub → West Coast",
        user: "Devon Clark"
    },
    {
        id: "ADJ-2024-0087",
        timestamp: "Yesterday, 04:30 PM",
        productName: "Industrial Steel Bearings",
        type: "Adjustment",
        quantity: "-2",
        route: "Central Hub (Damaged Stock)",
        user: "Alex Morgan"
    },
    {
        id: "REC-2024-1040",
        timestamp: "Yesterday, 02:15 PM",
        productName: "Paint",
        type: "Receipt",
        quantity: "+50",
        route: "ChemTech Solutions → Main Warehouse",
        user: "Elena Vance"
    }
];

// Tracking product deletion target
let productPendingDeleteId = null;

/* ==========================================================================
   Reusable API Helper Functions (Flask + Firestore REST API)
   ========================================================================== */

/**
 * Executes a GET request against Flask API endpoints
 */
async function apiGet(url) {
    try {
        const response = await fetch(url);
        const result = await response.json();
        if (!response.ok || (result && result.success === false)) {
            const errorMsg = (result && result.message) || `Request failed with status ${response.status}`;
            throw new Error(errorMsg);
        }
        return result;
    } catch (err) {
        console.error(`apiGet error (${url}):`, err);
        throw err;
    }
}

/**
 * Executes a POST request against Flask API endpoints
 */
async function apiPost(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok || (result && result.success === false)) {
            const errorMsg = (result && result.message) || `Request failed with status ${response.status}`;
            throw new Error(errorMsg);
        }
        return result;
    } catch (err) {
        console.error(`apiPost error (${url}):`, err);
        throw err;
    }
}

/**
 * Executes a PUT request against Flask API endpoints
 */
async function apiPut(url, data) {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok || (result && result.success === false)) {
            const errorMsg = (result && result.message) || `Request failed with status ${response.status}`;
            throw new Error(errorMsg);
        }
        return result;
    } catch (err) {
        console.error(`apiPut error (${url}):`, err);
        throw err;
    }
}

/**
 * Executes a DELETE request against Flask API endpoints
 */
async function apiDelete(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!response.ok || (result && result.success === false)) {
            const errorMsg = (result && result.message) || `Request failed with status ${response.status}`;
            throw new Error(errorMsg);
        }
        return result;
    } catch (err) {
        console.error(`apiDelete error (${url}):`, err);
        throw err;
    }
}

/**
 * Renders a clean loading spinner indicator in any data table tbody
 */
function renderTableLoading(tbodyId, colSpan = 8, message = 'Loading live data from server...') {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = `
        <tr>
            <td colspan="${colSpan}" class="loading-table-row">
                <div class="empty-icon"><i class="fa-solid fa-spinner fa-spin"></i></div>
                <p>${escapeHtml(message)}</p>
            </td>
        </tr>
    `;
}

/**
 * Synchronizes warehouse select dropdowns across the application
 */
function populateWarehouseDropdowns() {
    const warehouseSelects = [
        document.getElementById('receive-warehouse'),
        document.getElementById('delivery-warehouse'),
        document.getElementById('adjustment-warehouse'),
        document.getElementById('add-product-warehouse'),
        document.getElementById('products-warehouse-filter'),
        document.getElementById('history-warehouse-filter')
    ];

    warehouseSelects.forEach(sel => {
        if (!sel) return;
        const cur = sel.value;
        const isFilter = sel.id.includes('filter');
        sel.innerHTML = isFilter ? '<option value="ALL">All Warehouses</option>' : '<option value="">Select Warehouse</option>';
        warehousesData.forEach(w => {
            const name = typeof w === 'object' && w.name ? w.name : w;
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            if (name === cur) opt.selected = true;
            sel.appendChild(opt);
        });
        if (cur && sel.querySelector(`option[value="${cur}"]`)) {
            sel.value = cur;
        } else if (!isFilter && warehousesData.length > 0) {
            const first = typeof warehousesData[0] === 'object' ? warehousesData[0].name : warehousesData[0];
            sel.value = first;
        }
    });

    populateTransferDropdowns();
}

/**
 * Renders live warehouse facility capacity bars on the dashboard
 */
function renderDashboardWarehouses(warehouses) {
    const container = document.getElementById('dashboard-warehouse-list');
    if (!container || !warehouses || warehouses.length === 0) return;
    const colors = ['var(--primary)', '#0ea5e9', '#6366f1', '#10b981'];
    const icons = ['hub-central fa-building-circle-check', 'hub-west fa-building-circle-arrow-right', 'hub-east fa-building-flag', 'hub-central fa-warehouse'];

    container.innerHTML = warehouses.map((wh, idx) => {
        const color = colors[idx % colors.length];
        const iconClass = icons[idx % icons.length];
        const stored = (wh.storedUnits || 0).toLocaleString();
        const cap = (wh.capacity || 0).toLocaleString();
        const pct = wh.loadPercentage || 0;
        const avail = (wh.availableCapacity || 0).toLocaleString();
        return `
            <div class="warehouse-item">
                <div class="warehouse-info-row">
                    <div class="warehouse-name-col">
                        <i class="fa-solid ${iconClass} warehouse-icon"></i>
                        <div>
                            <span class="warehouse-name">${escapeHtml(wh.name)}</span>
                            <span class="warehouse-type">${escapeHtml(wh.location || 'Fulfillment Hub')}</span>
                        </div>
                    </div>
                    <div class="warehouse-stats">
                        <span class="qty-highlight">${stored}</span> / ${cap} units
                    </div>
                </div>
                <div class="progress-bar-wrapper">
                    <div class="progress-bar-fill" style="width: ${Math.min(100, pct)}%; background-color: ${color};"></div>
                </div>
                <div class="progress-labels">
                    <span>${pct}% Occupied</span>
                    <span>${avail} Available</span>
                </div>
            </div>
        `;
    }).join('');
}

/* ==========================================================================
   Modular Data Loaders (Connecting Frontend with Flask + Firestore APIs)
   ========================================================================== */

/**
 * Loads products from GET /api/products and updates tables, metrics, and dropdowns
 */
async function loadProducts(showLoading = false) {
    if (showLoading) {
        renderTableLoading('products-tbody', 10, 'Loading products catalog...');
    }
    try {
        const res = await apiGet('/api/products');
        if (res && res.success && Array.isArray(res.data)) {
            productsData = res.data;
            renderProductsTable(getFilteredProducts());
            updateProductsMetrics();
            populateReceiveProductDropdown();
            populateDeliveryProductDropdown();
            populateTransferDropdowns();
            populateAdjustmentDropdowns();
            populateHistoryProductDropdown();
            updateDashboardStats();
        }
    } catch (err) {
        console.warn('loadProducts warning:', err);
        renderProductsTable(getFilteredProducts());
        updateProductsMetrics();
    }
}

/**
 * Loads warehouse facilities from GET /api/warehouses and updates facilities view
 */
async function loadWarehouses() {
    try {
        const res = await apiGet('/api/warehouses');
        if (res && res.success && Array.isArray(res.data)) {
            warehousesData = res.data;
            populateWarehouseDropdowns();
            renderWarehouses();
            renderDashboardWarehouses(res.data);
        }
    } catch (err) {
        console.warn('loadWarehouses warning:', err);
        renderWarehouses();
    }
}

/**
 * Loads stock receipts from GET /api/receipts
 */
async function loadReceipts(showLoading = false) {
    if (showLoading) {
        renderTableLoading('receipts-tbody', 7, 'Loading stock receipts...');
    }
    try {
        const res = await apiGet('/api/receipts');
        if (res && res.success && Array.isArray(res.data)) {
            receiptsData = res.data;
            renderReceiptsTable(getFilteredReceipts());
            updateReceiptsMetrics();
            updateReceiveSummary();
        }
    } catch (err) {
        console.warn('loadReceipts warning:', err);
        renderReceiptsTable(getFilteredReceipts());
    }
}

/**
 * Loads deliveries from GET /api/deliveries
 */
async function loadDeliveries(showLoading = false) {
    if (showLoading) {
        renderTableLoading('deliveries-tbody', 7, 'Loading delivery orders...');
    }
    try {
        const res = await apiGet('/api/deliveries');
        if (res && res.success && Array.isArray(res.data)) {
            deliveriesData = res.data;
            renderDeliveriesTable(getFilteredDeliveries());
            updateDeliveriesMetrics();
            updateDeliverySummary();
        }
    } catch (err) {
        console.warn('loadDeliveries warning:', err);
        renderDeliveriesTable(getFilteredDeliveries());
    }
}

/**
 * Loads transfers from GET /api/transfers
 */
async function loadTransfers(showLoading = false) {
    if (showLoading) {
        renderTableLoading('transfers-tbody', 7, 'Loading transfers...');
    }
    try {
        const res = await apiGet('/api/transfers');
        if (res && res.success && Array.isArray(res.data)) {
            transfersData = res.data;
            renderTransfersTable(getFilteredTransfers());
            updateTransfersMetrics();
            updateTransferSummary();
        }
    } catch (err) {
        console.warn('loadTransfers warning:', err);
        renderTransfersTable(getFilteredTransfers());
    }
}

/**
 * Loads stock adjustments from GET /api/adjustments
 */
async function loadAdjustments(showLoading = false) {
    if (showLoading) {
        renderTableLoading('adjustments-tbody', 8, 'Loading inventory adjustments...');
    }
    try {
        const res = await apiGet('/api/adjustments');
        if (res && res.success && Array.isArray(res.data)) {
            adjustmentsData = res.data;
            renderAdjustmentsTable(getFilteredAdjustments());
            updateAdjustmentsMetrics();
            updateAdjustmentSummary();
        }
    } catch (err) {
        console.warn('loadAdjustments warning:', err);
        renderAdjustmentsTable(getFilteredAdjustments());
    }
}

/**
 * Loads central movement ledger from GET /api/movements
 */
async function loadMovements(params = '') {
    const tbody = document.getElementById('history-tbody');
    if (tbody && !tbody.children.length) {
        renderTableLoading('history-tbody', 13, 'Loading movement ledger...');
    }
    try {
        const queryStr = params ? `?${params}` : '';
        const res = await apiGet(`/api/movements${queryStr}`);
        if (res && res.success && Array.isArray(res.data)) {
            stockMovements = res.data;
            applyMovementFilters();
        }
    } catch (err) {
        console.warn('loadMovements warning:', err);
        applyMovementFilters();
    }
}

/**
 * Loads recent movements for the dashboard feed from GET /api/movements/recent
 */
async function loadRecentMovements() {
    try {
        const res = await apiGet('/api/movements/recent?limit=10');
        if (res && res.success && Array.isArray(res.data)) {
            renderMovementsTable(res.data);
        }
    } catch (err) {
        console.warn('loadRecentMovements warning:', err);
        renderMovementsTable(stockMovements);
    }
}

/**
 * Loads low-stock alerting items from GET /api/low-stock
 */
async function loadLowStockAlerts() {
    try {
        const res = await apiGet('/api/low-stock');
        if (res && res.success && Array.isArray(res.data)) {
            lowStockProducts = res.data;
            renderLowStockTable(res.data);
        }
    } catch (err) {
        console.warn('loadLowStockAlerts warning:', err);
        renderLowStockTableFromProducts();
    }
}

/**
 * Loads dashboard KPIs and feeds from backend
 */
async function loadDashboardData() {
    try {
        const statsRes = await apiGet('/api/dashboard/stats');
        if (statsRes && statsRes.success && statsRes.data) {
            const stats = statsRes.data;
            const elDashProducts = document.getElementById('dashboard-total-products');
            const elDashStockUnits = document.getElementById('dashboard-total-stock-units');
            const elDashLowStock = document.getElementById('dashboard-low-stock-count');
            const elDashMovements = document.getElementById('dashboard-movements-count');
            const elLowStockBadge = document.getElementById('low-stock-count-badge');

            if (elDashProducts) elDashProducts.textContent = (stats.totalProducts || 0).toLocaleString();
            if (elDashStockUnits) elDashStockUnits.textContent = (stats.totalStockUnits || 0).toLocaleString();
            if (elDashLowStock) elDashLowStock.textContent = stats.lowStockAlerts || 0;
            if (elDashMovements) elDashMovements.textContent = stats.totalMovements || 0;
            if (elLowStockBadge) elLowStockBadge.textContent = `${stats.lowStockAlerts || 0} Items Alerting`;
        }
    } catch (err) {
        console.warn('loadDashboardData stats fallback:', err);
        updateDashboardStats();
    }

    await Promise.allSettled([
        loadLowStockAlerts(),
        loadRecentMovements(),
        loadWarehouses()
    ]);
}

/**
 * Refreshes all application state from the backend
 */
async function refreshAllData() {
    await Promise.allSettled([
        loadProducts(),
        loadWarehouses(),
        loadReceipts(),
        loadDeliveries(),
        loadTransfers(),
        loadAdjustments(),
        loadMovements(),
        loadLowStockAlerts(),
        loadDashboardData()
    ]);
}

/* ==========================================================================
   Application Initialization
   ========================================================================== */
function initApp() {
    // Theme and preferences initialization
    setupTheme();

    // Populate initial dropdowns and form presets
    populateReceiveProductDropdown();
    populateDeliveryProductDropdown();
    populateTransferDropdowns();
    populateAdjustmentDropdowns();
    populateHistoryProductDropdown();

    setDefaultReceiptDate();
    setDefaultDeliveryDate();
    setDefaultTransferDate();
    setDefaultAdjustmentDate();

    updateReceiveSummary();
    updateDeliverySummary();
    updateTransferSummary();
    updateRecordedQuantity();
    updateAdjustmentSummary();

    // Setup navigation and event listeners
    setupSidebar();
    setupNavigation();
    setupDashboardSearchFilter();
    setupProductsViewInteractions();
    setupReceiveStockInteractions();
    setupDeliveryOrdersInteractions();
    setupTransfersInteractions();
    setupAdjustmentsInteractions();
    setupMovementHistoryInteractions();
    setupWarehousesInteractions();
    setupSettingsInteractions();
    setupMovementTypeFilters();
    setupDropdowns();
    setupModals();
    setupForms();
    setupActionButtons();

    // Initial view routing based on URL hash or default to Dashboard
    const initialHash = window.location.hash.replace('#', '').toLowerCase();
    const hashToView = {
        'dashboard': 'Dashboard',
        'products': 'Products',
        'receipts': 'Receive Stock',
        'deliveries': 'Delivery Orders',
        'transfers': 'Transfers',
        'adjustments': 'Stock Adjustments',
        'history': 'Movement History',
        'warehouses': 'Warehouses',
        'settings': 'Settings'
    };
    const startView = hashToView[initialHash] || 'Dashboard';
    navigateTo(startView);

    // Sync live state from Flask + Firestore backend asynchronously
    refreshAllData();
}

/* ==========================================================================
   Navigation & Unified Page View Routing
   ========================================================================== */
const viewsConfig = {
    'Dashboard': {
        id: 'view-dashboard',
        hash: 'dashboard',
        title: 'Inventory Overview',
        subtitle: 'Real-time status across all fulfillment hubs',
        render: renderDashboard
    },
    'Products': {
        id: 'view-products',
        hash: 'products',
        title: 'Products',
        subtitle: 'Manage inventory catalog, multi-warehouse stock, and reorder levels',
        render: renderProducts
    },
    'Receive Stock': {
        id: 'view-receipts',
        hash: 'receipts',
        title: 'Receive Stock',
        subtitle: 'Register inbound supplier shipments and allocate into warehouse storage bins',
        render: renderReceipts
    },
    'Receipts': {
        id: 'view-receipts',
        hash: 'receipts',
        title: 'Receive Stock',
        subtitle: 'Register inbound supplier shipments and allocate into warehouse storage bins',
        render: renderReceipts
    },
    'Delivery Orders': {
        id: 'view-deliveries',
        hash: 'deliveries',
        title: 'Delivery Orders',
        subtitle: 'Dispatch outgoing customer shipments and verify warehouse stock availability',
        render: renderDeliveries
    },
    'Deliveries': {
        id: 'view-deliveries',
        hash: 'deliveries',
        title: 'Delivery Orders',
        subtitle: 'Dispatch outgoing customer shipments and verify warehouse stock availability',
        render: renderDeliveries
    },
    'Transfers': {
        id: 'view-transfers',
        hash: 'transfers',
        title: 'Transfers',
        subtitle: 'Inter-warehouse stock movements, facility rebalancing, and transit tracking',
        render: renderTransfers
    },
    'Stock Adjustments': {
        id: 'view-adjustments',
        hash: 'adjustments',
        title: 'Stock Adjustments',
        subtitle: 'Reconcile inventory balances and rectify physical stock discrepancies',
        render: renderAdjustments
    },
    'Adjustments': {
        id: 'view-adjustments',
        hash: 'adjustments',
        title: 'Stock Adjustments',
        subtitle: 'Reconcile inventory balances and rectify physical stock discrepancies',
        render: renderAdjustments
    },
    'Movement History': {
        id: 'view-history',
        hash: 'history',
        title: 'Movement History',
        subtitle: 'Unified stock ledger for all inbound, outbound, inter-warehouse, and audit flows',
        render: renderMovementHistory
    },
    'Warehouses': {
        id: 'view-warehouses',
        hash: 'warehouses',
        title: 'Warehouse Facilities',
        subtitle: 'Manage and monitor multi-facility capacity, stock distributions, and operational throughput',
        render: renderWarehouses
    },
    'Settings': {
        id: 'view-settings',
        hash: 'settings',
        title: 'System Settings',
        subtitle: 'Configure business rules, notification preferences, themes, and operator profiles',
        render: renderSettings
    }
};

function navigateTo(viewName) {
    const config = viewsConfig[viewName] || viewsConfig['Dashboard'];
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    // Hide all view containers
    document.querySelectorAll('.page-view').forEach(view => {
        view.style.display = 'none';
        view.classList.remove('active');
    });

    // Show target view container
    const targetEl = document.getElementById(config.id);
    if (targetEl) {
        targetEl.style.display = 'block';
        targetEl.classList.add('active');
    }

    // Update header text
    if (pageTitle) pageTitle.textContent = config.title;
    if (pageSubtitle) pageSubtitle.textContent = config.subtitle;

    // Update sidebar nav active link
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        const linkDataView = link.getAttribute('data-view');
        if (linkDataView === viewName ||
            (linkDataView === 'Receive Stock' && viewName === 'Receipts') ||
            (linkDataView === 'Delivery Orders' && viewName === 'Deliveries') ||
            (linkDataView === 'Stock Adjustments' && viewName === 'Adjustments')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Sync hash
    if (config.hash && window.location.hash !== `#${config.hash}`) {
        history.replaceState(null, '', `#${config.hash}`);
    }

    // Call view-specific render function
    if (typeof config.render === 'function') {
        config.render();
    }

    // Close mobile sidebar drawer if open
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupNavigation() {
    // Sidebar nav links
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = link.getAttribute('data-view') || 'Dashboard';
            navigateTo(viewName);
        });
    });

    // Dashboard quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target-view');
            if (target) navigateTo(target);
        });
    });

    // Topbar profile dropdown menu actions
    const profileLinks = document.querySelectorAll('#profile-dropdown .dropdown-item');
    profileLinks.forEach(item => {
        item.addEventListener('click', (e) => {
            const action = item.getAttribute('data-action');
            if (action === 'profile' || action === 'preferences') {
                e.preventDefault();
                navigateTo('Settings');
            } else if (action === 'activity') {
                e.preventDefault();
                navigateTo('Movement History');
            }
        });
    });

    // Hash change listener for browser navigation
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        const hashMapping = {
            'dashboard': 'Dashboard',
            'products': 'Products',
            'receipts': 'Receive Stock',
            'deliveries': 'Delivery Orders',
            'transfers': 'Transfers',
            'adjustments': 'Stock Adjustments',
            'history': 'Movement History',
            'warehouses': 'Warehouses',
            'settings': 'Settings'
        };
        if (hashMapping[hash]) {
            navigateTo(hashMapping[hash]);
        }
    });
}

function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');
    const overlay = document.getElementById('sidebar-overlay');

    const openSidebar = () => {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
}

/* ==========================================================================
   Delivery Orders Operations & Live Stock Verification
   ========================================================================== */

/**
 * Populates product select dropdown on Delivery Orders form
 */
function populateDeliveryProductDropdown() {
    const select = document.getElementById('delivery-product');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="">Select Product</option>';

    productsData.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = `${p.name} (${p.sku}) - ${p.unit}`;
        select.appendChild(option);
    });

    if (currentVal && productsData.some(p => p.id == currentVal)) {
        select.value = currentVal;
    } else if (productsData.length > 0) {
        select.value = productsData[0].id;
    }
}

/**
 * Defaults delivery date to today's date
 */
function setDefaultDeliveryDate() {
    const dateInput = document.getElementById('delivery-date');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

/**
 * Live updates Delivery Summary card and validates quantity against stock
 */
function updateDeliverySummary() {
    const productSelect = document.getElementById('delivery-product');
    const warehouseSelect = document.getElementById('delivery-warehouse');
    const qtyInput = document.getElementById('delivery-quantity');
    const customerInput = document.getElementById('delivery-customer');

    const elProdName = document.getElementById('delivery-summary-product');
    const elSkuTag = document.getElementById('delivery-summary-sku');
    const elCategory = document.getElementById('delivery-summary-category');
    const elWarehouse = document.getElementById('delivery-summary-warehouse');
    const elCustomer = document.getElementById('delivery-summary-customer');
    const elAvailable = document.getElementById('delivery-summary-available');
    const elRequested = document.getElementById('delivery-summary-requested');
    const elRemaining = document.getElementById('delivery-summary-remaining');
    const elStockBar = document.getElementById('delivery-stock-bar');
    const elTotalAll = document.getElementById('delivery-summary-total-all');
    const elWarningBanner = document.getElementById('delivery-stock-warning');
    const elWarningText = document.getElementById('delivery-stock-warning-text');

    const productId = productSelect ? Number(productSelect.value) : null;
    const warehouse = warehouseSelect ? warehouseSelect.value : 'Main Warehouse';
    const customer = customerInput ? customerInput.value.trim() : '';
    const requestedQty = qtyInput ? Math.max(0, Number(qtyInput.value) || 0) : 0;

    const product = productsData.find(p => p.id === productId);

    if (product) {
        if (elProdName) elProdName.textContent = product.name;
        if (elSkuTag) elSkuTag.textContent = product.sku;
        if (elCategory) elCategory.textContent = `Category: ${product.category}`;

        const availableStock = warehouse === 'Main Warehouse'
            ? product.mainWarehouseStock
            : product.productionFloorStock;

        const remainingStock = availableStock - requestedQty;
        const totalAll = (product.mainWarehouseStock + product.productionFloorStock) - requestedQty;

        if (elAvailable) elAvailable.textContent = `${availableStock.toLocaleString()} ${product.unit}`;
        if (elRequested) elRequested.textContent = `-${requestedQty.toLocaleString()} ${product.unit}`;
        if (elRemaining) {
            elRemaining.textContent = `${remainingStock.toLocaleString()} ${product.unit}`;
            if (remainingStock < 0) {
                elRemaining.classList.add('text-danger');
            } else {
                elRemaining.classList.remove('text-danger');
            }
        }
        if (elTotalAll) elTotalAll.textContent = `${Math.max(0, totalAll).toLocaleString()} ${product.unit}`;

        // Insufficient Stock Warning Check
        if (requestedQty > availableStock) {
            if (elWarningBanner) {
                elWarningBanner.style.display = 'flex';
                if (elWarningText) {
                    elWarningText.textContent = `Requested quantity (${requestedQty} ${product.unit}) exceeds available inventory (${availableStock} ${product.unit}) in ${warehouse}!`;
                }
            }
            if (qtyInput) qtyInput.classList.add('has-error');
            if (elStockBar) elStockBar.style.width = '0%';
        } else {
            if (elWarningBanner) elWarningBanner.style.display = 'none';
            if (qtyInput && qtyInput.value.trim() !== '') qtyInput.classList.remove('has-error');

            if (elStockBar) {
                const pct = availableStock > 0 ? Math.max(0, Math.round((remainingStock / availableStock) * 100)) : 0;
                elStockBar.style.width = `${pct}%`;
            }
        }
    } else {
        if (elProdName) elProdName.textContent = 'Please select a product';
        if (elSkuTag) elSkuTag.textContent = '---';
        if (elCategory) elCategory.textContent = 'Category: ---';
        if (elAvailable) elAvailable.textContent = '0';
        if (elRequested) elRequested.textContent = '-0';
        if (elRemaining) elRemaining.textContent = '0';
        if (elTotalAll) elTotalAll.textContent = '0';
        if (elStockBar) elStockBar.style.width = '0%';
        if (elWarningBanner) elWarningBanner.style.display = 'none';
    }

    if (elWarehouse) elWarehouse.textContent = warehouse;
    if (elCustomer) elCustomer.textContent = `Customer: ${customer || 'Not specified'}`;
}

/**
 * Setup event listeners for Delivery Orders view
 */
function setupDeliveryOrdersInteractions() {
    const productSelect = document.getElementById('delivery-product');
    const warehouseSelect = document.getElementById('delivery-warehouse');
    const qtyInput = document.getElementById('delivery-quantity');
    const customerInput = document.getElementById('delivery-customer');
    const orderRefInput = document.getElementById('delivery-order-ref');
    const resetBtn = document.getElementById('btn-reset-delivery');

    const searchInput = document.getElementById('deliveries-search-input');
    const clearSearchBtn = document.getElementById('deliveries-search-clear');
    const statusFilter = document.getElementById('deliveries-status-filter');

    // Live update triggers
    [productSelect, warehouseSelect].forEach(el => {
        if (el) el.addEventListener('change', updateDeliverySummary);
    });

    [qtyInput, customerInput, orderRefInput].forEach(el => {
        if (el) el.addEventListener('input', updateDeliverySummary);
    });

    // Reset Form button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const form = document.getElementById('form-delivery-order');
            if (form) form.reset();
            setDefaultDeliveryDate();
            clearDeliveryErrors();
            updateDeliverySummary();
            showNotification('Delivery order form cleared.', 'info', 2000);
        });
    }

    // Deliveries table search and status filtering
    const handleDeliveryFilterChange = () => {
        if (clearSearchBtn && searchInput) {
            clearSearchBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
        }
        renderDeliveriesTable(getFilteredDeliveries());
    };

    if (searchInput) searchInput.addEventListener('input', handleDeliveryFilterChange);
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            handleDeliveryFilterChange();
            searchInput.focus();
        });
    }
    if (statusFilter) statusFilter.addEventListener('change', handleDeliveryFilterChange);
}

/**
 * Filter delivery records based on search and status
 */
function getFilteredDeliveries() {
    const searchInput = document.getElementById('deliveries-search-input');
    const statusFilter = document.getElementById('deliveries-status-filter');

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const status = statusFilter ? statusFilter.value : 'ALL';

    // In production: Replace with fetch(`/api/deliveries?search=${encodeURIComponent(query)}&status=${status}`) later
    return deliveriesData.filter(d => {
        const matchesQuery = query === '' ||
            d.id.toLowerCase().includes(query) ||
            d.customer.toLowerCase().includes(query) ||
            (d.orderRef && d.orderRef.toLowerCase().includes(query)) ||
            d.productName.toLowerCase().includes(query) ||
            d.productSku.toLowerCase().includes(query) ||
            d.warehouse.toLowerCase().includes(query);

        const matchesStatus = status === 'ALL' || d.status === status;

        return matchesQuery && matchesStatus;
    });
}

/**
 * Dynamically renders the Recent Deliveries table
 * Columns: Delivery ID, Customer, Product, Warehouse, Quantity, Delivery Date, Status, Actions
 */
function renderDeliveriesTable(deliveries) {
    const tbody = document.getElementById('deliveries-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (deliveries.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-table-row">
                    <div class="empty-icon"><i class="fa-solid fa-truck-ramp-box"></i></div>
                    <p>No recent customer deliveries found matching your filter criteria.</p>
                </td>
            </tr>
        `;
        return;
    }

    deliveries.forEach(d => {
        const tr = document.createElement('tr');
        let badgeClass = 'badge-status-completed';
        if (d.status === 'Packed') badgeClass = 'badge-status-packed';
        if (d.status === 'Pending') badgeClass = 'badge-status-pending';

        tr.innerHTML = `
            <td>
                <strong class="sku-badge">${escapeHtml(d.id)}</strong>
            </td>
            <td>
                <div class="product-cell">
                    <span class="product-name-txt">${escapeHtml(d.customer)}</span>
                    <span class="product-cat-txt">Ref: ${escapeHtml(d.orderRef || '---')}</span>
                </div>
            </td>
            <td>
                <div class="product-cell">
                    <span class="product-name-txt">${escapeHtml(d.productName)}</span>
                    <span class="product-cat-txt">${escapeHtml(d.productSku)}</span>
                </div>
            </td>
            <td>
                <span class="warehouse-tag">
                    <i class="fa-solid fa-location-dot"></i>
                    ${escapeHtml(d.warehouse)}
                </span>
            </td>
            <td class="text-right">
                <span class="qty-val text-danger">-${d.quantity.toLocaleString()} ${escapeHtml(d.unit || '')}</span>
            </td>
            <td>
                <span class="product-cat-txt">${escapeHtml(d.date)}</span>
            </td>
            <td class="text-center">
                <span class="badge ${badgeClass}">${escapeHtml(d.status)}</span>
            </td>
            <td class="text-center">
                <button class="icon-btn-subtle btn-view-delivery" data-id="${escapeHtml(d.id)}" title="View Delivery Order Slip">
                    <i class="fa-regular fa-file-lines"></i>
                </button>
            </td>
        `;

        const viewBtn = tr.querySelector('.btn-view-delivery');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                showNotification(`Dispatch Slip #${d.id} for ${d.customer} loaded.`, 'info');
            });
        }

        tbody.appendChild(tr);
    });
}

function updateDeliveriesMetrics() {
    const elCount = document.getElementById('deliveries-stat-count');
    const elUnits = document.getElementById('deliveries-stat-units');
    const elPending = document.getElementById('deliveries-stat-pending');

    if (elCount) elCount.textContent = deliveriesData.length;

    let totalUnits = 0;
    let pendingCount = 0;

    deliveriesData.forEach(d => {
        if (d.status === 'Completed') totalUnits += d.quantity;
        if (d.status === 'Pending') pendingCount += 1;
    });

    if (elUnits) elUnits.textContent = totalUnits.toLocaleString();
    if (elPending) elPending.textContent = pendingCount;
}

/**
 * Handles Delivery Order Form Submission
 */
async function handleDeliveryOrderSubmit(e) {
    e.preventDefault();

    const customerInput = document.getElementById('delivery-customer');
    const orderRefInput = document.getElementById('delivery-order-ref');
    const productSelect = document.getElementById('delivery-product');
    const warehouseSelect = document.getElementById('delivery-warehouse');
    const qtyInput = document.getElementById('delivery-quantity');
    const dateInput = document.getElementById('delivery-date');
    const notesInput = document.getElementById('delivery-notes');
    const errorBox = document.getElementById('delivery-form-error');

    const statusRadio = document.querySelector('input[name="delivery-status"]:checked');
    const status = statusRadio ? statusRadio.value : 'Completed';

    clearDeliveryErrors();
    if (errorBox) errorBox.style.display = 'none';

    let hasErrors = false;

    const customer = customerInput.value.trim();
    if (!customer) {
        setFieldError('err-delivery-customer', customerInput, 'Customer name is required');
        hasErrors = true;
    }

    const orderRef = orderRefInput.value.trim().toUpperCase();
    if (!orderRef) {
        setFieldError('err-delivery-order-ref', orderRefInput, 'Order reference number is required');
        hasErrors = true;
    }

    const productId = productSelect ? productSelect.value : '';
    const product = productsData.find(p => String(p.id) === String(productId));
    if (!productId || !product) {
        setFieldError('err-delivery-product', productSelect, 'Please select a product');
        hasErrors = true;
    }

    const warehouse = warehouseSelect.value;
    if (!warehouse) {
        setFieldError('err-delivery-warehouse', warehouseSelect, 'Please select a source warehouse');
        hasErrors = true;
    }

    const quantity = Number(qtyInput.value);
    if (!qtyInput.value.trim() || isNaN(quantity) || quantity <= 0) {
        setFieldError('err-delivery-quantity', qtyInput, 'Quantity must be greater than 0');
        hasErrors = true;
    }

    const deliveryDate = dateInput.value;
    if (!deliveryDate) {
        setFieldError('err-delivery-date', dateInput, 'Please select a delivery date');
        hasErrors = true;
    }

    // Critical Validation: Check stock availability
    if (product && warehouse && quantity > 0) {
        const availableStock = warehouse === 'Main Warehouse'
            ? product.mainWarehouseStock
            : product.productionFloorStock;

        if (quantity > availableStock) {
            const errorMsg = `Insufficient stock! Requested quantity (${quantity} ${product.unit}) exceeds available stock (${availableStock} ${product.unit}) at ${warehouse}.`;
            setFieldError('err-delivery-quantity', qtyInput, errorMsg);
            if (errorBox) {
                errorBox.textContent = errorMsg;
                errorBox.style.display = 'block';
            }
            qtyInput.focus();
            return; // Prevent submission
        }
    }

    if (hasErrors) {
        if (errorBox) {
            errorBox.textContent = 'Please correct the highlighted fields before dispatching order.';
            errorBox.style.display = 'block';
        }
        return;
    }

    try {
        const res = await apiPost('/api/deliveries', {
            customer: customer,
            orderRef: orderRef,
            productId: product.id,
            warehouse: warehouse,
            quantity: quantity,
            date: deliveryDate,
            notes: notesInput ? notesInput.value.trim() : '',
            status: status
        });

        const delId = (res && res.data && res.data.id) || 'Recorded';
        showNotification(`Delivery recorded successfully: ${delId}`, 'success', 3500);

        if (qtyInput) qtyInput.value = '';
        if (orderRefInput) orderRefInput.value = '';
        if (notesInput) notesInput.value = '';

        await Promise.allSettled([
            loadDeliveries(),
            loadProducts(),
            loadDashboardData(),
            loadMovements(),
            loadLowStockAlerts()
        ]);
    } catch (err) {
        if (errorBox) {
            errorBox.textContent = err.message || 'Failed to dispatch order on server';
            errorBox.style.display = 'block';
        }
        const warningBanner = document.getElementById('delivery-stock-warning');
        if (warningBanner) warningBanner.style.display = 'flex';
        showNotification(err.message || 'Delivery error', 'danger', 4500);
    }
}

function clearDeliveryErrors() {
    const errorElements = document.querySelectorAll('[id^="err-delivery-"]');
    errorElements.forEach(el => el.textContent = '');

    const inputs = document.querySelectorAll('#form-delivery-order .has-error');
    inputs.forEach(el => el.classList.remove('has-error'));

    const errorBox = document.getElementById('delivery-form-error');
    if (errorBox) errorBox.style.display = 'none';

    const warningBanner = document.getElementById('delivery-stock-warning');
    if (warningBanner) warningBanner.style.display = 'none';
}

/* ==========================================================================
   Transfers Operations & Live Inter-Warehouse Relocation
   ========================================================================== */

/**
 * Populates product and warehouse select dropdowns on Transfer form
 */
function populateTransferDropdowns() {
    const productSelect = document.getElementById('transfer-product');
    const sourceSelect = document.getElementById('transfer-source');
    const destSelect = document.getElementById('transfer-dest');

    if (productSelect) {
        const curProdVal = productSelect.value;
        productSelect.innerHTML = '<option value="">Select Product</option>';
        productsData.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.name} (${p.sku}) - ${p.unit}`;
            productSelect.appendChild(opt);
        });

        if (curProdVal && productsData.some(p => p.id == curProdVal)) {
            productSelect.value = curProdVal;
        } else if (productsData.length > 0) {
            productSelect.value = productsData[0].id;
        }
    }

    if (sourceSelect) {
        const curSource = sourceSelect.value || 'Main Warehouse';
        sourceSelect.innerHTML = '';
        warehousesData.forEach(w => {
            const name = typeof w === 'object' && w.name ? w.name : w;
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            if (name === curSource) opt.selected = true;
            sourceSelect.appendChild(opt);
        });
    }

    if (destSelect) {
        const firstWh = warehousesData.length > 0 ? (typeof warehousesData[0] === 'object' ? warehousesData[0].name : warehousesData[0]) : 'Main Warehouse';
        const secondWh = warehousesData.length > 1 ? (typeof warehousesData[1] === 'object' ? warehousesData[1].name : warehousesData[1]) : firstWh;
        const curDest = destSelect.value || secondWh;
        destSelect.innerHTML = '';
        warehousesData.forEach(w => {
            const name = typeof w === 'object' && w.name ? w.name : w;
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            if (name === curDest) opt.selected = true;
            destSelect.appendChild(opt);
        });
    }
}

/**
 * Sets current date as default for transfer form
 */
function setDefaultTransferDate() {
    const dateInput = document.getElementById('transfer-date');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

/**
 * Calculates and updates live Transfer Summary card
 */
function updateTransferSummary() {
    const productSelect = document.getElementById('transfer-product');
    const sourceSelect = document.getElementById('transfer-source');
    const destSelect = document.getElementById('transfer-dest');
    const qtyInput = document.getElementById('transfer-quantity');

    const elProdName = document.getElementById('transfer-summary-product');
    const elSkuTag = document.getElementById('transfer-summary-sku');
    const elCategory = document.getElementById('transfer-summary-category');
    const elSourceName = document.getElementById('transfer-summary-source-name');
    const elDestName = document.getElementById('transfer-summary-dest-name');
    const elFlowQty = document.getElementById('transfer-summary-flow-qty');

    const elSourceLabel = document.getElementById('transfer-source-label');
    const elSourceBefore = document.getElementById('transfer-source-before');
    const elSourceDelta = document.getElementById('transfer-source-delta');
    const elSourceAfter = document.getElementById('transfer-source-after');

    const elDestLabel = document.getElementById('transfer-dest-label');
    const elDestBefore = document.getElementById('transfer-dest-before');
    const elDestDelta = document.getElementById('transfer-dest-delta');
    const elDestAfter = document.getElementById('transfer-dest-after');

    const elTotalStockVal = document.getElementById('transfer-total-stock-val');

    const sameWarnBanner = document.getElementById('transfer-same-warning');
    const sameWarnText = document.getElementById('transfer-same-warning-text');
    const stockWarnBanner = document.getElementById('transfer-stock-warning');
    const stockWarnText = document.getElementById('transfer-stock-warning-text');

    const productId = productSelect ? productSelect.value : null;
    const source = sourceSelect ? sourceSelect.value : 'Main Warehouse';
    const dest = destSelect ? destSelect.value : 'Production Floor';
    const quantity = qtyInput ? Math.max(0, Number(qtyInput.value) || 0) : 0;

    const product = productsData.find(p => String(p.id) === String(productId));

    if (elSourceName) elSourceName.textContent = source || 'Not Selected';
    if (elDestName) elDestName.textContent = dest || 'Not Selected';
    if (elSourceLabel) elSourceLabel.textContent = source || 'Source';
    if (elDestLabel) elDestLabel.textContent = dest || 'Destination';

    if (!product) {
        if (elProdName) elProdName.textContent = 'Select a product above';
        if (elSkuTag) elSkuTag.textContent = '---';
        if (elCategory) elCategory.textContent = 'Category: ---';
        if (elFlowQty) elFlowQty.textContent = `${quantity} units`;
        if (elSourceBefore) elSourceBefore.textContent = '0';
        if (elSourceDelta) elSourceDelta.textContent = `-${quantity}`;
        if (elSourceAfter) elSourceAfter.textContent = '0';
        if (elDestBefore) elDestBefore.textContent = '0';
        if (elDestDelta) elDestDelta.textContent = `+${quantity}`;
        if (elDestAfter) elDestAfter.textContent = '0';
        if (elTotalStockVal) elTotalStockVal.textContent = '0 units';
        if (sameWarnBanner) sameWarnBanner.style.display = 'none';
        if (stockWarnBanner) stockWarnBanner.style.display = 'none';
        return;
    }

    if (elProdName) elProdName.textContent = product.name;
    if (elSkuTag) elSkuTag.textContent = product.sku;
    if (elCategory) elCategory.textContent = `Category: ${product.category}`;
    if (elFlowQty) elFlowQty.textContent = `${quantity} ${product.unit}`;

    const sourceStockBefore = source === 'Main Warehouse' ? product.mainWarehouseStock : product.productionFloorStock;
    const destStockBefore = dest === 'Main Warehouse' ? product.mainWarehouseStock : product.productionFloorStock;

    // Validation Check 1: Same warehouse warning
    const isSameWarehouse = source && dest && source === dest;
    if (isSameWarehouse) {
        if (sameWarnBanner) {
            sameWarnBanner.style.display = 'flex';
            if (sameWarnText) sameWarnText.textContent = `Source and destination warehouses cannot both be "${source}". Please select two different facilities.`;
        }
    } else {
        if (sameWarnBanner) sameWarnBanner.style.display = 'none';
    }

    // Validation Check 2: Quantity exceeds available stock warning
    const isOverStock = quantity > sourceStockBefore;
    if (isOverStock && !isSameWarehouse) {
        if (stockWarnBanner) {
            stockWarnBanner.style.display = 'flex';
            if (stockWarnText) stockWarnText.textContent = `Requested transfer (${quantity} ${product.unit}) exceeds available stock (${sourceStockBefore} ${product.unit}) in ${source}.`;
        }
    } else {
        if (stockWarnBanner) stockWarnBanner.style.display = 'none';
    }

    const sourceStockAfter = isSameWarehouse ? sourceStockBefore : Math.max(0, sourceStockBefore - quantity);
    const destStockAfter = isSameWarehouse ? destStockBefore : destStockBefore + quantity;
    const totalCompanyStock = product.mainWarehouseStock + product.productionFloorStock;

    if (elSourceBefore) elSourceBefore.textContent = `${sourceStockBefore.toLocaleString()} ${product.unit}`;
    if (elSourceDelta) elSourceDelta.textContent = `-${quantity.toLocaleString()} ${product.unit}`;
    if (elSourceAfter) {
        elSourceAfter.textContent = `${sourceStockAfter.toLocaleString()} ${product.unit}`;
        elSourceAfter.className = isOverStock ? 'text-right val-after text-danger' : 'text-right val-after';
    }

    if (elDestBefore) elDestBefore.textContent = `${destStockBefore.toLocaleString()} ${product.unit}`;
    if (elDestDelta) elDestDelta.textContent = `+${quantity.toLocaleString()} ${product.unit}`;
    if (elDestAfter) elDestAfter.textContent = `${destStockAfter.toLocaleString()} ${product.unit}`;

    if (elTotalStockVal) {
        elTotalStockVal.textContent = `${totalCompanyStock.toLocaleString()} ${product.unit}`;
    }
}

/**
 * Updates top metrics for Transfers view
 */
function updateTransfersMetrics() {
    const elCount = document.getElementById('transfers-stat-count');
    const elUnits = document.getElementById('transfers-stat-units');
    const elTransit = document.getElementById('transfers-stat-transit');
    const elDepots = document.getElementById('transfers-stat-depots');

    if (elCount) elCount.textContent = transfersData.length;

    let unitsRelocated = 0;
    let inTransitCount = 0;

    transfersData.forEach(t => {
        if (t.status === 'Completed') unitsRelocated += t.quantity;
        if (t.status === 'In Transit') inTransitCount += 1;
    });

    if (elUnits) elUnits.textContent = unitsRelocated.toLocaleString();
    if (elTransit) elTransit.textContent = inTransitCount;
    if (elDepots) elDepots.textContent = warehousesData.length;
}

/**
 * Handles Inter-Warehouse Transfer Form Submission
 */
async function handleTransferSubmit(e) {
    e.preventDefault();

    const productSelect = document.getElementById('transfer-product');
    const sourceSelect = document.getElementById('transfer-source');
    const destSelect = document.getElementById('transfer-dest');
    const qtyInput = document.getElementById('transfer-quantity');
    const dateInput = document.getElementById('transfer-date');
    const refInput = document.getElementById('transfer-ref');
    const notesInput = document.getElementById('transfer-notes');
    const errorBox = document.getElementById('transfer-form-error');
    const submitBtn = document.getElementById('btn-submit-transfer');

    const statusRadio = document.querySelector('input[name="transfer-status"]:checked');
    const status = statusRadio ? statusRadio.value : 'Completed';

    clearTransferErrors();
    if (errorBox) errorBox.style.display = 'none';

    let hasErrors = false;

    const productId = productSelect ? productSelect.value : '';
    const product = productsData.find(p => String(p.id) === String(productId));
    if (!productId || !product) {
        setFieldError('err-transfer-product', productSelect, 'Please select a product');
        hasErrors = true;
    }

    const sourceWarehouse = sourceSelect ? sourceSelect.value : '';
    if (!sourceWarehouse) {
        setFieldError('err-transfer-source', sourceSelect, 'Please select a source warehouse');
        hasErrors = true;
    }

    const destWarehouse = destSelect ? destSelect.value : '';
    if (!destWarehouse) {
        setFieldError('err-transfer-dest', destSelect, 'Please select a destination warehouse');
        hasErrors = true;
    }

    // Constraint: Prevent transfer if source and destination are identical
    if (sourceWarehouse && destWarehouse && sourceWarehouse === destWarehouse) {
        const msg = 'Source and destination warehouses cannot be the same';
        setFieldError('err-transfer-dest', destSelect, msg);
        const sameBanner = document.getElementById('transfer-same-warning');
        if (sameBanner) sameBanner.style.display = 'flex';
        hasErrors = true;
    }

    const quantity = Number(qtyInput ? qtyInput.value : 0);
    if (!qtyInput || !qtyInput.value.trim() || isNaN(quantity) || quantity <= 0) {
        setFieldError('err-transfer-quantity', qtyInput, 'Quantity must be greater than 0');
        hasErrors = true;
    }

    const transferDate = dateInput ? dateInput.value : '';
    if (!transferDate) {
        setFieldError('err-transfer-date', dateInput, 'Please select a transfer date');
        hasErrors = true;
    }

    const reference = refInput ? refInput.value.trim().toUpperCase() : '';
    if (!reference) {
        setFieldError('err-transfer-ref', refInput, 'Transfer reference is required');
        hasErrors = true;
    }

    // Constraint: Prevent transfer if quantity exceeds available stock at source
    if (product && sourceWarehouse && quantity > 0 && sourceWarehouse !== destWarehouse) {
        const availableStock = sourceWarehouse === 'Main Warehouse'
            ? Number(product.mainWarehouseStock || 0)
            : Number(product.productionFloorStock || 0);

        if (quantity > availableStock) {
            const errorMsg = `Insufficient stock! Source warehouse (${sourceWarehouse}) only has ${availableStock} ${product.unit} available.`;
            setFieldError('err-transfer-quantity', qtyInput, errorMsg);
            const stockBanner = document.getElementById('transfer-stock-warning');
            if (stockBanner) stockBanner.style.display = 'flex';
            if (errorBox) {
                errorBox.textContent = errorMsg;
                errorBox.style.display = 'block';
            }
            if (qtyInput) qtyInput.focus();
            return;
        }
    }

    if (hasErrors) {
        if (errorBox) {
            errorBox.textContent = 'Please correct the highlighted fields before executing transfer.';
            errorBox.style.display = 'block';
        }
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing...';
    }

    const payload = {
        reference: reference,
        productId: String(product.id),
        sourceWarehouse: sourceWarehouse,
        destWarehouse: destWarehouse,
        quantity: quantity,
        date: transferDate,
        notes: notesInput ? notesInput.value.trim() : '',
        status: status
    };

    try {
        const res = await apiPost('/api/transfers', payload);
        if (res && res.success) {
            showToast('Transfer completed successfully', 'success', 3500);

            // Clear inputs
            if (qtyInput) qtyInput.value = '';
            if (refInput) refInput.value = '';
            if (notesInput) notesInput.value = '';
            setDefaultTransferDate();
            updateTransferSummary();

            // Refresh state across all views
            await Promise.allSettled([
                loadTransfers(),
                loadProducts(),
                loadWarehouses(),
                loadDashboardData(),
                loadMovements()
            ]);
        } else {
            const errMsg = (res && (res.error || res.message)) || 'Failed to complete stock transfer';
            if (errorBox) {
                errorBox.textContent = errMsg;
                errorBox.style.display = 'block';
            }
            if (errMsg.toLowerCase().includes('insufficient') || errMsg.toLowerCase().includes('stock')) {
                const stockBanner = document.getElementById('transfer-stock-warning');
                if (stockBanner) stockBanner.style.display = 'flex';
            }
            showToast(errMsg, 'danger', 4000);
        }
    } catch (err) {
        console.error('Transfer API error:', err);
        const errMsg = err.message || 'Server error while executing transfer';
        if (errorBox) {
            errorBox.textContent = errMsg;
            errorBox.style.display = 'block';
        }
        showToast(errMsg, 'danger', 4000);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-right-left"></i> Execute Transfer';
        }
    }
}

function clearTransferErrors() {
    const errorElements = document.querySelectorAll('[id^="err-transfer-"]');
    errorElements.forEach(el => el.textContent = '');

    const inputs = document.querySelectorAll('#form-transfer-order .has-error');
    inputs.forEach(el => el.classList.remove('has-error'));

    const errorBox = document.getElementById('transfer-form-error');
    if (errorBox) errorBox.style.display = 'none';

    const sameBanner = document.getElementById('transfer-same-warning');
    if (sameBanner) sameBanner.style.display = 'none';

    const stockBanner = document.getElementById('transfer-stock-warning');
    if (stockBanner) stockBanner.style.display = 'none';
}

function resetTransferForm() {
    const form = document.getElementById('form-transfer-order');
    if (form) form.reset();
    clearTransferErrors();
    populateTransferDropdowns();
    setDefaultTransferDate();
    updateTransferSummary();
}

/**
 * Renders Recent Transfers Table
 */
function renderTransfersTable(transfers) {
    const tbody = document.getElementById('transfers-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (transfers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-table-row">
                    <div class="empty-icon"><i class="fa-solid fa-right-left"></i></div>
                    <p>No transfers recorded matching the current filter.</p>
                </td>
            </tr>
        `;
        return;
    }

    transfers.forEach(t => {
        const tr = document.createElement('tr');
        let badgeClass = 'badge-status-completed';
        if (t.status === 'In Transit') badgeClass = 'badge-status-in-transit';
        if (t.status === 'Draft') badgeClass = 'badge-status-draft';

        tr.innerHTML = `
            <td>
                <strong class="sku-badge">${escapeHtml(t.id)}</strong>
            </td>
            <td>
                <div class="product-cell">
                    <span class="product-name-txt">${escapeHtml(t.productName)}</span>
                    <span class="product-cat-txt">${escapeHtml(t.productSku)}</span>
                </div>
            </td>
            <td>
                <span class="warehouse-tag">
                    <i class="fa-solid fa-location-dot"></i>
                    ${escapeHtml(t.sourceWarehouse)}
                </span>
            </td>
            <td>
                <span class="warehouse-tag">
                    <i class="fa-solid fa-arrow-right"></i>
                    ${escapeHtml(t.destWarehouse)}
                </span>
            </td>
            <td class="text-right">
                <span class="qty-val font-bold">${t.quantity.toLocaleString()} ${escapeHtml(t.unit || '')}</span>
            </td>
            <td>
                <span class="product-cat-txt">${escapeHtml(t.date)}</span>
            </td>
            <td class="text-center">
                <span class="badge ${badgeClass}">${escapeHtml(t.status)}</span>
            </td>
            <td class="text-center">
                <button class="icon-btn-subtle btn-view-transfer" data-id="${escapeHtml(t.id)}" title="View Transfer Slip">
                    <i class="fa-regular fa-file-lines"></i>
                </button>
            </td>
        `;

        const viewBtn = tr.querySelector('.btn-view-transfer');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                showNotification(`Transfer manifest #${t.id} loaded. Ref: ${t.reference}`, 'info');
            });
        }

        tbody.appendChild(tr);
    });
}

/**
 * Filter transfers by search keyword and status
 */
function getFilteredTransfers() {
    const searchInput = document.getElementById('transfers-search-input');
    const statusSelect = document.getElementById('transfers-status-filter');

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedStatus = statusSelect ? statusSelect.value : 'ALL';

    return transfersData.filter(item => {
        const matchesSearch = query === '' ||
            item.id.toLowerCase().includes(query) ||
            (item.reference && item.reference.toLowerCase().includes(query)) ||
            item.productName.toLowerCase().includes(query) ||
            item.productSku.toLowerCase().includes(query) ||
            item.sourceWarehouse.toLowerCase().includes(query) ||
            item.destWarehouse.toLowerCase().includes(query);

        const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });
}

/**
 * Sets up event listeners for Transfers view
 */
function setupTransfersInteractions() {
    const productSelect = document.getElementById('transfer-product');
    const sourceSelect = document.getElementById('transfer-source');
    const destSelect = document.getElementById('transfer-dest');
    const qtyInput = document.getElementById('transfer-quantity');
    const searchInput = document.getElementById('transfers-search-input');
    const clearBtn = document.getElementById('transfers-search-clear');
    const statusFilter = document.getElementById('transfers-status-filter');

    const handleSummaryChange = () => {
        clearTransferErrors();
        updateTransferSummary();
    };

    if (productSelect) productSelect.addEventListener('change', handleSummaryChange);
    if (sourceSelect) sourceSelect.addEventListener('change', handleSummaryChange);
    if (destSelect) destSelect.addEventListener('change', handleSummaryChange);
    if (qtyInput) qtyInput.addEventListener('input', handleSummaryChange);

    const handleFilterChange = () => {
        if (clearBtn && searchInput) {
            clearBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
        }
        renderTransfersTable(getFilteredTransfers());
    };

    if (searchInput) searchInput.addEventListener('input', handleFilterChange);
    if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            handleFilterChange();
            searchInput.focus();
        });
    }
    if (statusFilter) statusFilter.addEventListener('change', handleFilterChange);
}

/* ==========================================================================
   Stock Adjustments Operations & Physical Count Reconciliation
   ========================================================================== */

/**
 * Populates product and warehouse select dropdowns on Stock Adjustment form
 */
function populateAdjustmentDropdowns() {
    const productSelect = document.getElementById('adjustment-product');
    const warehouseSelect = document.getElementById('adjustment-warehouse');

    if (productSelect) {
        const curProdVal = productSelect.value;
        productSelect.innerHTML = '<option value="">Select Product</option>';
        productsData.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.name} (${p.sku}) - ${p.unit}`;
            productSelect.appendChild(opt);
        });

        if (curProdVal && productsData.some(p => p.id == curProdVal)) {
            productSelect.value = curProdVal;
        } else if (productsData.length > 0) {
            productSelect.value = productsData[0].id;
        }
    }

    if (warehouseSelect) {
        const curWarehouse = warehouseSelect.value || 'Main Warehouse';
        warehouseSelect.innerHTML = '';
        warehousesData.forEach(w => {
            const name = typeof w === 'object' && w.name ? w.name : w;
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            if (name === curWarehouse) opt.selected = true;
            warehouseSelect.appendChild(opt);
        });
    }
}

/**
 * Sets current date as default for adjustment form
 */
function setDefaultAdjustmentDate() {
    const dateInput = document.getElementById('adjustment-date');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

/**
 * Auto-loads recorded quantity based on selected product and warehouse
 */
function updateRecordedQuantity() {
    const productSelect = document.getElementById('adjustment-product');
    const warehouseSelect = document.getElementById('adjustment-warehouse');
    const recordedInput = document.getElementById('adjustment-recorded-qty');

    const productId = productSelect ? productSelect.value : null;
    const warehouse = warehouseSelect ? warehouseSelect.value : 'Main Warehouse';

    const product = productsData.find(p => String(p.id) === String(productId));
    if (!product) {
        if (recordedInput) recordedInput.value = '';
        updateAdjustmentSummary();
        return;
    }

    const recordedStock = warehouse === 'Main Warehouse'
        ? Number(product.mainWarehouseStock || 0)
        : Number(product.productionFloorStock || 0);

    if (recordedInput) {
        recordedInput.value = recordedStock;
    }

    updateAdjustmentSummary();
}

/**
 * Updates Adjustment live summary card and calculates discrepancy difference
 */
function updateAdjustmentSummary() {
    const productSelect = document.getElementById('adjustment-product');
    const warehouseSelect = document.getElementById('adjustment-warehouse');
    const reasonSelect = document.getElementById('adjustment-reason');
    const countedInput = document.getElementById('adjustment-counted-qty');

    const elProdName = document.getElementById('adjustment-summary-product');
    const elSkuTag = document.getElementById('adjustment-summary-sku');
    const elCategory = document.getElementById('adjustment-summary-category');
    const elWarehouse = document.getElementById('adjustment-summary-warehouse');
    const elReason = document.getElementById('adjustment-summary-reason');
    const elRecorded = document.getElementById('adjustment-summary-recorded');
    const elCounted = document.getElementById('adjustment-summary-counted');
    const elDiffContainer = document.getElementById('adjustment-summary-diff-container');
    const elFinal = document.getElementById('adjustment-summary-final');
    const elProgressBar = document.getElementById('adjustment-progress-bar');
    const elImpact = document.getElementById('adjustment-summary-impact');

    const productId = productSelect ? productSelect.value : null;
    const warehouse = warehouseSelect ? warehouseSelect.value : 'Main Warehouse';
    const reason = reasonSelect ? reasonSelect.value : '';

    const product = productsData.find(p => String(p.id) === String(productId));

    if (elWarehouse) elWarehouse.textContent = warehouse;
    if (elReason) elReason.textContent = reason ? `Reason: ${reason}` : 'Reason: Not selected';

    if (!product) {
        if (elProdName) elProdName.textContent = 'Select a product above';
        if (elSkuTag) elSkuTag.textContent = '---';
        if (elCategory) elCategory.textContent = 'Category: ---';
        if (elRecorded) elRecorded.textContent = '0';
        if (elCounted) elCounted.textContent = '0';
        if (elDiffContainer) elDiffContainer.innerHTML = '<span class="badge badge-diff-neutral"><i class="fa-solid fa-minus"></i> 0</span>';
        if (elFinal) elFinal.textContent = '0';
        if (elImpact) elImpact.textContent = '0';
        return;
    }

    if (elProdName) elProdName.textContent = product.name;
    if (elSkuTag) elSkuTag.textContent = product.sku;
    if (elCategory) elCategory.textContent = `Category: ${product.category}`;

    const recordedStock = warehouse === 'Main Warehouse'
        ? Number(product.mainWarehouseStock || 0)
        : Number(product.productionFloorStock || 0);

    const hasCountedInput = countedInput && countedInput.value.trim() !== '' && !isNaN(Number(countedInput.value));
    const countedQty = hasCountedInput ? Math.max(0, Number(countedInput.value)) : recordedStock;
    const difference = countedQty - recordedStock;

    if (elRecorded) elRecorded.textContent = `${recordedStock.toLocaleString()} ${product.unit}`;
    if (elCounted) {
        elCounted.textContent = hasCountedInput ? `${countedQty.toLocaleString()} ${product.unit}` : 'Pending count input';
    }

    if (elDiffContainer) {
        if (!hasCountedInput) {
            elDiffContainer.innerHTML = '<span class="badge badge-neutral"><i class="fa-solid fa-hourglass-half"></i> Awaiting Count</span>';
        } else if (difference > 0) {
            elDiffContainer.innerHTML = `<span class="badge badge-diff-positive"><i class="fa-solid fa-arrow-trend-up"></i> +${difference.toLocaleString()} ${product.unit} (Surplus)</span>`;
        } else if (difference < 0) {
            elDiffContainer.innerHTML = `<span class="badge badge-diff-negative"><i class="fa-solid fa-arrow-trend-down"></i> ${difference.toLocaleString()} ${product.unit} (Deficit)</span>`;
        } else {
            elDiffContainer.innerHTML = `<span class="badge badge-diff-neutral"><i class="fa-solid fa-check"></i> Exact Match (0 ${product.unit})</span>`;
        }
    }

    const finalStock = hasCountedInput ? countedQty : recordedStock;
    if (elFinal) elFinal.textContent = `${finalStock.toLocaleString()} ${product.unit}`;

    if (elProgressBar) {
        const ratio = recordedStock > 0 ? Math.min(100, Math.round((finalStock / recordedStock) * 100)) : 100;
        elProgressBar.style.width = `${ratio}%`;
        if (difference < 0) {
            elProgressBar.style.backgroundColor = 'var(--danger)';
        } else if (difference > 0) {
            elProgressBar.style.backgroundColor = 'var(--success)';
        } else {
            elProgressBar.style.backgroundColor = 'var(--primary)';
        }
    }

    if (elImpact) {
        if (!hasCountedInput || difference === 0) {
            elImpact.textContent = `No net change (0 ${product.unit})`;
        } else if (difference > 0) {
            elImpact.textContent = `+${difference.toLocaleString()} ${product.unit} to warehouse total`;
        } else {
            elImpact.textContent = `${difference.toLocaleString()} ${product.unit} removed from warehouse`;
        }
    }
}

/**
 * Updates top mini-metrics for Stock Adjustments view
 */
function updateAdjustmentsMetrics() {
    const elCount = document.getElementById('adjustments-stat-count');
    const elVariance = document.getElementById('adjustments-stat-variance');
    const elCompleted = document.getElementById('adjustments-stat-completed');
    const elReviewed = document.getElementById('adjustments-stat-reviewed');

    if (elCount) elCount.textContent = adjustmentsData.length;

    let netVariance = 0;
    let completedCount = 0;
    let reviewedCount = 0;

    adjustmentsData.forEach(adj => {
        if (adj.status === 'Completed') {
            netVariance += Number(adj.difference || 0);
            completedCount += 1;
        } else if (adj.status === 'Reviewed') {
            reviewedCount += 1;
        }
    });

    if (elVariance) {
        if (netVariance > 0) {
            elVariance.textContent = `+${netVariance}`;
            elVariance.className = 'mini-metric-val text-success';
        } else if (netVariance < 0) {
            elVariance.textContent = `${netVariance}`;
            elVariance.className = 'mini-metric-val text-danger';
        } else {
            elVariance.textContent = '0';
            elVariance.className = 'mini-metric-val';
        }
    }

    if (elCompleted) elCompleted.textContent = completedCount;
    if (elReviewed) elReviewed.textContent = reviewedCount;
}

/**
 * Handles Stock Adjustment Form Submission
 */
async function handleAdjustmentSubmit(e) {
    e.preventDefault();

    const productSelect = document.getElementById('adjustment-product');
    const warehouseSelect = document.getElementById('adjustment-warehouse');
    const countedInput = document.getElementById('adjustment-counted-qty');
    const reasonSelect = document.getElementById('adjustment-reason');
    const dateInput = document.getElementById('adjustment-date');
    const notesInput = document.getElementById('adjustment-notes');
    const errorBox = document.getElementById('adjustment-form-error');
    const submitBtn = document.getElementById('btn-submit-adjustment');

    const statusRadio = document.querySelector('input[name="adjustment-status"]:checked');
    const status = statusRadio ? statusRadio.value : 'Completed';

    clearAdjustmentErrors();
    if (errorBox) errorBox.style.display = 'none';

    let hasErrors = false;

    const productId = productSelect ? productSelect.value : '';
    const product = productsData.find(p => String(p.id) === String(productId));
    if (!productId || !product) {
        setFieldError('err-adjustment-product', productSelect, 'Please select a product');
        hasErrors = true;
    }

    const warehouse = warehouseSelect ? warehouseSelect.value : '';
    if (!warehouse) {
        setFieldError('err-adjustment-warehouse', warehouseSelect, 'Please select a warehouse location');
        hasErrors = true;
    }

    const countedQty = Number(countedInput ? countedInput.value : 0);
    if (!countedInput || countedInput.value.trim() === '' || isNaN(countedQty) || countedQty < 0) {
        setFieldError('err-adjustment-counted-qty', countedInput, 'Counted quantity must be a non-negative number (>= 0)');
        hasErrors = true;
    }

    const reason = reasonSelect ? reasonSelect.value : '';
    if (!reason) {
        setFieldError('err-adjustment-reason', reasonSelect, 'Please select an adjustment reason');
        hasErrors = true;
    }

    const adjDate = dateInput ? dateInput.value : '';
    if (!adjDate) {
        setFieldError('err-adjustment-date', dateInput, 'Please select an adjustment date');
        hasErrors = true;
    }

    if (hasErrors) {
        if (errorBox) {
            errorBox.textContent = 'Please correct the highlighted fields before applying adjustment.';
            errorBox.style.display = 'block';
        }
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Applying...';
    }

    const payload = {
        productId: String(product.id),
        warehouse: warehouse,
        countedQty: countedQty,
        reason: reason,
        date: adjDate,
        notes: notesInput ? notesInput.value.trim() : '',
        status: status
    };

    try {
        const res = await apiPost('/api/adjustments', payload);
        if (res && res.success) {
            showToast('Stock adjusted successfully', 'success', 3500);

            // Clear inputs
            if (countedInput) countedInput.value = '';
            if (notesInput) notesInput.value = '';
            setDefaultAdjustmentDate();
            updateRecordedQuantity();
            updateAdjustmentSummary();

            // Refresh state across all views
            await Promise.allSettled([
                loadAdjustments(),
                loadProducts(),
                loadWarehouses(),
                loadDashboardData(),
                loadMovements(),
                loadLowStockAlerts()
            ]);
        } else {
            const errMsg = (res && (res.error || res.message)) || 'Failed to apply stock adjustment';
            if (errorBox) {
                errorBox.textContent = errMsg;
                errorBox.style.display = 'block';
            }
            showToast(errMsg, 'danger', 4000);
        }
    } catch (err) {
        console.error('Adjustment API error:', err);
        const errMsg = err.message || 'Server error while applying adjustment';
        if (errorBox) {
            errorBox.textContent = errMsg;
            errorBox.style.display = 'block';
        }
        showToast(errMsg, 'danger', 4000);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-sliders"></i> Apply Adjustment';
        }
    }
}

function clearAdjustmentErrors() {
    const errorElements = document.querySelectorAll('[id^="err-adjustment-"]');
    errorElements.forEach(el => el.textContent = '');

    const inputs = document.querySelectorAll('#form-stock-adjustment .has-error');
    inputs.forEach(el => el.classList.remove('has-error'));

    const errorBox = document.getElementById('adjustment-form-error');
    if (errorBox) errorBox.style.display = 'none';
}

function resetAdjustmentForm() {
    const form = document.getElementById('form-stock-adjustment');
    if (form) form.reset();
    clearAdjustmentErrors();
    populateAdjustmentDropdowns();
    setDefaultAdjustmentDate();
    updateRecordedQuantity();
    updateAdjustmentSummary();
}

/**
 * Renders Recent Adjustments Table
 */
function renderAdjustmentsTable(adjustments) {
    const tbody = document.getElementById('adjustments-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (adjustments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-table-row">
                    <div class="empty-icon"><i class="fa-solid fa-sliders"></i></div>
                    <p>No adjustments recorded matching the current filter.</p>
                </td>
            </tr>
        `;
        return;
    }

    adjustments.forEach(adj => {
        const tr = document.createElement('tr');

        // Status badge
        let badgeClass = 'badge-status-completed';
        if (adj.status === 'Reviewed') badgeClass = 'badge-status-reviewed';

        // Difference badge
        let diffBadge = '';
        if (adj.difference > 0) {
            diffBadge = `<span class="badge badge-diff-positive"><i class="fa-solid fa-arrow-trend-up"></i> +${adj.difference}</span>`;
        } else if (adj.difference < 0) {
            diffBadge = `<span class="badge badge-diff-negative"><i class="fa-solid fa-arrow-trend-down"></i> ${adj.difference}</span>`;
        } else {
            diffBadge = `<span class="badge badge-diff-neutral"><i class="fa-solid fa-minus"></i> 0</span>`;
        }

        tr.innerHTML = `
            <td>
                <strong class="sku-badge">${escapeHtml(adj.id)}</strong>
            </td>
            <td>
                <div class="product-cell">
                    <span class="product-name-txt">${escapeHtml(adj.productName)}</span>
                    <span class="product-cat-txt">${escapeHtml(adj.productSku)}</span>
                </div>
            </td>
            <td>
                <span class="warehouse-tag">
                    <i class="fa-solid fa-location-dot"></i>
                    ${escapeHtml(adj.warehouse)}
                </span>
            </td>
            <td class="text-right">
                <span class="qty-val">${adj.recordedQty.toLocaleString()}</span>
            </td>
            <td class="text-right">
                <span class="qty-val font-bold">${adj.countedQty.toLocaleString()}</span>
            </td>
            <td class="text-center">
                ${diffBadge}
            </td>
            <td>
                <span class="badge badge-neutral">${escapeHtml(adj.reason)}</span>
            </td>
            <td>
                <span class="product-cat-txt">${escapeHtml(adj.date)}</span>
            </td>
            <td class="text-center">
                <span class="badge ${badgeClass}">${escapeHtml(adj.status)}</span>
            </td>
            <td class="text-center">
                <button class="icon-btn-subtle btn-view-adjustment" data-id="${escapeHtml(adj.id)}" title="View Adjustment Slip">
                    <i class="fa-regular fa-file-lines"></i>
                </button>
            </td>
        `;

        const viewBtn = tr.querySelector('.btn-view-adjustment');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                showNotification(`Adjustment Slip #${adj.id} loaded. Reason: ${adj.reason}`, 'info');
            });
        }

        tbody.appendChild(tr);
    });
}

/**
 * Filter adjustments by search keyword, reason, and status
 */
function getFilteredAdjustments() {
    const searchInput = document.getElementById('adjustments-search-input');
    const reasonSelect = document.getElementById('adjustments-reason-filter');
    const statusSelect = document.getElementById('adjustments-status-filter');

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedReason = reasonSelect ? reasonSelect.value : 'ALL';
    const selectedStatus = statusSelect ? statusSelect.value : 'ALL';

    return adjustmentsData.filter(item => {
        const matchesSearch = query === '' ||
            item.id.toLowerCase().includes(query) ||
            item.productName.toLowerCase().includes(query) ||
            item.productSku.toLowerCase().includes(query) ||
            item.warehouse.toLowerCase().includes(query) ||
            item.reason.toLowerCase().includes(query);

        const matchesReason = selectedReason === 'ALL' || item.reason === selectedReason;
        const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

        return matchesSearch && matchesReason && matchesStatus;
    });
}

/**
 * Sets up event listeners for Stock Adjustments view
 */
function setupAdjustmentsInteractions() {
    const productSelect = document.getElementById('adjustment-product');
    const warehouseSelect = document.getElementById('adjustment-warehouse');
    const reasonSelect = document.getElementById('adjustment-reason');
    const countedInput = document.getElementById('adjustment-counted-qty');
    const searchInput = document.getElementById('adjustments-search-input');
    const clearBtn = document.getElementById('adjustments-search-clear');
    const reasonFilter = document.getElementById('adjustments-reason-filter');
    const statusFilter = document.getElementById('adjustments-status-filter');

    if (productSelect) {
        productSelect.addEventListener('change', () => {
            clearAdjustmentErrors();
            updateRecordedQuantity();
        });
    }

    if (warehouseSelect) {
        warehouseSelect.addEventListener('change', () => {
            clearAdjustmentErrors();
            updateRecordedQuantity();
        });
    }

    if (reasonSelect) {
        reasonSelect.addEventListener('change', () => {
            clearAdjustmentErrors();
            updateAdjustmentSummary();
        });
    }

    if (countedInput) {
        countedInput.addEventListener('input', () => {
            clearAdjustmentErrors();
            updateAdjustmentSummary();
        });
    }

    const handleFilterChange = () => {
        if (clearBtn && searchInput) {
            clearBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
        }
        renderAdjustmentsTable(getFilteredAdjustments());
    };

    if (searchInput) searchInput.addEventListener('input', handleFilterChange);
    if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            handleFilterChange();
            searchInput.focus();
        });
    }
    if (reasonFilter) reasonFilter.addEventListener('change', handleFilterChange);
    if (statusFilter) statusFilter.addEventListener('change', handleFilterChange);
}

/* ==========================================================================
   Receive Stock Operations & Dynamic Live Summary
   ========================================================================== */

function populateReceiveProductDropdown() {
    const select = document.getElementById('receive-product');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="">Select Product</option>';

    productsData.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = `${p.name} (${p.sku}) - ${p.unit}`;
        select.appendChild(option);
    });

    if (currentVal && productsData.some(p => p.id == currentVal)) {
        select.value = currentVal;
    } else if (productsData.length > 0) {
        select.value = productsData[0].id;
    }
}

function setDefaultReceiptDate() {
    const dateInput = document.getElementById('receive-date');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

function updateReceiveSummary() {
    const productSelect = document.getElementById('receive-product');
    const warehouseSelect = document.getElementById('receive-warehouse');
    const qtyInput = document.getElementById('receive-quantity');
    const costInput = document.getElementById('receive-unit-cost');
    const supplierSelect = document.getElementById('receive-supplier');

    const elProdName = document.getElementById('summary-product-name');
    const elSkuTag = document.getElementById('summary-sku-tag');
    const elCategory = document.getElementById('summary-category-name');
    const elWarehouse = document.getElementById('summary-warehouse-name');
    const elSupplier = document.getElementById('summary-supplier-display');
    const elCurrentStock = document.getElementById('summary-current-stock');
    const elQtyToReceive = document.getElementById('summary-qty-to-receive');
    const elEstStock = document.getElementById('summary-estimated-stock');
    const elStockBar = document.getElementById('summary-stock-bar');
    const elTotalAll = document.getElementById('summary-total-all-stock');
    const elFinancialBox = document.getElementById('summary-financial-box');
    const elUnitCostVal = document.getElementById('summary-unit-cost-val');
    const elTotalVal = document.getElementById('summary-total-val');

    const productId = productSelect ? Number(productSelect.value) : null;
    const warehouse = warehouseSelect ? warehouseSelect.value : 'Main Warehouse';
    const supplier = supplierSelect ? supplierSelect.value : '';
    const quantity = qtyInput ? Math.max(0, Number(qtyInput.value) || 0) : 0;
    const unitCost = costInput ? Math.max(0, Number(costInput.value) || 0) : 0;

    const product = productsData.find(p => p.id === productId);

    if (product) {
        if (elProdName) elProdName.textContent = product.name;
        if (elSkuTag) elSkuTag.textContent = product.sku;
        if (elCategory) elCategory.textContent = `Category: ${product.category}`;

        const currentWarehouseStock = warehouse === 'Main Warehouse'
            ? product.mainWarehouseStock
            : product.productionFloorStock;

        const estimatedStock = currentWarehouseStock + quantity;
        const totalCurrent = product.mainWarehouseStock + product.productionFloorStock;
        const projectedTotal = totalCurrent + quantity;

        if (elCurrentStock) elCurrentStock.textContent = `${currentWarehouseStock.toLocaleString()} ${product.unit}`;
        if (elQtyToReceive) elQtyToReceive.textContent = `+${quantity.toLocaleString()} ${product.unit}`;
        if (elEstStock) elEstStock.textContent = `${estimatedStock.toLocaleString()} ${product.unit}`;
        if (elTotalAll) elTotalAll.textContent = `${projectedTotal.toLocaleString()} ${product.unit}`;

        if (elStockBar) {
            const reorderTarget = Math.max(product.reorderLevel * 2, projectedTotal, 100);
            const pct = Math.min(100, Math.round((estimatedStock / reorderTarget) * 100));
            elStockBar.style.width = `${Math.max(5, pct)}%`;
        }
    } else {
        if (elProdName) elProdName.textContent = 'Please select a product';
        if (elSkuTag) elSkuTag.textContent = '---';
        if (elCategory) elCategory.textContent = 'Category: ---';
        if (elCurrentStock) elCurrentStock.textContent = '0';
        if (elQtyToReceive) elQtyToReceive.textContent = `+${quantity}`;
        if (elEstStock) elEstStock.textContent = '0';
        if (elTotalAll) elTotalAll.textContent = '0';
        if (elStockBar) elStockBar.style.width = '0%';
    }

    if (elWarehouse) elWarehouse.textContent = warehouse;
    if (elSupplier) elSupplier.textContent = `Supplier: ${supplier || 'Not selected'}`;

    if (unitCost > 0 && quantity > 0 && elFinancialBox) {
        elFinancialBox.style.display = 'flex';
        const totalValue = quantity * unitCost;
        if (elUnitCostVal) elUnitCostVal.textContent = `$${unitCost.toFixed(2)}`;
        if (elTotalVal) elTotalVal.textContent = `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (elFinancialBox) {
        elFinancialBox.style.display = 'none';
    }
}

function setupReceiveStockInteractions() {
    const productSelect = document.getElementById('receive-product');
    const warehouseSelect = document.getElementById('receive-warehouse');
    const qtyInput = document.getElementById('receive-quantity');
    const costInput = document.getElementById('receive-unit-cost');
    const supplierSelect = document.getElementById('receive-supplier');
    const addAnotherBtn = document.getElementById('btn-add-another-item');
    const resetBtn = document.getElementById('btn-reset-receive');
    const searchReceiptsInput = document.getElementById('receipts-search-input');
    const clearReceiptsSearch = document.getElementById('receipts-search-clear');
    const statusFilter = document.getElementById('receipts-status-filter');

    [productSelect, warehouseSelect, supplierSelect].forEach(el => {
        if (el) el.addEventListener('change', updateReceiveSummary);
    });

    [qtyInput, costInput].forEach(el => {
        if (el) el.addEventListener('input', updateReceiveSummary);
    });

    if (addAnotherBtn) {
        addAnotherBtn.addEventListener('click', () => {
            if (qtyInput) qtyInput.value = '';
            if (costInput) costInput.value = '';
            const notesEl = document.getElementById('receive-notes');
            if (notesEl) notesEl.value = '';

            clearReceiveErrors();
            updateReceiveSummary();

            if (productSelect) productSelect.focus();
            showNotification('Ready to receive another item for this consignment.', 'info', 2500);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const form = document.getElementById('form-receive-stock');
            if (form) form.reset();
            setDefaultReceiptDate();
            clearReceiveErrors();
            updateReceiveSummary();
            showNotification('Inbound form fields cleared.', 'info', 2000);
        });
    }

    const handleReceiptFilterChange = () => {
        if (clearReceiptsSearch && searchReceiptsInput) {
            clearReceiptsSearch.style.display = searchReceiptsInput.value.length > 0 ? 'block' : 'none';
        }
        renderReceiptsTable(getFilteredReceipts());
    };

    if (searchReceiptsInput) searchReceiptsInput.addEventListener('input', handleReceiptFilterChange);
    if (clearReceiptsSearch) {
        clearReceiptsSearch.addEventListener('click', () => {
            searchReceiptsInput.value = '';
            handleReceiptFilterChange();
            searchReceiptsInput.focus();
        });
    }
    if (statusFilter) statusFilter.addEventListener('change', handleReceiptFilterChange);
}

function getFilteredReceipts() {
    const searchInput = document.getElementById('receipts-search-input');
    const statusFilter = document.getElementById('receipts-status-filter');

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const status = statusFilter ? statusFilter.value : 'ALL';

    return receiptsData.filter(r => {
        const matchesQuery = query === '' ||
            r.id.toLowerCase().includes(query) ||
            r.supplier.toLowerCase().includes(query) ||
            r.productName.toLowerCase().includes(query) ||
            r.productSku.toLowerCase().includes(query) ||
            r.warehouse.toLowerCase().includes(query);

        const matchesStatus = status === 'ALL' || r.status === status;

        return matchesQuery && matchesStatus;
    });
}

function renderReceiptsTable(receipts) {
    const tbody = document.getElementById('receipts-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (receipts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-table-row">
                    <div class="empty-icon"><i class="fa-solid fa-receipt"></i></div>
                    <p>No recent receipts found matching your filter criteria.</p>
                </td>
            </tr>
        `;
        return;
    }

    receipts.forEach(r => {
        const tr = document.createElement('tr');
        const badgeClass = r.status === 'Completed' ? 'badge-status-completed' : 'badge-status-draft';

        tr.innerHTML = `
            <td>
                <strong class="sku-badge">${escapeHtml(r.id)}</strong>
            </td>
            <td>
                <span class="product-name-txt">${escapeHtml(r.supplier)}</span>
            </td>
            <td>
                <div class="product-cell">
                    <span class="product-name-txt">${escapeHtml(r.productName)}</span>
                    <span class="product-cat-txt">${escapeHtml(r.productSku)}</span>
                </div>
            </td>
            <td>
                <span class="warehouse-tag">
                    <i class="fa-solid fa-location-dot"></i>
                    ${escapeHtml(r.warehouse)}
                </span>
            </td>
            <td class="text-right">
                <span class="qty-val text-success">+${r.quantity.toLocaleString()} ${escapeHtml(r.unit || '')}</span>
            </td>
            <td>
                <span class="product-cat-txt">${escapeHtml(r.date)}</span>
            </td>
            <td class="text-center">
                <span class="badge ${badgeClass}">${escapeHtml(r.status)}</span>
            </td>
            <td class="text-center">
                <button class="icon-btn-subtle btn-view-receipt" data-id="${escapeHtml(r.id)}" title="View Receipt Goods Slip">
                    <i class="fa-regular fa-file-lines"></i>
                </button>
            </td>
        `;

        const viewBtn = tr.querySelector('.btn-view-receipt');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                showNotification(`Consignment Slip #${r.id} for ${r.supplier} loaded.`, 'info');
            });
        }

        tbody.appendChild(tr);
    });
}

function updateReceiptsMetrics() {
    const elCount = document.getElementById('receipts-stat-count');
    const elUnits = document.getElementById('receipts-stat-units');

    if (elCount) elCount.textContent = receiptsData.length;

    let totalUnits = 0;
    receiptsData.forEach(r => {
        if (r.status === 'Completed') totalUnits += r.quantity;
    });

    if (elUnits) elUnits.textContent = totalUnits.toLocaleString();
}

async function handleReceiveStockSubmit(e) {
    e.preventDefault();

    const supplierSelect = document.getElementById('receive-supplier');
    const dateInput = document.getElementById('receive-date');
    const productSelect = document.getElementById('receive-product');
    const warehouseSelect = document.getElementById('receive-warehouse');
    const qtyInput = document.getElementById('receive-quantity');
    const costInput = document.getElementById('receive-unit-cost');
    const notesInput = document.getElementById('receive-notes');
    const errorBox = document.getElementById('receive-form-error');

    const statusRadio = document.querySelector('input[name="receipt-status"]:checked');
    const status = statusRadio ? statusRadio.value : 'Completed';

    clearReceiveErrors();
    if (errorBox) errorBox.style.display = 'none';

    let hasErrors = false;

    const supplier = supplierSelect.value;
    if (!supplier) {
        setFieldError('err-receive-supplier', supplierSelect, 'Please select a supplier');
        hasErrors = true;
    }

    const receiptDate = dateInput.value;
    if (!receiptDate) {
        setFieldError('err-receive-date', dateInput, 'Please select a receipt date');
        hasErrors = true;
    }

    const productId = productSelect ? productSelect.value : '';
    const product = productsData.find(p => String(p.id) === String(productId));
    if (!productId || !product) {
        setFieldError('err-receive-product', productSelect, 'Please select a product');
        hasErrors = true;
    }

    const warehouse = warehouseSelect.value;
    if (!warehouse) {
        setFieldError('err-receive-warehouse', warehouseSelect, 'Please select a destination warehouse');
        hasErrors = true;
    }

    const quantity = Number(qtyInput.value);
    if (!qtyInput.value.trim() || isNaN(quantity) || quantity <= 0) {
        setFieldError('err-receive-quantity', qtyInput, 'Quantity received must be greater than 0');
        hasErrors = true;
    }

    const unitCost = costInput && costInput.value.trim() !== '' ? Number(costInput.value) : 0;
    if (unitCost < 0) {
        setFieldError('err-receive-unit-cost', costInput, 'Unit cost cannot be negative');
        hasErrors = true;
    }

    if (hasErrors) {
        if (errorBox) {
            errorBox.textContent = 'Please correct the highlighted fields before receiving stock.';
            errorBox.style.display = 'block';
        }
        return;
    }

    try {
        const res = await apiPost('/api/receipts', {
            supplier: supplier,
            productId: product.id,
            warehouse: warehouse,
            quantity: quantity,
            unitCost: unitCost,
            date: receiptDate,
            notes: notesInput ? notesInput.value.trim() : '',
            status: status
        });

        const recId = (res && res.data && res.data.id) || 'Recorded';
        showNotification(`Stock received successfully: ${recId}`, 'success', 3500);

        if (qtyInput) qtyInput.value = '';
        if (costInput) costInput.value = '';
        if (notesInput) notesInput.value = '';

        await Promise.allSettled([
            loadReceipts(),
            loadProducts(),
            loadDashboardData(),
            loadMovements(),
            loadLowStockAlerts()
        ]);
    } catch (err) {
        if (errorBox) {
            errorBox.textContent = err.message || 'Failed to record receipt on server';
            errorBox.style.display = 'block';
        }
        showNotification(err.message || 'Failed to record stock receipt', 'danger', 4000);
    }
}

function clearReceiveErrors() {
    const errorElements = document.querySelectorAll('[id^="err-receive-"]');
    errorElements.forEach(el => el.textContent = '');

    const inputs = document.querySelectorAll('#form-receive-stock .has-error');
    inputs.forEach(el => el.classList.remove('has-error'));

    const errorBox = document.getElementById('receive-form-error');
    if (errorBox) errorBox.style.display = 'none';
}

// In production: Replace with fetch('/api/dashboard/stats') or Firestore aggregate query
function updateDashboardStats() {
    const elDashProducts = document.getElementById('dashboard-total-products');
    const elDashStockUnits = document.getElementById('dashboard-total-stock-units');
    const elDashLowStock = document.getElementById('dashboard-low-stock-count');
    const elDashMovements = document.getElementById('dashboard-movements-count');
    const elLowStockBadge = document.getElementById('low-stock-count-badge');

    const totalProducts = productsData.length;
    let totalStockUnits = 0;
    let lowStockCount = 0;

    productsData.forEach(p => {
        const total = (p.mainWarehouseStock || 0) + (p.productionFloorStock || 0);
        totalStockUnits += total;
        if (total <= (p.reorderLevel || 0)) {
            lowStockCount++;
        }
    });

    const allMovements = getAllMovements();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = allMovements.filter(m => m.date === todayStr || m.date === "2024-09-26").length;

    if (elDashProducts) elDashProducts.textContent = totalProducts.toLocaleString();
    if (elDashStockUnits) elDashStockUnits.textContent = totalStockUnits.toLocaleString();
    if (elDashLowStock) elDashLowStock.textContent = lowStockCount;
    if (elDashMovements) elDashMovements.textContent = todayCount;
    if (elLowStockBadge) elLowStockBadge.textContent = `${lowStockCount} Items Alerting`;

    renderLowStockTableFromProducts();
    const whView = document.getElementById('view-warehouses');
    if (whView && whView.classList.contains('active')) {
        renderWarehouses();
    }
}

function updateDashboardMetrics(addedUnits = 0) {
    updateDashboardStats();
}

/* ==========================================================================
   Status Calculation Logic (Total Stock vs Reorder Level)
   ========================================================================== */

function computeProductStatus(totalStock, reorderLevel) {
    if (totalStock === 0) {
        return 'Out of Stock';
    } else if (totalStock <= reorderLevel) {
        return 'Low Stock';
    } else {
        return 'In Stock';
    }
}

function getProductStatusBadgeClass(status) {
    switch (status) {
        case 'In Stock': return 'badge-in-stock';
        case 'Low Stock': return 'badge-low-stock';
        case 'Out of Stock': return 'badge-out-of-stock';
        default: return 'badge-neutral';
    }
}

/* ==========================================================================
   Products Catalog Table Rendering & Metrics
   ========================================================================== */

function renderProductsTable(products) {
    const tbody = document.getElementById('products-tbody');
    const countBadge = document.getElementById('products-count-badge');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (countBadge) countBadge.textContent = `${products.length} Products`;

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-table-row">
                    <div class="empty-icon"><i class="fa-solid fa-box-open"></i></div>
                    <p>No products match your search or filter criteria.</p>
                </td>
            </tr>
        `;
        return;
    }

    products.forEach(item => {
        const totalStock = Number(item.mainWarehouseStock || 0) + Number(item.productionFloorStock || 0);
        const status = computeProductStatus(totalStock, Number(item.reorderLevel || 0));
        const badgeClass = getProductStatusBadgeClass(status);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="product-cell">
                    <span class="product-name-txt">${escapeHtml(item.name)}</span>
                </div>
            </td>
            <td>
                <span class="sku-badge">${escapeHtml(item.sku)}</span>
            </td>
            <td>
                <span class="product-cat-txt">${escapeHtml(item.category)}</span>
            </td>
            <td class="text-center">
                <span class="unit-tag">${escapeHtml(item.unit)}</span>
            </td>
            <td class="text-right">
                <span class="qty-val">${item.mainWarehouseStock.toLocaleString()}</span>
            </td>
            <td class="text-right">
                <span class="qty-val">${item.productionFloorStock.toLocaleString()}</span>
            </td>
            <td class="text-right">
                <span class="qty-total ${totalStock === 0 ? 'qty-danger' : ''}">${totalStock.toLocaleString()}</span>
            </td>
            <td class="text-right">
                <span class="reorder-level-val">${item.reorderLevel.toLocaleString()}</span>
            </td>
            <td class="text-center">
                <span class="badge ${badgeClass}">${status}</span>
            </td>
            <td class="text-center">
                <div class="table-action-group">
                    <button class="btn-action btn-edit-product" data-id="${item.id}" title="Edit ${escapeHtml(item.name)}">
                        <i class="fa-regular fa-pen-to-square"></i> Edit
                    </button>
                    <button class="btn-action danger btn-delete-product" data-id="${item.id}" title="Delete ${escapeHtml(item.name)}">
                        <i class="fa-regular fa-trash-can"></i> Delete
                    </button>
                </div>
            </td>
        `;

        const editBtn = tr.querySelector('.btn-edit-product');
        if (editBtn) editBtn.addEventListener('click', () => openEditModal(item.id));

        const deleteBtn = tr.querySelector('.btn-delete-product');
        if (deleteBtn) deleteBtn.addEventListener('click', () => openDeleteConfirmModal(item.id));

        tbody.appendChild(tr);
    });
}

function updateProductsMetrics() {
    let inStock = 0;
    let lowStock = 0;
    let outStock = 0;

    productsData.forEach(p => {
        const total = Number(p.mainWarehouseStock || 0) + Number(p.productionFloorStock || 0);
        const status = computeProductStatus(total, Number(p.reorderLevel || 0));
        if (status === 'In Stock') inStock++;
        else if (status === 'Low Stock') lowStock++;
        else if (status === 'Out of Stock') outStock++;
    });

    const elTotal = document.getElementById('prod-stat-total');
    const elInStock = document.getElementById('prod-stat-in-stock');
    const elLowStock = document.getElementById('prod-stat-low-stock');
    const elOutStock = document.getElementById('prod-stat-out-stock');

    if (elTotal) elTotal.textContent = productsData.length;
    if (elInStock) elInStock.textContent = inStock;
    if (elLowStock) elLowStock.textContent = lowStock;
    if (elOutStock) elOutStock.textContent = outStock;

    const elDashTotal = document.getElementById('dashboard-total-products');
    if (elDashTotal) {
        elDashTotal.textContent = productsData.length;
    }
}

function getFilteredProducts() {
    const searchInput = document.getElementById('products-search-input');
    const categorySelect = document.getElementById('products-category-filter');
    const warehouseSelect = document.getElementById('products-warehouse-filter');

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedCategory = categorySelect ? categorySelect.value : 'ALL';
    const selectedWarehouse = warehouseSelect ? warehouseSelect.value : 'ALL';

    return productsData.filter(item => {
        const matchesSearch = query === '' ||
            item.name.toLowerCase().includes(query) ||
            item.sku.toLowerCase().includes(query);

        const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

        let matchesWarehouse = true;
        if (selectedWarehouse === 'Main Warehouse') {
            matchesWarehouse = item.mainWarehouseStock > 0;
        } else if (selectedWarehouse === 'Production Floor') {
            matchesWarehouse = item.productionFloorStock > 0;
        }

        return matchesSearch && matchesCategory && matchesWarehouse;
    });
}

function setupProductsViewInteractions() {
    const searchInput = document.getElementById('products-search-input');
    const clearBtn = document.getElementById('products-search-clear');
    const categorySelect = document.getElementById('products-category-filter');
    const warehouseSelect = document.getElementById('products-warehouse-filter');

    const handleFilterChange = () => {
        if (clearBtn && searchInput) {
            clearBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
        }
        renderProductsTable(getFilteredProducts());
    };

    if (searchInput) searchInput.addEventListener('input', handleFilterChange);
    if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            handleFilterChange();
            searchInput.focus();
        });
    }
    if (categorySelect) categorySelect.addEventListener('change', handleFilterChange);
    if (warehouseSelect) warehouseSelect.addEventListener('change', handleFilterChange);
}

/* ==========================================================================
   Modal Dialog Management
   ========================================================================== */
function setupModals() {
    const openAddBtn = document.getElementById('btn-open-add-product');
    if (openAddBtn) {
        openAddBtn.addEventListener('click', () => {
            resetAddForm();
            openModal('modal-add-product');
        });
    }

    const closeButtons = document.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close-modal');
            closeModal(modalId);
        });
    });

    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal(backdrop.id);
        });
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModalEl = document.querySelector('.modal-backdrop.show');
            if (openModalEl) closeModal(openModalEl.id);
        }
    });

    const confirmDeleteBtn = document.getElementById('btn-confirm-delete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', executeProductDelete);
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    const firstInput = modal.querySelector('input:not([type="hidden"]), select');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

/* ==========================================================================
   Form Handling & Validation
   ========================================================================== */
function setupForms() {
    const addForm = document.getElementById('form-add-product');
    const editForm = document.getElementById('form-edit-product');
    const receiveForm = document.getElementById('form-receive-stock');
    const deliveryForm = document.getElementById('form-delivery-order');
    const transferForm = document.getElementById('form-transfer-order');
    const adjustmentForm = document.getElementById('form-stock-adjustment');

    if (addForm) addForm.addEventListener('submit', handleAddProductSubmit);
    if (editForm) editForm.addEventListener('submit', handleEditProductSubmit);
    if (receiveForm) receiveForm.addEventListener('submit', handleReceiveStockSubmit);
    if (deliveryForm) deliveryForm.addEventListener('submit', handleDeliveryOrderSubmit);
    if (transferForm) transferForm.addEventListener('submit', handleTransferSubmit);
    if (adjustmentForm) adjustmentForm.addEventListener('submit', handleAdjustmentSubmit);

    const resetTransferBtn = document.getElementById('btn-reset-transfer');
    if (resetTransferBtn) resetTransferBtn.addEventListener('click', resetTransferForm);

    const resetAdjBtn = document.getElementById('btn-reset-adjustment');
    if (resetAdjBtn) resetAdjBtn.addEventListener('click', resetAdjustmentForm);
}

async function handleAddProductSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('add-product-name');
    const skuInput = document.getElementById('add-product-sku');
    const categorySelect = document.getElementById('add-product-category');
    const unitSelect = document.getElementById('add-product-unit');
    const reorderInput = document.getElementById('add-product-reorder');
    const stockInput = document.getElementById('add-product-stock');
    const warehouseSelect = document.getElementById('add-product-warehouse');
    const errorBox = document.getElementById('add-form-error');

    clearFormErrors('add');
    if (errorBox) errorBox.style.display = 'none';

    let hasErrors = false;
    const name = nameInput.value.trim();
    if (!name) {
        setFieldError('err-add-name', nameInput, 'Product name is required');
        hasErrors = true;
    }

    const sku = skuInput.value.trim().toUpperCase();
    if (!sku) {
        setFieldError('err-add-sku', skuInput, 'SKU code is required');
        hasErrors = true;
    }

    const category = categorySelect.value;
    if (!category) {
        setFieldError('err-add-category', categorySelect, 'Please select a category');
        hasErrors = true;
    }

    const unit = unitSelect.value;
    if (!unit) {
        setFieldError('err-add-unit', unitSelect, 'Please select a unit of measure');
        hasErrors = true;
    }

    const reorderLevel = Number(reorderInput.value);
    if (reorderInput.value.trim() === '' || isNaN(reorderLevel) || reorderLevel < 0) {
        setFieldError('err-add-reorder', reorderInput, 'Reorder level must be a non-negative number');
        hasErrors = true;
    }

    const initialStock = Number(stockInput.value);
    if (stockInput.value.trim() === '' || isNaN(initialStock) || initialStock < 0) {
        setFieldError('err-add-stock', stockInput, 'Initial stock must be a non-negative number');
        hasErrors = true;
    }

    const warehouse = warehouseSelect.value;
    if (!warehouse) {
        setFieldError('err-add-warehouse', warehouseSelect, 'Please select initial warehouse allocation');
        hasErrors = true;
    }

    if (hasErrors) {
        if (errorBox) {
            errorBox.textContent = 'Please correct the highlighted errors before saving.';
            errorBox.style.display = 'block';
        }
        return;
    }

    try {
        const res = await apiPost('/api/products', {
            name: name,
            sku: sku,
            category: category,
            unit: unit,
            reorderLevel: reorderLevel,
            initialStock: initialStock,
            warehouse: warehouse
        });

        closeModal('modal-add-product');
        resetAddForm();
        showNotification(`Product "${name}" (${sku}) added successfully!`, 'success', 3500);

        await Promise.allSettled([
            loadProducts(),
            loadDashboardData(),
            loadMovements(),
            loadWarehouses()
        ]);
    } catch (err) {
        if (errorBox) {
            errorBox.textContent = err.message || 'Failed to create product on server';
            errorBox.style.display = 'block';
        }
        showNotification(err.message || 'Failed to add product', 'danger', 4000);
    }
}

function openEditModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    clearFormErrors('edit');
    const errorBox = document.getElementById('edit-form-error');
    if (errorBox) errorBox.style.display = 'none';

    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-sku').value = product.sku;
    document.getElementById('edit-product-category').value = product.category;
    document.getElementById('edit-product-unit').value = product.unit;
    document.getElementById('edit-product-reorder').value = product.reorderLevel;
    document.getElementById('edit-product-main-stock').value = product.mainWarehouseStock;
    document.getElementById('edit-product-prod-stock').value = product.productionFloorStock;

    openModal('modal-edit-product');
}

async function handleEditProductSubmit(e) {
    e.preventDefault();

    const idInput = document.getElementById('edit-product-id');
    const nameInput = document.getElementById('edit-product-name');
    const skuInput = document.getElementById('edit-product-sku');
    const categorySelect = document.getElementById('edit-product-category');
    const unitSelect = document.getElementById('edit-product-unit');
    const reorderInput = document.getElementById('edit-product-reorder');
    const mainStockInput = document.getElementById('edit-product-main-stock');
    const prodStockInput = document.getElementById('edit-product-prod-stock');
    const errorBox = document.getElementById('edit-form-error');

    clearFormErrors('edit');
    if (errorBox) errorBox.style.display = 'none';

    const productId = idInput.value;
    const productIndex = productsData.findIndex(p => String(p.id) === String(productId));

    if (productIndex === -1) {
        showNotification('Product not found.', 'danger');
        closeModal('modal-edit-product');
        return;
    }

    let hasErrors = false;
    const name = nameInput.value.trim();
    if (!name) {
        setFieldError('err-edit-name', nameInput, 'Product name is required');
        hasErrors = true;
    }

    const sku = skuInput.value.trim().toUpperCase();
    if (!sku) {
        setFieldError('err-edit-sku', skuInput, 'SKU code is required');
        hasErrors = true;
    } else {
        const isDuplicate = productsData.some(p => p.id !== productId && p.sku.toUpperCase() === sku);
        if (isDuplicate) {
            setFieldError('err-edit-sku', skuInput, `SKU "${sku}" is already assigned to another product`);
            hasErrors = true;
        }
    }

    const category = categorySelect.value;
    if (!category) {
        setFieldError('err-edit-category', categorySelect, 'Please select a category');
        hasErrors = true;
    }

    const unit = unitSelect.value;
    if (!unit) {
        setFieldError('err-edit-unit', unitSelect, 'Please select a unit');
        hasErrors = true;
    }

    const reorderLevel = Number(reorderInput.value);
    if (reorderInput.value.trim() === '' || isNaN(reorderLevel) || reorderLevel < 0) {
        setFieldError('err-edit-reorder', reorderInput, 'Reorder level must be >= 0');
        hasErrors = true;
    }

    const mainStock = Number(mainStockInput.value);
    if (mainStockInput.value.trim() === '' || isNaN(mainStock) || mainStock < 0) {
        setFieldError('err-edit-main-stock', mainStockInput, 'Main warehouse stock must be >= 0');
        hasErrors = true;
    }

    const prodStock = Number(prodStockInput.value);
    if (prodStockInput.value.trim() === '' || isNaN(prodStock) || prodStock < 0) {
        setFieldError('err-edit-prod-stock', prodStockInput, 'Production floor stock must be >= 0');
        hasErrors = true;
    }

    if (hasErrors) {
        if (errorBox) {
            errorBox.textContent = 'Please resolve all field errors before saving.';
            errorBox.style.display = 'block';
        }
        return;
    }

    try {
        await apiPut(`/api/products/${productId}`, {
            name: name,
            sku: sku,
            category: category,
            unit: unit,
            reorderLevel: reorderLevel,
            mainWarehouseStock: mainStock,
            productionFloorStock: prodStock
        });

        closeModal('modal-edit-product');
        showNotification(`Product "${name}" (${sku}) updated successfully!`, 'success', 3500);

        await Promise.allSettled([
            loadProducts(),
            loadDashboardData(),
            loadWarehouses()
        ]);
    } catch (err) {
        if (errorBox) {
            errorBox.textContent = err.message || 'Failed to update product on server';
            errorBox.style.display = 'block';
        }
        showNotification(err.message || 'Failed to update product', 'danger', 4000);
    }
}

function openDeleteConfirmModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    productPendingDeleteId = productId;
    const nameEl = document.getElementById('delete-target-name');
    const skuEl = document.getElementById('delete-target-sku');

    if (nameEl) nameEl.textContent = `"${product.name}"`;
    if (skuEl) skuEl.textContent = product.sku;

    openModal('modal-delete-confirm');
}

async function executeProductDelete() {
    if (!productPendingDeleteId) return;

    const idToDelete = productPendingDeleteId;
    const product = productsData.find(p => p.id === productPendingDeleteId);
    const productName = product ? product.name : 'Product';

    try {
        await apiDelete(`/api/products/${idToDelete}`);
        productPendingDeleteId = null;
        closeModal('modal-delete-confirm');
        showNotification(`Product "${productName}" has been removed from inventory.`, 'success', 3500);

        await Promise.allSettled([
            loadProducts(),
            loadDashboardData(),
            loadWarehouses()
        ]);
    } catch (err) {
        showNotification(err.message || 'Failed to delete product on server', 'danger', 4000);
    }
}

function resetAddForm() {
    const form = document.getElementById('form-add-product');
    if (form) form.reset();
    clearFormErrors('add');
    const errorBox = document.getElementById('add-form-error');
    if (errorBox) errorBox.style.display = 'none';
}

function setFieldError(errorElementId, inputEl, message) {
    const errEl = document.getElementById(errorElementId);
    if (errEl) errEl.textContent = message;
    if (inputEl) inputEl.classList.add('has-error');
}

function clearFormErrors(prefix) {
    const errorElements = document.querySelectorAll(`[id^="err-${prefix}-"]`);
    errorElements.forEach(el => el.textContent = '');

    const inputs = document.querySelectorAll(`#form-${prefix}-product .has-error`);
    inputs.forEach(el => el.classList.remove('has-error'));
}

/* ==========================================================================
   Dashboard Tables & Search
   ========================================================================== */
function getLowStockProductsFromCatalog() {
    return productsData
        .filter(p => ((p.mainWarehouseStock || 0) + (p.productionFloorStock || 0)) <= (p.reorderLevel || 0))
        .map(p => {
            const total = (p.mainWarehouseStock || 0) + (p.productionFloorStock || 0);
            let whLabel = "Main Warehouse";
            if (p.mainWarehouseStock > 0 && p.productionFloorStock > 0) whLabel = "Multiple Facilities";
            else if (p.productionFloorStock > 0) whLabel = "Production Floor";
            else if (total === 0) whLabel = "All Facilities (Out of Stock)";

            return {
                id: p.id,
                name: p.name,
                category: p.category,
                sku: p.sku,
                warehouse: whLabel,
                currentQty: total,
                reorderLevel: p.reorderLevel,
                status: total === 0 ? "Out of Stock" : "Reorder"
            };
        });
}

function renderLowStockTableFromProducts() {
    const list = getLowStockProductsFromCatalog();
    renderLowStockTable(list);
}

function renderLowStockTable(products) {
    const tbody = document.getElementById('low-stock-tbody');
    const badgeCount = document.getElementById('low-stock-count-badge');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (badgeCount) badgeCount.textContent = `${products.length} Items Alerting`;

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table-row">
                    <div class="empty-icon"><i class="fa-regular fa-circle-check"></i></div>
                    <p>No low stock items matching the current filter.</p>
                </td>
            </tr>
        `;
        return;
    }

    products.forEach(item => {
        const currentQty = item.currentQty !== undefined ? item.currentQty : (item.totalStock !== undefined ? item.totalStock : 0);
        let whLabel = item.warehouse;
        if (!whLabel) {
            const main = item.mainWarehouseStock || 0;
            const floor = item.productionFloorStock || 0;
            if (main > 0 && floor > 0) whLabel = "Multiple Facilities";
            else if (floor > 0) whLabel = "Production Floor";
            else if (currentQty === 0) whLabel = "All Facilities (Out of Stock)";
            else whLabel = "Main Warehouse";
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="product-cell">
                    <span class="product-name-txt">${escapeHtml(item.name)}</span>
                    <span class="product-cat-txt">${escapeHtml(item.category)}</span>
                </div>
            </td>
            <td>
                <span class="sku-badge">${escapeHtml(item.sku)}</span>
            </td>
            <td>
                <span class="warehouse-tag">
                    <i class="fa-solid fa-location-dot"></i>
                    ${escapeHtml(whLabel)}
                </span>
            </td>
            <td class="text-right">
                <span class="qty-danger">${currentQty}</span>
            </td>
            <td class="text-right">
                <span class="reorder-level-val">${item.reorderLevel}</span>
            </td>
            <td class="text-center">
                <span class="badge badge-reorder">${escapeHtml(item.status || 'Low Stock')}</span>
            </td>
            <td class="text-center">
                <button class="btn btn-danger-outline btn-reorder-item" 
                        data-sku="${escapeHtml(item.sku)}" 
                        data-name="${escapeHtml(item.name)}" 
                        title="Reorder ${escapeHtml(item.name)}">
                    <i class="fa-solid fa-cart-plus"></i> Reorder
                </button>
            </td>
        `;

        const reorderBtn = tr.querySelector('.btn-reorder-item');
        if (reorderBtn) {
            reorderBtn.addEventListener('click', () => {
                showNotification(`Reorder request initiated for ${item.name} (${item.sku})`, 'success', 3500);
            });
        }

        tbody.appendChild(tr);
    });
}

function renderMovementsTable(movements) {
    const tbody = document.getElementById('movements-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (movements.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-table-row">
                    <div class="empty-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
                    <p>No recent movements found for this type.</p>
                </td>
            </tr>
        `;
        return;
    }

    movements.forEach(m => {
        const badgeClass = getMovementBadgeClass(m.type || 'Transfer');
        const timestamp = m.timestamp || (m.createdAt ? m.createdAt.slice(0, 16).replace('T', ' ') : m.date) || 'Recent';
        const route = m.route || m.warehouse || (m.source && m.destination ? `${m.source} → ${m.destination}` : 'Warehouse');
        const quantityVal = m.quantityDisplay !== undefined ? m.quantityDisplay : m.quantity;
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>
                <strong class="sku-badge">${escapeHtml(m.id)}</strong>
            </td>
            <td>
                <span class="product-cat-txt">${escapeHtml(timestamp)}</span>
            </td>
            <td>
                <span class="product-name-txt">${escapeHtml(m.productName)}</span>
            </td>
            <td>
                <span class="badge ${badgeClass}">${escapeHtml(m.type)}</span>
            </td>
            <td class="text-right">
                <span class="qty-val ${m.type === 'Delivery' ? 'text-danger' : 'text-success'}">${escapeHtml(String(quantityVal))}</span>
            </td>
            <td>
                <span class="warehouse-tag">
                    <i class="fa-solid fa-route"></i>
                    ${escapeHtml(route)}
                </span>
            </td>
            <td>
                <span class="product-cat-txt">${escapeHtml(m.user || 'Alex Morgan')}</span>
            </td>
            <td class="text-center">
                <button class="icon-btn-subtle btn-view-slip" data-id="${escapeHtml(m.id)}" title="View Movement Slip">
                    <i class="fa-regular fa-file-lines"></i>
                </button>
            </td>
        `;

        const viewBtn = tr.querySelector('.btn-view-slip');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                showNotification(`Movement slip details for ${m.id} loaded.`, 'info');
            });
        }

        tbody.appendChild(tr);
    });
}

function getMovementBadgeClass(type) {
    switch (type.toLowerCase()) {
        case 'receipt': return 'badge-type-receipt';
        case 'delivery': return 'badge-type-delivery';
        case 'transfer': return 'badge-type-transfer';
        case 'adjustment': return 'badge-type-adjustment';
        default: return 'badge-type-receipt';
    }
}

function setupDashboardSearchFilter() {
    const searchInput = document.getElementById('global-search');
    const clearBtn = document.getElementById('clear-search');
    const filterBanner = document.getElementById('filter-banner');
    const filterQueryText = document.getElementById('filter-query-text');
    const resetFilterBtn = document.getElementById('reset-filter-btn');

    if (!searchInput) return;

    const performFilter = () => {
        const query = searchInput.value.trim().toLowerCase();

        if (clearBtn) {
            clearBtn.style.display = query.length > 0 ? 'block' : 'none';
        }

        if (query.length === 0) {
            if (filterBanner) filterBanner.style.display = 'none';
            renderLowStockTable(lowStockProducts);
            renderMovementsTable(stockMovements);
            return;
        }

        if (filterBanner && filterQueryText) {
            filterBanner.style.display = 'flex';
            filterQueryText.textContent = `"${searchInput.value.trim()}"`;
        }

        const filteredProducts = lowStockProducts.filter(item => {
            return item.name.toLowerCase().includes(query) ||
                   item.sku.toLowerCase().includes(query) ||
                   item.warehouse.toLowerCase().includes(query) ||
                   item.category.toLowerCase().includes(query);
        });

        const filteredMovements = stockMovements.filter(m => {
            return m.productName.toLowerCase().includes(query) ||
                   m.id.toLowerCase().includes(query) ||
                   m.route.toLowerCase().includes(query);
        });

        renderLowStockTable(filteredProducts);
        renderMovementsTable(filteredMovements);
    };

    searchInput.addEventListener('input', performFilter);

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            performFilter();
            searchInput.focus();
        });
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            searchInput.value = '';
            performFilter();
        });
    }
}

function setupMovementTypeFilters() {
    const pills = document.querySelectorAll('#movement-type-filters .filter-pill');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const type = pill.getAttribute('data-type');
            if (type === 'ALL') {
                renderMovementsTable(stockMovements);
            } else {
                const filtered = stockMovements.filter(m => m.type.toLowerCase() === type.toLowerCase());
                renderMovementsTable(filtered);
            }
        });
    });
}

function setupDropdowns() {
    const notifBtn = document.getElementById('notification-btn');
    const notifMenu = document.getElementById('notification-dropdown');
    const profileBtn = document.getElementById('profile-dropdown-btn');
    const profileMenu = document.getElementById('profile-dropdown');

    const toggleMenu = (menu) => {
        const isShown = menu.classList.contains('show');
        closeAllDropdowns();
        if (!isShown) menu.classList.add('show');
    };

    const closeAllDropdowns = () => {
        if (notifMenu) notifMenu.classList.remove('show');
        if (profileMenu) profileMenu.classList.remove('show');
    };

    if (notifBtn && notifMenu) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(notifMenu);
        });
    }

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(profileMenu);
        });
    }

    document.addEventListener('click', closeAllDropdowns);
    if (notifMenu) notifMenu.addEventListener('click', (e) => e.stopPropagation());
    if (profileMenu) profileMenu.addEventListener('click', (e) => e.stopPropagation());
}

function setupActionButtons() {
    const btnReorderAll = document.getElementById('btn-reorder-all');
    if (btnReorderAll) {
        btnReorderAll.addEventListener('click', () => {
            showNotification(`Generating purchase orders for all low stock items...`, 'success', 3500);
        });
    }

    const btnExport = document.getElementById('btn-export-low-stock');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            showNotification('Exporting low stock items to CSV spreadsheet...', 'info', 3000);
        });
    }

    const btnRefreshWarehouses = document.getElementById('btn-refresh-warehouses');
    if (btnRefreshWarehouses) {
        btnRefreshWarehouses.addEventListener('click', () => {
            btnRefreshWarehouses.classList.add('fa-spin');
            setTimeout(() => {
                btnRefreshWarehouses.classList.remove('fa-spin');
                showNotification('Warehouse capacities refreshed.', 'success', 2500);
            }, 600);
        });
    }

    const btnManageWarehouses = document.getElementById('btn-manage-warehouses');
    if (btnManageWarehouses) {
        btnManageWarehouses.addEventListener('click', () => {
            navigateTo('Warehouses');
        });
    }

    const markReadBtn = document.getElementById('mark-notifications-read');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', () => {
            const badge = document.querySelector('.notification-badge');
            if (badge) badge.style.display = 'none';
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            showNotification('All notifications marked as read', 'info');
        });
    }

    const sidebarLogout = document.getElementById('sidebar-logout-btn');
    const profileLogout = document.getElementById('profile-logout-btn');
    [sidebarLogout, profileLogout].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                showNotification('Session locked. Logging out...', 'warning', 3000);
            });
        }
    });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showNotification(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';
    if (type === 'danger') iconClass = 'fa-solid fa-circle-xmark';

    toast.innerHTML = `
        <i class="${iconClass} toast-icon"></i>
        <div class="toast-message">${escapeHtml(message)}</div>
        <button class="toast-close" aria-label="Close notification">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    const closeToast = () => {
        toast.classList.add('toast-hide');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 250);
    };

    toast.querySelector('.toast-close').addEventListener('click', closeToast);
    const timeoutId = setTimeout(closeToast, duration);
    toast.addEventListener('mouseenter', () => clearTimeout(timeoutId));
    toast.addEventListener('mouseleave', () => setTimeout(closeToast, 1500));

    container.appendChild(toast);
}

/* ==========================================================================
   Utilities
   ========================================================================== */
function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================================================
   Reusable View Renderers
   ========================================================================== */
function renderDashboard() {
    renderLowStockTableFromProducts();
    renderMovementsTable(stockMovements);
    updateDashboardStats();
}

function renderProducts() {
    renderProductsTable(getFilteredProducts());
    updateProductsMetrics();
}

function renderReceipts() {
    populateReceiveProductDropdown();
    renderReceiptsTable(getFilteredReceipts());
    updateReceiveSummary();
    updateReceiptsMetrics();
}

function renderDeliveries() {
    populateDeliveryProductDropdown();
    renderDeliveriesTable(getFilteredDeliveries());
    updateDeliverySummary();
    updateDeliveriesMetrics();
}

function renderTransfers() {
    populateTransferDropdowns();
    renderTransfersTable(getFilteredTransfers());
    updateTransferSummary();
    updateTransfersMetrics();
}

function renderAdjustments() {
    populateAdjustmentDropdowns();
    renderAdjustmentsTable(getFilteredAdjustments());
    updateRecordedQuantity();
    updateAdjustmentSummary();
    updateAdjustmentsMetrics();
}

function renderMovementHistory() {
    populateHistoryProductDropdown();
    applyMovementFilters();
}

/* ==========================================================================
   Movement History Ledger Module
   ========================================================================== */
let movementSortState = {
    column: 'date',
    direction: 'desc'
};

// In production: Replace with fetch('/api/movements') or Firestore collection query
function getAllMovements() {
    if (stockMovements && stockMovements.length > 0 && stockMovements[0].destination !== undefined) {
        return stockMovements;
    }

    const list = [];

    // Map receiptsData
    receiptsData.forEach(r => {
        list.push(normalizeMovementRecord(r, 'Receipt'));
    });

    // Map deliveriesData
    deliveriesData.forEach(d => {
        list.push(normalizeMovementRecord(d, 'Delivery'));
    });

    // Map transfersData
    transfersData.forEach(t => {
        list.push(normalizeMovementRecord(t, 'Transfer'));
    });

    // Map adjustmentsData
    adjustmentsData.forEach(a => {
        list.push(normalizeMovementRecord(a, 'Adjustment'));
    });

    return list;
}

function normalizeMovementRecord(record, type) {
    if (type === 'Receipt') {
        return {
            id: record.id,
            type: 'Receipt',
            productId: record.productId,
            productName: record.productName,
            sku: record.productSku || 'SKU-REC',
            source: record.supplier || 'Supplier Inbound',
            destination: record.warehouse || 'Main Warehouse',
            warehouse: record.warehouse || 'Main Warehouse',
            quantityDisplay: `+${record.quantity} ${record.unit || 'pcs'}`,
            rawQuantity: record.quantity,
            reference: record.notes || 'Purchase Order Inbound',
            date: record.date,
            user: 'Alex Morgan',
            status: record.status || 'Completed'
        };
    } else if (type === 'Delivery') {
        return {
            id: record.id,
            type: 'Delivery',
            productId: record.productId,
            productName: record.productName,
            sku: record.productSku || 'SKU-DEL',
            source: record.warehouse || 'Main Warehouse',
            destination: record.customer || 'Customer Dispatch',
            warehouse: record.warehouse || 'Main Warehouse',
            quantityDisplay: `-${record.quantity} ${record.unit || 'pcs'}`,
            rawQuantity: -record.quantity,
            reference: record.orderRef || 'Sales Order Dispatch',
            date: record.date,
            user: 'Marcus Reed',
            status: record.status || 'Completed'
        };
    } else if (type === 'Transfer') {
        return {
            id: record.id,
            type: 'Transfer',
            productId: record.productId,
            productName: record.productName,
            sku: record.productSku || 'SKU-TRF',
            source: record.sourceWarehouse || 'Main Warehouse',
            destination: record.destWarehouse || 'Production Floor',
            warehouse: `${record.sourceWarehouse} → ${record.destWarehouse}`,
            quantityDisplay: `${record.quantity} ${record.unit || 'pcs'}`,
            rawQuantity: record.quantity,
            reference: record.reference || 'Stock Rebalance',
            date: record.date,
            user: 'Devon Clark',
            status: record.status || 'Completed'
        };
    } else if (type === 'Adjustment') {
        const sign = record.difference > 0 ? '+' : '';
        return {
            id: record.id,
            type: 'Adjustment',
            productId: record.productId,
            productName: record.productName,
            sku: record.productSku || 'SKU-ADJ',
            source: `System: ${record.recordedQty}`,
            destination: `Physical: ${record.countedQty}`,
            warehouse: record.warehouse || 'Main Warehouse',
            quantityDisplay: `${sign}${record.difference} units`,
            rawQuantity: record.difference,
            reference: record.reason || 'Cycle Audit Discrepancy',
            date: record.date,
            user: 'Alex Morgan',
            status: record.status || 'Completed'
        };
    }
}

function sortMovements(movements, column, direction) {
    return [...movements].sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        if (column === 'quantity') {
            valA = Math.abs(a.rawQuantity);
            valB = Math.abs(b.rawQuantity);
        } else if (column === 'date') {
            valA = new Date(a.date).getTime() || 0;
            valB = new Date(b.date).getTime() || 0;
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

function populateHistoryProductDropdown() {
    const select = document.getElementById('history-product-filter');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="ALL">All Products</option>';

    productsData.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.name} (${p.sku})`;
        select.appendChild(opt);
    });

    if (currentVal) select.value = currentVal;
}

function applyMovementFilters() {
    let list = getAllMovements();

    const searchInput = document.getElementById('history-search-input');
    const typeFilter = document.getElementById('history-type-filter');
    const productFilter = document.getElementById('history-product-filter');
    const warehouseFilter = document.getElementById('history-warehouse-filter');
    const statusFilter = document.getElementById('history-status-filter');
    const dateFilter = document.getElementById('history-date-filter');
    const clearSearchBtn = document.getElementById('history-search-clear');

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (clearSearchBtn) {
        clearSearchBtn.style.display = query ? 'block' : 'none';
    }

    if (query) {
        list = list.filter(m => 
            (m.productName && m.productName.toLowerCase().includes(query)) ||
            (m.sku && m.sku.toLowerCase().includes(query)) ||
            (m.id && m.id.toLowerCase().includes(query)) ||
            (m.reference && m.reference.toLowerCase().includes(query))
        );
    }

    const selType = typeFilter ? typeFilter.value : 'ALL';
    if (selType && selType !== 'ALL') {
        list = list.filter(m => m.type.toLowerCase() === selType.toLowerCase());
    }

    const selProduct = productFilter ? productFilter.value : 'ALL';
    if (selProduct && selProduct !== 'ALL') {
        list = list.filter(m => String(m.productId) === String(selProduct));
    }

    const selWarehouse = warehouseFilter ? warehouseFilter.value : 'ALL';
    if (selWarehouse && selWarehouse !== 'ALL') {
        list = list.filter(m => 
            (m.warehouse && m.warehouse.toLowerCase().includes(selWarehouse.toLowerCase())) ||
            (m.source && m.source.toLowerCase().includes(selWarehouse.toLowerCase())) ||
            (m.destination && m.destination.toLowerCase().includes(selWarehouse.toLowerCase()))
        );
    }

    const selStatus = statusFilter ? statusFilter.value : 'ALL';
    if (selStatus && selStatus !== 'ALL') {
        list = list.filter(m => m.status.toLowerCase() === selStatus.toLowerCase());
    }

    const selDate = dateFilter ? dateFilter.value : '';
    if (selDate) {
        list = list.filter(m => m.date === selDate);
    }

    // Apply sorting
    list = sortMovements(list, movementSortState.column, movementSortState.direction);

    // Update 5 summary cards
    updateMovementSummary(list);

    // Render table rows
    renderMovementTable(list);
}

function updateMovementSummary(movements) {
    const elTotal = document.getElementById('history-stat-total');
    const elReceipts = document.getElementById('history-stat-receipts');
    const elDeliveries = document.getElementById('history-stat-deliveries');
    const elTransfers = document.getElementById('history-stat-transfers');
    const elAdjustments = document.getElementById('history-stat-adjustments');

    let total = movements.length;
    let receipts = 0;
    let deliveries = 0;
    let transfers = 0;
    let adjustments = 0;

    movements.forEach(m => {
        if (m.type === 'Receipt') receipts++;
        else if (m.type === 'Delivery') deliveries++;
        else if (m.type === 'Transfer') transfers++;
        else if (m.type === 'Adjustment') adjustments++;
    });

    if (elTotal) elTotal.textContent = total;
    if (elReceipts) elReceipts.textContent = receipts;
    if (elDeliveries) elDeliveries.textContent = deliveries;
    if (elTransfers) elTransfers.textContent = transfers;
    if (elAdjustments) elAdjustments.textContent = adjustments;
}

function renderMovementTable(movements) {
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;

    if (!movements || movements.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="13" class="empty-table-row">
                    <div class="empty-icon"><i class="fa-solid fa-folder-open"></i></div>
                    <p>No inventory movements found matching your criteria.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = movements.map(m => {
        const typeClass = `badge-type-${m.type.toLowerCase()}`;
        let statusClass = 'badge-status-completed';
        if (m.status === 'Draft' || m.status === 'Pending') statusClass = 'badge-status-draft';
        else if (m.status === 'In Transit') statusClass = 'badge-status-in-transit';
        else if (m.status === 'Packed') statusClass = 'badge-status-packed';
        else if (m.status === 'Reviewed') statusClass = 'badge-status-reviewed';

        const qtyColor = m.type === 'Receipt' ? 'text-success font-weight-bold' : (m.type === 'Delivery' ? 'text-danger font-weight-bold' : 'font-weight-bold');

        return `
            <tr>
                <td><strong>${escapeHtml(m.id)}</strong></td>
                <td><span class="badge ${typeClass}">${escapeHtml(m.type)}</span></td>
                <td><strong>${escapeHtml(m.productName)}</strong></td>
                <td><span class="sku-code">${escapeHtml(m.sku)}</span></td>
                <td>${escapeHtml(m.source)}</td>
                <td>${escapeHtml(m.destination)}</td>
                <td>${escapeHtml(m.warehouse)}</td>
                <td class="text-right ${qtyColor}">${escapeHtml(m.quantityDisplay)}</td>
                <td>${escapeHtml(m.reference)}</td>
                <td>${escapeHtml(m.date)}</td>
                <td>${escapeHtml(m.user)}</td>
                <td class="text-center"><span class="badge ${statusClass}">${escapeHtml(m.status)}</span></td>
                <td class="text-center">
                    <button type="button" class="btn-action" onclick="viewMovementDetails('${escapeHtml(m.id)}')" title="View Movement Slip">
                        <i class="fa-solid fa-receipt"></i> Slip
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewMovementDetails(id) {
    const all = getAllMovements();
    const item = all.find(m => m.id === id);
    if (!item) {
        showToast(`Movement ${id} recorded in stock ledger.`, 'info');
        return;
    }
    showToast(`Ledger Slip ${item.id}: ${item.type} of ${item.quantityDisplay} (${item.productName})`, 'info', 4000);
}

function setupMovementHistoryInteractions() {
    const searchInput = document.getElementById('history-search-input');
    const clearSearchBtn = document.getElementById('history-search-clear');
    const typeFilter = document.getElementById('history-type-filter');
    const productFilter = document.getElementById('history-product-filter');
    const warehouseFilter = document.getElementById('history-warehouse-filter');
    const statusFilter = document.getElementById('history-status-filter');
    const dateFilter = document.getElementById('history-date-filter');
    const btnExport = document.getElementById('btn-export-movements');
    const btnClearFilters = document.getElementById('btn-clear-movement-filters');
    const thSortDate = document.getElementById('th-sort-date');
    const thSortQty = document.getElementById('th-sort-quantity');

    if (searchInput) searchInput.addEventListener('input', applyMovementFilters);
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            applyMovementFilters();
            searchInput.focus();
        });
    }

    [typeFilter, productFilter, warehouseFilter, statusFilter, dateFilter].forEach(el => {
        if (el) el.addEventListener('change', applyMovementFilters);
    });

    if (thSortDate) {
        thSortDate.addEventListener('click', () => {
            if (movementSortState.column === 'date') {
                movementSortState.direction = movementSortState.direction === 'asc' ? 'desc' : 'asc';
            } else {
                movementSortState.column = 'date';
                movementSortState.direction = 'desc';
            }

            // Update UI icon
            const icon = document.getElementById('icon-sort-date');
            if (icon) {
                icon.className = movementSortState.direction === 'asc' ? 'fa-solid fa-sort-up sort-icon' : 'fa-solid fa-sort-down sort-icon';
            }
            if (thSortQty) thSortQty.classList.remove('active-sort');
            thSortDate.classList.add('active-sort');

            applyMovementFilters();
        });
    }

    if (thSortQty) {
        thSortQty.addEventListener('click', () => {
            if (movementSortState.column === 'quantity') {
                movementSortState.direction = movementSortState.direction === 'asc' ? 'desc' : 'asc';
            } else {
                movementSortState.column = 'quantity';
                movementSortState.direction = 'desc';
            }

            const icon = document.getElementById('icon-sort-quantity');
            if (icon) {
                icon.className = movementSortState.direction === 'asc' ? 'fa-solid fa-sort-up sort-icon' : 'fa-solid fa-sort-down sort-icon';
            }
            if (thSortDate) thSortDate.classList.remove('active-sort');
            thSortQty.classList.add('active-sort');

            applyMovementFilters();
        });
    }

    if (btnExport) {
        btnExport.addEventListener('click', () => {
            showToast('Export feature coming soon', 'info', 3000);
        });
    }

    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (typeFilter) typeFilter.value = 'ALL';
            if (productFilter) productFilter.value = 'ALL';
            if (warehouseFilter) warehouseFilter.value = 'ALL';
            if (statusFilter) statusFilter.value = 'ALL';
            if (dateFilter) dateFilter.value = '';
            applyMovementFilters();
            showToast('Filters cleared.', 'info', 2000);
        });
    }
}

/* ==========================================================================
   Warehouses Management Module
   ========================================================================== */
// In production: Replace with fetch('/api/warehouses') or Firestore collection query
function renderWarehouses() {
    let mainUnits = 0;
    let prodUnits = 0;
    let mainSkus = 0;
    let prodSkus = 0;

    productsData.forEach(p => {
        const m = p.mainWarehouseStock || 0;
        const pr = p.productionFloorStock || 0;
        mainUnits += m;
        prodUnits += pr;
        if (m > 0) mainSkus++;
        if (pr > 0) prodSkus++;
    });

    const totalStored = mainUnits + prodUnits;
    const mainCapacity = 10000;
    const prodCapacity = 3000;

    const mainPercent = Math.min(100, Math.round((mainUnits / mainCapacity) * 100));
    const prodPercent = Math.min(100, Math.round((prodUnits / prodCapacity) * 100));

    // Update Overview Cards
    const elWhStored = document.getElementById('wh-total-stored');
    const elWhMainLoad = document.getElementById('wh-main-load-stat');
    const elWhProdLoad = document.getElementById('wh-prod-load-stat');

    if (elWhStored) elWhStored.textContent = `${totalStored.toLocaleString()} units`;
    if (elWhMainLoad) elWhMainLoad.textContent = `${mainPercent}%`;
    if (elWhProdLoad) elWhProdLoad.textContent = `${prodPercent}%`;

    // Update Main Warehouse Card
    const elCardMainUnits = document.getElementById('wh-card-main-units');
    const elCardMainSkus = document.getElementById('wh-card-main-skus');
    const elCardMainPercent = document.getElementById('wh-card-main-percent');
    const elCardMainBar = document.getElementById('wh-card-main-bar');
    const elCardMainUsed = document.getElementById('wh-card-main-used-desc');
    const elCardMainAvail = document.getElementById('wh-card-main-avail-desc');

    if (elCardMainUnits) elCardMainUnits.textContent = `${mainUnits.toLocaleString()} units`;
    if (elCardMainSkus) elCardMainSkus.textContent = `${mainSkus} items`;
    if (elCardMainPercent) elCardMainPercent.textContent = `${mainPercent}%`;
    if (elCardMainBar) elCardMainBar.style.width = `${mainPercent}%`;
    if (elCardMainUsed) elCardMainUsed.textContent = `${mainUnits.toLocaleString()} units stored`;
    if (elCardMainAvail) elCardMainAvail.textContent = `${Math.max(0, mainCapacity - mainUnits).toLocaleString()} available`;

    // Update Production Floor Card
    const elCardProdUnits = document.getElementById('wh-card-prod-units');
    const elCardProdSkus = document.getElementById('wh-card-prod-skus');
    const elCardProdPercent = document.getElementById('wh-card-prod-percent');
    const elCardProdBar = document.getElementById('wh-card-prod-bar');
    const elCardProdUsed = document.getElementById('wh-card-prod-used-desc');
    const elCardProdAvail = document.getElementById('wh-card-prod-avail-desc');

    if (elCardProdUnits) elCardProdUnits.textContent = `${prodUnits.toLocaleString()} units`;
    if (elCardProdSkus) elCardProdSkus.textContent = `${prodSkus} items`;
    if (elCardProdPercent) elCardProdPercent.textContent = `${prodPercent}%`;
    if (elCardProdBar) elCardProdBar.style.width = `${prodPercent}%`;
    if (elCardProdUsed) elCardProdUsed.textContent = `${prodUnits.toLocaleString()} units stored`;
    if (elCardProdAvail) elCardProdAvail.textContent = `${Math.max(0, prodCapacity - prodUnits).toLocaleString()} available`;

    // Render Distribution Table
    const tbody = document.getElementById('wh-distribution-tbody');
    if (!tbody) return;

    tbody.innerHTML = productsData.map(p => {
        const m = p.mainWarehouseStock || 0;
        const pr = p.productionFloorStock || 0;
        const total = m + pr;
        const mPct = total > 0 ? Math.round((m / total) * 100) : 0;
        const prPct = total > 0 ? (100 - mPct) : 0;
        const status = computeProductStatus(total, p.reorderLevel);
        const statusBadgeClass = getProductStatusBadgeClass(status);

        return `
            <tr>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td><span class="sku-code">${escapeHtml(p.sku)}</span></td>
                <td>${escapeHtml(p.category)}</td>
                <td class="text-right"><strong>${m}</strong> ${escapeHtml(p.unit)}</td>
                <td class="text-right"><strong>${pr}</strong> ${escapeHtml(p.unit)}</td>
                <td class="text-right font-weight-bold">${total} ${escapeHtml(p.unit)}</td>
                <td>
                    <div class="dist-ratio-wrapper">
                        <div class="dist-bar-track">
                            <div class="dist-bar-main" style="width: ${mPct}%;" title="Main Warehouse: ${mPct}%"></div>
                            <div class="dist-bar-prod" style="width: ${prPct}%;" title="Production Floor: ${prPct}%"></div>
                        </div>
                        <div class="dist-labels">
                            <span>Main: ${mPct}%</span>
                            <span>Prod: ${prPct}%</span>
                        </div>
                    </div>
                </td>
                <td class="text-center"><span class="badge ${statusBadgeClass}">${status}</span></td>
                <td class="text-center">
                    <button type="button" class="btn-action" onclick="quickTransferProduct(${p.id})" title="Transfer this product">
                        <i class="fa-solid fa-right-left"></i> Transfer
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function quickTransferProduct(productId) {
    navigateTo('Transfers');
    const select = document.getElementById('transfer-product');
    if (select) {
        select.value = productId;
        updateTransferSummary();
    }
}

function setupWarehousesInteractions() {
    const btnReceive = document.getElementById('btn-wh-goto-receive');
    if (btnReceive) btnReceive.addEventListener('click', () => navigateTo('Receive Stock'));

    const btnTransfer = document.getElementById('btn-wh-goto-transfer');
    if (btnTransfer) btnTransfer.addEventListener('click', () => navigateTo('Transfers'));

    const btnAdjust = document.getElementById('btn-wh-goto-adjust');
    if (btnAdjust) btnAdjust.addEventListener('click', () => navigateTo('Stock Adjustments'));

    const btnTransferIn = document.getElementById('btn-wh-goto-transfer-in');
    if (btnTransferIn) btnTransferIn.addEventListener('click', () => navigateTo('Transfers'));

    const btnAdjustProd = document.getElementById('btn-wh-goto-adjust-prod');
    if (btnAdjustProd) btnAdjustProd.addEventListener('click', () => navigateTo('Stock Adjustments'));

    const btnExport = document.getElementById('btn-export-wh-stock');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            showToast('Warehouse stock summary exported to CSV', 'success');
        });
    }
}

/* ==========================================================================
   Settings & Preferences Module
   ========================================================================== */
function renderSettings() {
    // Keep settings forms synchronized with runtime preferences
}

function setupSettingsInteractions() {
    const formBusiness = document.getElementById('form-settings-business');
    if (formBusiness) {
        formBusiness.addEventListener('submit', (e) => {
            e.preventDefault();
            // In production: Replace with fetch('/api/settings/business', { method: 'POST', body: ... })
            showToast('Business & facility profile updated successfully!', 'success');
        });
    }

    const formAlerts = document.getElementById('form-settings-alerts');
    if (formAlerts) {
        formAlerts.addEventListener('submit', (e) => {
            e.preventDefault();
            // In production: Replace with fetch('/api/settings/alerts', { method: 'POST', body: ... })
            showToast('Safety stock and reorder alert rules saved!', 'success');
        });
    }

    const formNotifs = document.getElementById('form-settings-notifications');
    if (formNotifs) {
        formNotifs.addEventListener('submit', (e) => {
            e.preventDefault();
            // In production: Replace with fetch('/api/settings/notifications', { method: 'POST', body: ... })
            showToast('Notification alert preferences updated!', 'success');
        });
    }

    const formProfile = document.getElementById('form-settings-profile');
    if (formProfile) {
        formProfile.addEventListener('submit', (e) => {
            e.preventDefault();
            // In production: Replace with fetch('/api/user/profile', { method: 'PUT', body: ... })
            const nameInput = document.getElementById('profile-full-name');
            if (nameInput && nameInput.value.trim()) {
                const name = nameInput.value.trim();
                document.querySelectorAll('.profile-name, .header-user-name, .user-name').forEach(el => el.textContent = name);
            }
            showToast('Operator profile credentials updated!', 'success');
        });
    }

    const btnAvatar = document.getElementById('btn-change-avatar');
    if (btnAvatar) {
        btnAvatar.addEventListener('click', () => {
            showToast('Profile image upload is ready for backend cloud storage.', 'info');
        });
    }
}

/* ==========================================================================
   Theme & Dark Mode Module
   ========================================================================== */
function setupTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-toggle-icon');
    const radioLight = document.getElementById('theme-radio-light');
    const radioDark = document.getElementById('theme-radio-dark');

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            if (radioDark) radioDark.checked = true;
        } else {
            document.body.classList.remove('dark-theme');
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            if (radioLight) radioLight.checked = true;
        }
        localStorage.setItem('stocksense_theme', theme);
    };

    const savedTheme = localStorage.getItem('stocksense_theme') || 'light';
    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} theme`, 'info', 2000);
        });
    }

    const formTheme = document.getElementById('form-settings-theme');
    if (formTheme) {
        formTheme.addEventListener('submit', (e) => {
            e.preventDefault();
            const selected = document.querySelector('input[name="ui_theme"]:checked');
            if (selected) {
                applyTheme(selected.value);
            }
            const compact = document.getElementById('pref-compact-tables');
            if (compact && compact.checked) {
                document.querySelectorAll('.data-table').forEach(tbl => tbl.classList.add('compact-table'));
            } else {
                document.querySelectorAll('.data-table').forEach(tbl => tbl.classList.remove('compact-table'));
            }
            showToast('Theme and interface preferences applied successfully!', 'success');
        });
    }
}

/* ==========================================================================
   Toast Notification System (showToast alias)
   ========================================================================== */
function showToast(message, type = 'info', duration = 3500) {
    showNotification(message, type, duration);
}

