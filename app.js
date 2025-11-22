// ===== Data Storage =====
class DataStore {
    constructor() {
        this.menuItems = this.loadMenuItems();
        this.bills = this.loadBills();
        this.initializeSampleData();
    }

    loadMenuItems() {
        const items = localStorage.getItem('menuItems');
        return items ? JSON.parse(items) : [];
    }

    saveMenuItems() {
        localStorage.setItem('menuItems', JSON.stringify(this.menuItems));
    }

    loadBills() {
        const bills = localStorage.getItem('bills');
        return bills ? JSON.parse(bills) : [];
    }

    saveBills() {
        localStorage.setItem('bills', JSON.stringify(this.bills));
    }

    initializeSampleData() {
        if (this.menuItems.length === 0) {
            this.menuItems = [
                // Biryani Items (Afternoon)
                {
                    id: Date.now() + 1,
                    name: 'Chicken Biryani',
                    price: 180,
                    category: 'Main Course',
                    image: 'sample-menu-images/chicken-biryani.png'
                },
                {
                    id: Date.now() + 2,
                    name: 'Mutton Biryani',
                    price: 220,
                    category: 'Main Course',
                    image: 'sample-menu-images/mutton-biryani.png'
                },
                {
                    id: Date.now() + 3,
                    name: 'Prawn Biryani',
                    price: 250,
                    category: 'Main Course',
                    image: 'https://images.unsplash.com/photo-1633945274309-2c8c2b0e5e0e?w=400&h=300&fit=crop'
                },
                {
                    id: Date.now() + 4,
                    name: 'Fish Biryani',
                    price: 200,
                    category: 'Main Course',
                    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop'
                },
                // Evening Items
                {
                    id: Date.now() + 5,
                    name: 'Mutton Soup',
                    price: 80,
                    category: 'Soups',
                    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'
                },
                {
                    id: Date.now() + 6,
                    name: 'Chicken Fried Rice',
                    price: 120,
                    category: 'Main Course',
                    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop'
                },
                {
                    id: Date.now() + 7,
                    name: 'Noodles',
                    price: 100,
                    category: 'Main Course',
                    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop'
                },
                {
                    id: Date.now() + 8,
                    name: 'Parota',
                    price: 30,
                    category: 'Breads',
                    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop'
                },
                // Egg Items
                {
                    id: Date.now() + 9,
                    name: 'Egg Omelette',
                    price: 40,
                    category: 'Egg Items',
                    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop'
                },
                {
                    id: Date.now() + 10,
                    name: 'Half Boil Egg',
                    price: 30,
                    category: 'Egg Items',
                    image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=300&fit=crop'
                },
                {
                    id: Date.now() + 11,
                    name: 'Egg Podimas',
                    price: 50,
                    category: 'Egg Items',
                    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop'
                }
            ];
            this.saveMenuItems();
        }
    }

    addMenuItem(item) {
        item.id = Date.now();
        this.menuItems.push(item);
        this.saveMenuItems();
    }

    updateMenuItem(id, updatedItem) {
        const index = this.menuItems.findIndex(item => item.id === id);
        if (index !== -1) {
            this.menuItems[index] = { ...this.menuItems[index], ...updatedItem };
            this.saveMenuItems();
        }
    }

    deleteMenuItem(id) {
        this.menuItems = this.menuItems.filter(item => item.id !== id);
        this.saveMenuItems();
    }

    addBill(bill) {
        bill.id = Date.now();
        bill.date = new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
        this.bills.unshift(bill);
        this.saveBills();
    }

    clearBills() {
        this.bills = [];
        this.saveBills();
    }
}

// ===== Application State =====
class BillingApp {
    constructor() {
        this.store = new DataStore();
        this.cart = [];
        this.currentFilter = 'all';
        this.editingItemId = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderMenuGrid();
        this.renderMenuList();
        this.renderBillHistory();
        this.updateCart();
    }

