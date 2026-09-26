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

// Sample Warehouses Dataset
// In production: Replace with fetch('/api/warehouses') later
const warehousesData = [
    "Main Warehouse",
    "Production Floor"
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
   Application Initialization
   ========================================================================== */
function initApp() {
    // Render initial views and tables
    renderLowStockTable(lowStockProducts);
    renderMovementsTable(stockMovements);
    renderProductsTable(productsData);
    renderReceiptsTable(receiptsData);
    renderDeliveriesTable(deliveriesData);

    updateProductsMetrics();
    updateReceiptsMetrics();
    updateDeliveriesMetrics();

    // Populate dynamic form elements
    populateReceiveProductDropdown();
    populateDeliveryProductDropdown();
    setDefaultReceiptDate();
    setDefaultDeliveryDate();

    updateReceiveSummary();
    updateDeliverySummary();

    // Setup navigation and event listeners
    setupSidebar();
    setupNavigation();
    setupDashboardSearchFilter();
    setupProductsViewInteractions();
    setupReceiveStockInteractions();
    setupDeliveryOrdersInteractions();
    setupMovementTypeFilters();
    setupDropdowns();
    setupModals();
    setupForms();
    setupActionButtons();
}

/* ==========================================================================
   Navigation & Page View Routing
   ========================================================================== */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const dashboardView = document.getElementById('view-dashboard');
    const productsView = document.getElementById('view-products');
    const receiptsView = document.getElementById('view-receipts');
    const deliveriesView = document.getElementById('view-deliveries');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            const viewName = link.getAttribute('data-view') || 'Dashboard';

            // Hide all views first
            if (dashboardView) dashboardView.style.display = 'none';
            if (productsView) productsView.style.display = 'none';
            if (receiptsView) receiptsView.style.display = 'none';
            if (deliveriesView) deliveriesView.style.display = 'none';

            // Switch view
            if (viewName === 'Dashboard') {
                if (dashboardView) dashboardView.style.display = 'flex';
                if (pageTitle) pageTitle.textContent = 'Inventory Overview';
                if (pageSubtitle) pageSubtitle.textContent = 'Real-time status across all fulfillment hubs';
            } else if (viewName === 'Products') {
                if (productsView) productsView.style.display = 'flex';
                if (pageTitle) pageTitle.textContent = 'Products';
                if (pageSubtitle) pageSubtitle.textContent = 'Manage inventory catalog, multi-warehouse stock, and reorder levels';
                renderProductsTable(getFilteredProducts());
                updateProductsMetrics();
            } else if (viewName === 'Receive Stock' || viewName === 'Receipts') {
                if (receiptsView) receiptsView.style.display = 'flex';
                if (pageTitle) pageTitle.textContent = 'Receive Stock';
                if (pageSubtitle) pageSubtitle.textContent = 'Register inbound supplier shipments and allocate into warehouse storage bins';
                populateReceiveProductDropdown();
                renderReceiptsTable(getFilteredReceipts());
                updateReceiveSummary();
                updateReceiptsMetrics();
            } else if (viewName === 'Delivery Orders' || viewName === 'Deliveries') {
                if (deliveriesView) deliveriesView.style.display = 'flex';
                if (pageTitle) pageTitle.textContent = 'Delivery Orders';
                if (pageSubtitle) pageSubtitle.textContent = 'Dispatch outgoing customer shipments and verify warehouse stock availability';
                populateDeliveryProductDropdown();
                renderDeliveriesTable(getFilteredDeliveries());
                updateDeliverySummary();
                updateDeliveriesMetrics();
            } else {
                if (pageTitle) pageTitle.textContent = viewName;
                if (pageSubtitle) pageSubtitle.textContent = `Management portal for ${viewName}`;
                showNotification(`${viewName} module is ready for backend integration`, 'info', 2500);
            }

            // Close mobile sidebar drawer if open
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
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
function handleDeliveryOrderSubmit(e) {
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

    const productId = Number(productSelect.value);
    const product = productsData.find(p => p.id === productId);
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

    // Construct new Delivery object
    const newDelivery = {
        id: `DEL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: customer,
        orderRef: orderRef,
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        warehouse: warehouse,
        quantity: quantity,
        unit: product.unit,
        date: deliveryDate,
        notes: notesInput ? notesInput.value.trim() : '',
        status: status
    };

    // Deduct stock from selected warehouse if Completed
    // In production: Replace with fetch('/api/deliveries', { method: 'POST', body: JSON.stringify(newDelivery) }) later
    if (status === 'Completed') {
        if (warehouse === 'Main Warehouse') {
            product.mainWarehouseStock -= quantity;
        } else if (warehouse === 'Production Floor') {
            product.productionFloorStock -= quantity;
        }

        // Add to recent stock movements log
        // In production: Replace with fetch('/api/movements', { method: 'POST', body: ... }) later
        stockMovements.unshift({
            id: newDelivery.id,
            timestamp: 'Just now',
            productName: product.name,
            type: 'Delivery',
            quantity: `-${quantity}`,
            route: `${warehouse} → ${customer}`,
            user: 'Alex Morgan'
        });

        // Update dashboard metrics
        updateDashboardMetrics(-quantity);
    }

    // Add delivery to data array
    deliveriesData.unshift(newDelivery);

    // Refresh UI across all views
    renderDeliveriesTable(getFilteredDeliveries());
    renderProductsTable(getFilteredProducts());
    renderMovementsTable(stockMovements);
    updateProductsMetrics();
    updateDeliveriesMetrics();
    updateDeliverySummary();
    updateReceiveSummary();

    // Clear item inputs for next delivery
    if (qtyInput) qtyInput.value = '';
    if (orderRefInput) orderRefInput.value = '';
    if (notesInput) notesInput.value = '';

    // Show temporary success toast
    showNotification('Delivery recorded successfully', 'success', 3500);
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

function handleReceiveStockSubmit(e) {
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

    const productId = Number(productSelect.value);
    const product = productsData.find(p => p.id === productId);
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

    const newReceipt = {
        id: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        supplier: supplier,
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        warehouse: warehouse,
        quantity: quantity,
        unit: product.unit,
        unitCost: unitCost,
        date: receiptDate,
        notes: notesInput ? notesInput.value.trim() : '',
        status: status
    };

    if (status === 'Completed') {
        if (warehouse === 'Main Warehouse') {
            product.mainWarehouseStock += quantity;
        } else if (warehouse === 'Production Floor') {
            product.productionFloorStock += quantity;
        }

        stockMovements.unshift({
            id: newReceipt.id,
            timestamp: 'Just now',
            productName: product.name,
            type: 'Receipt',
            quantity: `+${quantity}`,
            route: `${supplier} → ${warehouse}`,
            user: 'Alex Morgan'
        });

        updateDashboardMetrics(quantity);
    }

    receiptsData.unshift(newReceipt);

    renderReceiptsTable(getFilteredReceipts());
    renderProductsTable(getFilteredProducts());
    renderMovementsTable(stockMovements);
    updateProductsMetrics();
    updateReceiptsMetrics();
    updateReceiveSummary();
    updateDeliverySummary();

    if (qtyInput) qtyInput.value = '';
    if (costInput) costInput.value = '';
    if (notesInput) notesInput.value = '';

    showNotification('Stock received successfully', 'success', 3500);
}

function clearReceiveErrors() {
    const errorElements = document.querySelectorAll('[id^="err-receive-"]');
    errorElements.forEach(el => el.textContent = '');

    const inputs = document.querySelectorAll('#form-receive-stock .has-error');
    inputs.forEach(el => el.classList.remove('has-error'));

    const errorBox = document.getElementById('receive-form-error');
    if (errorBox) errorBox.style.display = 'none';
}

function updateDashboardMetrics(addedUnits = 0) {
    const elDashStockUnits = document.getElementById('dashboard-total-stock-units');
    const elDashMovements = document.getElementById('dashboard-movements-count');

    if (elDashStockUnits) {
        let currentTotal = parseInt(elDashStockUnits.textContent.replace(/,/g, ''), 10) || 12840;
        currentTotal += addedUnits;
        elDashStockUnits.textContent = currentTotal.toLocaleString();
    }

    if (elDashMovements) {
        let currentMov = parseInt(elDashMovements.textContent, 10) || 24;
        currentMov += 1;
        elDashMovements.textContent = currentMov;
    }
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

    if (addForm) addForm.addEventListener('submit', handleAddProductSubmit);
    if (editForm) editForm.addEventListener('submit', handleEditProductSubmit);
    if (receiveForm) receiveForm.addEventListener('submit', handleReceiveStockSubmit);
    if (deliveryForm) deliveryForm.addEventListener('submit', handleDeliveryOrderSubmit);
}

function handleAddProductSubmit(e) {
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
    } else {
        const isDuplicate = productsData.some(p => p.sku.toUpperCase() === sku);
        if (isDuplicate) {
            setFieldError('err-add-sku', skuInput, `SKU "${sku}" already exists in the catalog`);
            hasErrors = true;
        }
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

    const mainStock = warehouse === 'Main Warehouse' ? initialStock : 0;
    const prodStock = warehouse === 'Production Floor' ? initialStock : 0;

    const newProduct = {
        id: Date.now(),
        name: name,
        sku: sku,
        category: category,
        unit: unit,
        mainWarehouseStock: mainStock,
        productionFloorStock: prodStock,
        reorderLevel: reorderLevel
    };

    productsData.unshift(newProduct);
    renderProductsTable(getFilteredProducts());
    updateProductsMetrics();
    populateReceiveProductDropdown();
    populateDeliveryProductDropdown();
    closeModal('modal-add-product');
    resetAddForm();

    showNotification(`Product "${newProduct.name}" (${newProduct.sku}) added successfully!`, 'success', 3500);
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

function handleEditProductSubmit(e) {
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

    const productId = Number(idInput.value);
    const productIndex = productsData.findIndex(p => p.id === productId);

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

    productsData[productIndex] = {
        ...productsData[productIndex],
        name: name,
        sku: sku,
        category: category,
        unit: unit,
        reorderLevel: reorderLevel,
        mainWarehouseStock: mainStock,
        productionFloorStock: prodStock
    };

    renderProductsTable(getFilteredProducts());
    updateProductsMetrics();
    populateReceiveProductDropdown();
    populateDeliveryProductDropdown();
    updateReceiveSummary();
    updateDeliverySummary();
    closeModal('modal-edit-product');

    showNotification(`Product "${name}" (${sku}) updated successfully!`, 'success', 3500);
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

function executeProductDelete() {
    if (!productPendingDeleteId) return;

    const product = productsData.find(p => p.id === productPendingDeleteId);
    const productName = product ? product.name : 'Product';

    productsData = productsData.filter(p => p.id !== productPendingDeleteId);
    productPendingDeleteId = null;

    closeModal('modal-delete-confirm');
    renderProductsTable(getFilteredProducts());
    updateProductsMetrics();
    populateReceiveProductDropdown();
    populateDeliveryProductDropdown();
    updateReceiveSummary();
    updateDeliverySummary();

    showNotification(`Product "${productName}" has been removed from inventory.`, 'success', 3500);
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
                    ${escapeHtml(item.warehouse)}
                </span>
            </td>
            <td class="text-right">
                <span class="qty-danger">${item.currentQty}</span>
            </td>
            <td class="text-right">
                <span class="reorder-level-val">${item.reorderLevel}</span>
            </td>
            <td class="text-center">
                <span class="badge badge-reorder">${escapeHtml(item.status)}</span>
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
        const badgeClass = getMovementBadgeClass(m.type);
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>
                <strong class="sku-badge">${escapeHtml(m.id)}</strong>
            </td>
            <td>
                <span class="product-cat-txt">${escapeHtml(m.timestamp)}</span>
            </td>
            <td>
                <span class="product-name-txt">${escapeHtml(m.productName)}</span>
            </td>
            <td>
                <span class="badge ${badgeClass}">${escapeHtml(m.type)}</span>
            </td>
            <td class="text-right">
                <span class="qty-val ${m.type === 'Delivery' ? 'text-danger' : 'text-success'}">${escapeHtml(m.quantity)}</span>
            </td>
            <td>
                <span class="warehouse-tag">
                    <i class="fa-solid fa-route"></i>
                    ${escapeHtml(m.route)}
                </span>
            </td>
            <td>
                <span class="product-cat-txt">${escapeHtml(m.user)}</span>
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
            showNotification('Navigating to Warehouse Facilities manager...', 'info');
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