    // ===== Event Listeners =====
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.closest('.nav-tab')));
        });

        // Category filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterCategory(e.target.dataset.category));
        });

        // Cart actions
        document.getElementById('clear-cart-btn').addEventListener('click', () => this.clearCart());
        document.getElementById('save-bill-btn').addEventListener('click', () => this.saveBill());

        // Menu management
        document.getElementById('add-item-btn').addEventListener('click', () => this.showItemForm());
        document.getElementById('cancel-form-btn').addEventListener('click', () => this.hideItemForm());
        document.getElementById('menu-item-form').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // History
        document.getElementById('clear-history-btn').addEventListener('click', () => this.clearHistory());

        // Bill Preview
        document.getElementById('close-preview-btn').addEventListener('click', () => this.closeBillPreview());
        document.getElementById('print-preview-btn').addEventListener('click', () => this.printCurrentBill());
        document.getElementById('new-bill-btn').addEventListener('click', () => this.saveAndCloseBill());
    }

    // ===== Tab Navigation =====
    switchTab(tab) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        const tabName = tab.dataset.tab;
        document.getElementById(`${tabName}-section`).classList.add('active');
    }

    // ===== Billing Section =====
    renderMenuGrid() {
        const grid = document.getElementById('menu-grid');
        const items = this.currentFilter === 'all'
            ? this.store.menuItems
            : this.store.menuItems.filter(item => item.category === this.currentFilter);

        if (items.length === 0) {
            grid.innerHTML = '<p class="empty-cart">No items available</p>';
            return;
        }

        grid.innerHTML = items.map(item => `
            <div class="menu-item-card">
                <img src="${item.image || 'https://via.placeholder.com/200x150?text=No+Image'}"
                     alt="${item.name}"
                     class="menu-item-image"
                     onerror="this.src='https://via.placeholder.com/200x150?text=No+Image'">
                    <div class="menu-item-info">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-price">₹${item.price.toFixed(2)}</div>
                    <div class="menu-item-actions">
                        <button class="btn-add-cart" onclick="app.addToCart(${item.id})">
                            + Add
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterCategory(category) {
        this.currentFilter = category;

        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        this.renderMenuGrid();
    }

    addToCart(itemId) {
        const menuItem = this.store.menuItems.find(item => item.id === itemId);
        if (!menuItem) return;

        const cartItem = this.cart.find(item => item.id === itemId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            this.cart.push({
                id: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: 1
            });
        }

        this.updateCart();
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.updateCart();
    }

    updateQuantity(itemId, delta) {
        const cartItem = this.cart.find(item => item.id === itemId);
        if (cartItem) {
            cartItem.quantity += delta;
            if (cartItem.quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                this.updateCart();
            }
        }
    }

    updateCart() {
        const cartItemsContainer = document.getElementById('cart-items');

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">No items added yet</p>';
        } else {
            cartItemsContainer.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <span class="cart-item-name">${item.name}</span>
                        <button class="cart-item-remove" onclick="app.removeFromCart(${item.id})">×</button>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="app.updateQuantity(${item.id}, -1)">−</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn" onclick="app.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <span class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            `).join('');
        }

        // Update totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.05;
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
    }

    clearCart() {
        if (this.cart.length === 0) return;

        if (confirm('Clear all items from cart?')) {
            this.cart = [];
            this.updateCart();
        }
    }

    saveBill() {
        if (this.cart.length === 0) {
            alert('Cart is empty! Add items before saving bill.');
            return;
        }

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.05;
        const total = subtotal + tax;

        // Get selected payment method
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        const bill = {
            items: [...this.cart],
            subtotal,
            tax,
            total,
            paymentMethod
        };

        // Store current bill
        this.currentBill = bill;

        // Show QR code modal
        this.showQRModal(bill);
    }

    showQRModal(bill) {
        const modal = document.getElementById('qr-modal');

        // Update bill summary
        document.getElementById('modal-subtotal').textContent = `₹${bill.subtotal.toFixed(2)}`;
        document.getElementById('modal-tax').textContent = `₹${bill.tax.toFixed(2)}`;
        document.getElementById('modal-total').textContent = `₹${bill.total.toFixed(2)}`;

        // Update payment method
        const paymentBadge = document.getElementById('modal-payment-method');
        paymentBadge.textContent = bill.paymentMethod.toUpperCase();
        paymentBadge.className = 'payment-badge';
        if (bill.paymentMethod === 'upi') {
            paymentBadge.classList.add('upi');
        }

        // Show/hide QR code section
        const qrSection = document.getElementById('modal-qr-section');
        if (bill.paymentMethod === 'upi') {
            qrSection.style.display = 'block';
            this.generateModalQRCode(bill.total);
        } else {
            qrSection.style.display = 'none';
        }

        // Update items list
        const itemsContainer = document.getElementById('modal-items-container');
        itemsContainer.innerHTML = bill.items.map(item => `
            <div class="modal-item">
                <div class="modal-item-name">${item.name}</div>
                <div class="modal-item-details">
                    <span class="modal-item-qty">×${item.quantity}</span>
                    <span class="modal-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        `).join('');

        // Send to customer display
        const customerDisplayData = {
            total: bill.total,
            subtotal: bill.subtotal,
            tax: bill.tax,
            items: bill.items,
            paymentMethod: bill.paymentMethod,
            timestamp: Date.now()
        };
        localStorage.setItem('customerDisplay', JSON.stringify(customerDisplayData));

        // Show modal
        modal.classList.add('show');
    }

    generateModalQRCode(amount) {
        const qrContainer = document.getElementById('modal-qr-code');
        qrContainer.innerHTML = ''; // Clear previous QR code

        const upiURL = `upi://pay?pa=9585437294@ybl&pn=Jafar Fastfood&am=${amount.toFixed(2)}&cu=INR`;

        // Calculate responsive QR size
        const qrSize = Math.min(250, window.innerWidth * 0.5, 250);

        new QRCode(qrContainer, {
            text: upiURL,
            width: qrSize,
            height: qrSize,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    closeQRModal() {
        const modal = document.getElementById('qr-modal');
        modal.classList.remove('show');
    }

    printFromModal() {
        if (!this.currentBill) return;
        this.printCurrentBill();
    }

    confirmPayment() {
        if (!this.currentBill) return;

        // Save to history
        this.store.addBill(this.currentBill);
        this.renderBillHistory();

        // Clear cart
        this.cart = [];
        this.updateCart();

        // Close modal
        this.closeQRModal();

        // Clear customer display
        localStorage.setItem('clearCustomerDisplay', 'true');
        localStorage.removeItem('customerDisplay');

        alert('✓ Payment confirmed and bill saved successfully!');
    }

    showBillPreview(bill) {
        const previewSection = document.getElementById('bill-preview-section');
        const receiptPreview = document.getElementById('receipt-preview');
        const qrAmount = document.getElementById('qr-amount');
        const qrPaymentSection = document.querySelector('.qr-payment-section');

        // Get selected payment method
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        // Send data to customer display
        const customerDisplayData = {
            total: bill.total,
            subtotal: bill.subtotal,
            tax: bill.tax,
            items: bill.items,
            paymentMethod: paymentMethod
        };
        localStorage.setItem('customerDisplay', JSON.stringify(customerDisplayData));

        // Generate receipt HTML
        const billDate = new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        receiptPreview.innerHTML = `
            <div class="shop-name">JAFAR FASTFOOD</div>
            <div class="tagline">Quality Food & Service</div>
            <div class="divider"></div>
            
            <div class="center bill-info">
                <div>Bill No: ${Date.now()}</div>
                <div>Date: ${billDate}</div>
                <div>Payment: ${paymentMethod.toUpperCase()}</div>
            </div>
            
            <div class="double-divider"></div>
            
            <table>
                <thead>
                    <tr style="font-weight: bold;">
                        <td class="item-name">Item</td>
                        <td class="item-qty">Qty</td>
                        <td class="item-price">Price</td>
                    </tr>
                </thead>
            </table>
            
            <div class="divider"></div>
            
            <table>
                <tbody>
                    ${bill.items.map(item => `
                        <tr>
                            <td class="item-name">${item.name}</td>
                            <td class="item-qty">${item.quantity}</td>
                            <td class="item-price">₹${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="double-divider"></div>
            
            <div class="total-section">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>₹${bill.subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Tax (5%):</span>
                    <span>₹${bill.tax.toFixed(2)}</span>
                </div>
                <div class="double-divider"></div>
                <div class="total-row grand-total">
                    <span>TOTAL:</span>
                    <span>₹${bill.total.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="double-divider"></div>
            
            <div class="footer">
                <div>Thank you for your visit!</div>
                <div>Please visit again</div>
            </div>
        `;

        // Show/hide QR code based on payment method
        if (paymentMethod === 'upi') {
            qrPaymentSection.style.display = 'block';
            qrAmount.textContent = `₹${bill.total.toFixed(2)}`;
            this.generateUPIQRCode(bill.total);
        } else {
            qrPaymentSection.style.display = 'none';
        }

        // Store current bill and payment method for printing
        this.currentBill = { ...bill, paymentMethod };

        // Show preview
        previewSection.classList.remove('hidden');
    }

    generateUPIQRCode(amount) {
        const qrContainer = document.getElementById('qr-code-container');
        qrContainer.innerHTML = ''; // Clear previous QR code

        // UPI Payment URL format
        const upiID = '9585437294@ybl';
        const payeeName = 'Jafar Fastfood';
        const upiURL = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR`;

        // Generate QR Code
        new QRCode(qrContainer, {
            text: upiURL,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    closeBillPreview() {
        document.getElementById('bill-preview-section').classList.add('hidden');
    }

    printCurrentBill() {
        if (!this.currentBill) return;

        const bill = this.currentBill;
        const billDate = new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    @page {
                        size: 58mm auto;
                        margin: 0;
                    }
                    body {
                        font-family: 'Courier New', monospace;
                        width: 58mm;
                        margin: 0;
                        padding: 5mm;
                        font-size: 11pt;
                        line-height: 1.3;
                    }
                    .center {
                        text-align: center;
                    }
                    .bold {
                        font-weight: bold;
                    }
                    .shop-name {
                        font-size: 16pt;
                        font-weight: bold;
                        margin-bottom: 2mm;
                    }
                    .divider {
                        border-top: 1px dashed #000;
                        margin: 3mm 0;
                    }
                    .double-divider {
                        border-top: 2px solid #000;
                        margin: 3mm 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    td {
                        padding: 1mm 0;
                    }
                    .item-name {
                        width: 60%;
                    }
                    .item-qty {
                        width: 15%;
                        text-align: center;
                    }
                    .item-price {
                        width: 25%;
                        text-align: right;
                    }
                    .total-row {
                        font-size: 12pt;
                    }
                    .grand-total {
                        font-size: 14pt;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 5mm;
                        font-size: 10pt;
                    }
                </style>
            </head>
            <body>
                <div class="center shop-name">JAFAR FASTFOOD</div>
                <div class="center" style="font-size: 9pt;">Quality Food & Service</div>
                <div class="divider"></div>
                
                <div class="center">
                    <div>Bill No: ${Date.now()}</div>
                    <div>Date: ${billDate}</div>
                    <div>Payment: ${bill.paymentMethod ? bill.paymentMethod.toUpperCase() : 'CASH'}</div>
                </div>
                
                <div class="double-divider"></div>
                
                <table>
                    <thead>
                        <tr class="bold">
                            <td class="item-name">Item</td>
                            <td class="item-qty">Qty</td>
                            <td class="item-price">Price</td>
                        </tr>
                    </thead>
                </table>
                
                <div class="divider"></div>
                
                <table>
                    <tbody>
                        ${bill.items.map(item => `
                            <tr>
                                <td class="item-name">${item.name}</td>
                                <td class="item-qty">${item.quantity}</td>
                                <td class="item-price">₹${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="double-divider"></div>
                
                <table class="total-row">
                    <tr>
                        <td>Subtotal:</td>
                        <td style="text-align: right;">₹${bill.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Tax (5%):</td>
                        <td style="text-align: right;">₹${bill.tax.toFixed(2)}</td>
                    </tr>
                </table>
                
                <div class="double-divider"></div>
                
                <table class="grand-total">
                    <tr>
                        <td>TOTAL:</td>
                        <td style="text-align: right;">₹${bill.total.toFixed(2)}</td>
                    </tr>
                </table>
                
                <div class="double-divider"></div>
                
                <div class="center footer">
                    ${bill.paymentMethod === 'upi' ? '<div>UPI: 9585437294@ybl</div>' : ''}
                    <div>Thank you for your visit!</div>
                    <div>Please visit again</div>
                </div>
                
                <div style="height: 10mm;"></div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '', 'width=220,height=600');
        printWindow.document.write(printContent);
        printWindow.document.close();

        printWindow.onload = function () {
            printWindow.print();
        };
    }

    saveAndCloseBill() {
        if (!this.currentBill) return;

        // Save to history
        this.store.addBill(this.currentBill);
        this.renderBillHistory();

        // Clear cart
        this.cart = [];
        this.updateCart();

        // Close preview
        this.closeBillPreview();

        // Clear customer display
        localStorage.setItem('clearCustomerDisplay', 'true');
        localStorage.removeItem('customerDisplay');

        alert('Bill saved successfully! ✓');
    }

    // ===== Menu Management =====
    renderMenuList() {
        const list = document.getElementById('menu-list');

        if (this.store.menuItems.length === 0) {
            list.innerHTML = '<p class="empty-cart">No menu items. Click "Add New Item" to create one.</p>';
            return;
        }

        list.innerHTML = this.store.menuItems.map(item => `
            <div class="menu-list-item">
                <img src="${item.image || 'https://via.placeholder.com/100?text=No+Image'}" 
                     alt="${item.name}" 
                     class="menu-list-image"
                     onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
                <div class="menu-list-info">
                    <div class="menu-list-name">${item.name}</div>
                    <div class="menu-list-details">
                        <span class="menu-list-price">₹${item.price.toFixed(2)}</span>
                        <span>•</span>
                        <span>${item.category}</span>
                    </div>
                </div>
                <div class="menu-list-actions">
                    <button class="btn-edit" onclick="app.editMenuItem(${item.id})">Edit</button>
                    <button class="btn-delete" onclick="app.deleteMenuItem(${item.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    showItemForm(item = null) {
        const form = document.getElementById('item-form');
        const formTitle = document.getElementById('form-title');

        form.classList.remove('hidden');

        if (item) {
            formTitle.textContent = 'Edit Item';
            document.getElementById('edit-item-id').value = item.id;
            document.getElementById('item-name').value = item.name;
            document.getElementById('item-price').value = item.price;
            document.getElementById('item-category').value = item.category;
            document.getElementById('item-image').value = item.image || '';
            this.editingItemId = item.id;
        } else {
            formTitle.textContent = 'Add New Item';
            document.getElementById('menu-item-form').reset();
            document.getElementById('edit-item-id').value = '';
            this.editingItemId = null;
        }

        form.scrollIntoView({ behavior: 'smooth' });
    }

    hideItemForm() {
        document.getElementById('item-form').classList.add('hidden');
        document.getElementById('menu-item-form').reset();
        this.editingItemId = null;
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const item = {
            name: document.getElementById('item-name').value.trim(),
            price: parseFloat(document.getElementById('item-price').value),
            category: document.getElementById('item-category').value,
            image: document.getElementById('item-image').value.trim()
        };

        if (this.editingItemId) {
            this.store.updateMenuItem(this.editingItemId, item);
        } else {
            this.store.addMenuItem(item);
        }

        this.hideItemForm();
        this.renderMenuList();
        this.renderMenuGrid();
    }

    editMenuItem(id) {
        const item = this.store.menuItems.find(item => item.id === id);
        if (item) {
            this.showItemForm(item);
        }
    }

    deleteMenuItem(id) {
        const item = this.store.menuItems.find(item => item.id === id);
        if (!item) return;

        if (confirm(`Delete "${item.name}"?`)) {
            this.store.deleteMenuItem(id);
            this.renderMenuList();
            this.renderMenuGrid();
        }
    }

    // ===== Bill History =====
    renderBillHistory() {
        const list = document.getElementById('history-list');

        if (this.store.bills.length === 0) {
            list.innerHTML = '<p class="empty-cart">No bills saved yet.</p>';
            return;
        }

        list.innerHTML = this.store.bills.map((bill, index) => `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">📅 ${bill.date}</span>
                    <div class="history-header-right">
                        <span class="payment-badge ${bill.paymentMethod || 'cash'}">${bill.paymentMethod === 'upi' ? '📱 UPI' : '💵 Cash'}</span>
                        <span class="history-total">₹${bill.total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="history-items">
                    ${bill.items.map(item => `
                        <div class="history-bill-item">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="history-actions">
                    <button class="btn-print" onclick="app.printBill(${index})">🖨️ Print Bill</button>
                </div>
            </div>
        `).join('');
    }

    printBill(index) {
        const bill = this.store.bills[index];
        if (!bill) return;

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    @page {
                        size: 58mm auto;
                        margin: 0;
                    }
                    body {
                        font-family: 'Courier New', monospace;
                        width: 58mm;
                        margin: 0;
                        padding: 5mm;
                        font-size: 11pt;
                        line-height: 1.3;
                    }
                    .center {
                        text-align: center;
                    }
                    .bold {
                        font-weight: bold;
                    }
                    .shop-name {
                        font-size: 16pt;
                        font-weight: bold;
                        margin-bottom: 2mm;
                    }
                    .divider {
                        border-top: 1px dashed #000;
                        margin: 3mm 0;
                    }
                    .double-divider {
                        border-top: 2px solid #000;
                        margin: 3mm 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    td {
                        padding: 1mm 0;
                    }
                    .item-name {
                        width: 60%;
                    }
                    .item-qty {
                        width: 15%;
                        text-align: center;
                    }
                    .item-price {
                        width: 25%;
                        text-align: right;
                    }
                    .total-row {
                        font-size: 12pt;
                    }
                    .grand-total {
                        font-size: 14pt;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 5mm;
                        font-size: 10pt;
                    }
                </style>
            </head>
            <body>
                <div class="center shop-name">JAFAR FASTFOOD</div>
                <div class="center" style="font-size: 9pt;">Quality Food & Service</div>
                <div class="divider"></div>
                
                <div class="center">
                    <div>Bill No: ${bill.id}</div>
                    <div>Date: ${bill.date}</div>
                </div>
                
                <div class="double-divider"></div>
                
                <table>
                    <thead>
                        <tr class="bold">
                            <td class="item-name">Item</td>
                            <td class="item-qty">Qty</td>
                            <td class="item-price">Price</td>
                        </tr>
                    </thead>
                </table>
                
                <div class="divider"></div>
                
                <table>
                    <tbody>
                        ${bill.items.map(item => `
                            <tr>
                                <td class="item-name">${item.name}</td>
                                <td class="item-qty">${item.quantity}</td>
                                <td class="item-price">₹${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="double-divider"></div>
                
                <table class="total-row">
                    <tr>
                        <td>Subtotal:</td>
                        <td style="text-align: right;">₹${bill.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Tax (5%):</td>
                        <td style="text-align: right;">₹${bill.tax.toFixed(2)}</td>
                    </tr>
                </table>
                
                <div class="double-divider"></div>
                
                <table class="grand-total">
                    <tr>
                        <td>TOTAL:</td>
                        <td style="text-align: right;">₹${bill.total.toFixed(2)}</td>
                    </tr>
                </table>
                
                <div class="double-divider"></div>
                
                <div class="center footer">
                    <div>Thank you for your visit!</div>
                    <div>Please visit again</div>
                </div>
                
                <div style="height: 10mm;"></div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '', 'width=220,height=600');
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Wait for content to load before printing
        printWindow.onload = function () {
            printWindow.print();
        };
    }

    clearHistory() {
        if (this.store.bills.length === 0) return;

        if (confirm('Clear all bill history? This cannot be undone.')) {
            this.store.clearBills();
            this.renderBillHistory();
        }
    }

    // ===== Reports Section =====
    setupReportsListeners() {
        const reportType = document.getElementById('report-type');
        const generateBtn = document.getElementById('generate-report-btn');
        const exportBtn = document.getElementById('export-excel-btn');
        const dateRangeGroup = document.getElementById('date-range-group');

        // Show/hide date range based on report type
        reportType.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                dateRangeGroup.style.display = 'block';
            } else {
                dateRangeGroup.style.display = 'none';
            }
        });

        // Set default dates
        const today = new Date();
        document.getElementById('end-date').valueAsDate = today;
        document.getElementById('start-date').valueAsDate = new Date(today.getFullYear(), today.getMonth(), 1);

        generateBtn.addEventListener('click', () => this.generateReport());
        exportBtn.addEventListener('click', () => this.exportToExcel());

        // Hide date range initially
        dateRangeGroup.style.display = 'none';
    }

    generateReport() {
        const reportType = document.getElementById('report-type').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        // Get date range based on report type
        let dateRange = this.getDateRange(reportType, startDate, endDate);

        // Filter bills by date range
        const filteredBills = this.filterBillsByDateRange(dateRange.start, dateRange.end);

        if (filteredBills.length === 0) {
            alert('No bills found for the selected period');
            return;
        }

        // Calculate statistics
        const stats = this.calculateStatistics(filteredBills);

        // Display report
        this.displayReport(filteredBills, stats);
    }

    getDateRange(reportType, startDate, endDate) {
        const today = new Date();
        let start, end;

        switch (reportType) {
            case 'daily':
                start = new Date(today.setHours(0, 0, 0, 0));
                end = new Date(today.setHours(23, 59, 59, 999));
                break;
            case 'monthly':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
                break;
            case 'yearly':
                start = new Date(today.getFullYear(), 0, 1);
                end = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
                break;
            case 'custom':
                start = new Date(startDate);
                end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                break;
            default:
                start = new Date(today.setHours(0, 0, 0, 0));
                end = new Date(today.setHours(23, 59, 59, 999));
        }

        return { start, end };
    }

    filterBillsByDateRange(startDate, endDate) {
        return this.store.bills.filter(bill => {
            const billDate = new Date(bill.date);
            return billDate >= startDate && billDate <= endDate;
        });
    }

    calculateStatistics(bills) {
        const totalSales = bills.reduce((sum, bill) => sum + bill.total, 0);
        const totalBills = bills.length;
        const cashSales = bills.filter(b => b.paymentMethod === 'cash' || !b.paymentMethod).reduce((sum, bill) => sum + bill.total, 0);
        const upiSales = bills.filter(b => b.paymentMethod === 'upi').reduce((sum, bill) => sum + bill.total, 0);

        return {
            totalSales,
            totalBills,
            cashSales,
            upiSales
        };
    }

    displayReport(bills, stats) {
        // Show summary cards
        document.getElementById('report-summary').classList.remove('hidden');
        document.getElementById('total-sales').textContent = `₹${stats.totalSales.toFixed(2)}`;
        document.getElementById('total-bills').textContent = stats.totalBills;
        document.getElementById('cash-sales').textContent = `₹${stats.cashSales.toFixed(2)}`;
        document.getElementById('upi-sales').textContent = `₹${stats.upiSales.toFixed(2)}`;

        // Show table
        document.getElementById('report-table-container').classList.remove('hidden');
        document.getElementById('no-report-data').style.display = 'none';

        // Populate table
        const tbody = document.getElementById('report-table-body');
        tbody.innerHTML = bills.map(bill => `
            <tr>
                <td>${bill.date}</td>
                <td>${bill.id}</td>
                <td>${bill.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</td>
                <td>${bill.paymentMethod === 'upi' ? '📱 UPI' : '💵 Cash'}</td>
                <td>₹${bill.total.toFixed(2)}</td>
            </tr>
        `).join('');

        // Store current report data for export
        this.currentReportData = { bills, stats };
    }

    exportToExcel() {
        if (!this.currentReportData) {
            alert('Please generate a report first');
            return;
        }

        const { bills, stats } = this.currentReportData;
        const reportType = document.getElementById('report-type').value;

        // Create workbook
        const wb = XLSX.utils.book_new();

        // Summary sheet
        const summaryData = [
            ['Jafar Fastfood - Sales Report'],
            [''],
            ['Report Type:', reportType.charAt(0).toUpperCase() + reportType.slice(1)],
            ['Generated:', new Date().toLocaleString('en-IN')],
            [''],
            ['Summary'],
            ['Total Sales:', `₹${stats.totalSales.toFixed(2)}`],
            ['Total Bills:', stats.totalBills],
            ['Cash Sales:', `₹${stats.cashSales.toFixed(2)}`],
            ['UPI Sales:', `₹${stats.upiSales.toFixed(2)}`],
        ];

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

        // Detailed bills sheet
        const billsData = [
            ['Date', 'Bill No.', 'Items', 'Payment Method', 'Amount']
        ];

        bills.forEach(bill => {
            billsData.push([
                bill.date,
                bill.id,
                bill.items.map(item => `${item.name} (${item.quantity})`).join(', '),
                bill.paymentMethod === 'upi' ? 'UPI' : 'Cash',
                bill.total.toFixed(2)
            ]);
        });

        const billsSheet = XLSX.utils.aoa_to_sheet(billsData);
        XLSX.utils.book_append_sheet(wb, billsSheet, 'Bills');

        // Generate filename
        const filename = `Jafar_Fastfood_${reportType}_Report_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Save file
        XLSX.writeFile(wb, filename);
    }
}

// ===== Initialize App =====
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BillingApp();
    app.setupReportsListeners();
});
