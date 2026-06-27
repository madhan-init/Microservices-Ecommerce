const API_BASE_URL = 'http://localhost:8000';

let useMockData = false;
let mockProducts = [
    { id: 1, name: 'Retro Mechanical Keyboard', price: 129.99 },
    { id: 2, name: 'Chunky Block Mouse', price: 59.99 },
    { id: 3, name: 'CRT Monitor (Neon Green)', price: 299.99 },
    { id: 4, name: 'Floppy Disk Coaster Set', price: 14.99 },
    { id: 5, name: '8-Bit Sunglasses', price: 24.99 }
];
let mockOrders = [];
let mockOrderIdCounter = 1;

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    fetchOrders();

    document.getElementById('product-form').addEventListener('submit', createProduct);
    document.getElementById('order-form').addEventListener('submit', placeOrder);
});

async function fetchProducts() {
    const productList = document.getElementById('product-list');
    const orderProdSelect = document.getElementById('order-prod-id');
    
    try {
        if (useMockData) throw new Error('Using mock data');
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        let products = await response.json();

        if (products.length === 0) {
            productList.innerHTML = '<div class="loading">No products available. Adding sample products...</div>';
            await seedSampleProducts();
            return;
        }

        renderProducts(products, productList, orderProdSelect);

    } catch (error) {
        console.warn('Backend unavailable or using mock data. Falling back to sample products.');
        useMockData = true;
        renderProducts(mockProducts, productList, orderProdSelect);
    }
}

async function seedSampleProducts() {
    try {
        for (const prod of mockProducts) {
            await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: prod.name, price: prod.price })
            });
        }
        await fetchProducts(); // Refresh list after seeding
    } catch (error) {
        console.error('Error seeding products:', error);
        useMockData = true;
        await fetchProducts();
    }
}

function renderProducts(products, productList, orderProdSelect) {
    productList.innerHTML = '';
    orderProdSelect.innerHTML = '<option value="" disabled selected>Select a product...</option>';

    if (products.length === 0) {
        productList.innerHTML = '<div class="loading">No products available. Add one above!</div>';
        return;
    }

    products.forEach(product => {
        // Add to product grid
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h4>${product.name}</h4>
            <div class="price">$${product.price.toFixed(2)}</div>
            <small style="color:var(--text-secondary); font-weight: 800; display: block; margin-top: 0.5rem; color: #000;">ID: ${product.id}</small>
        `;
        productList.appendChild(card);

        // Add to order select dropdown
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - $${product.price.toFixed(2)}`;
        orderProdSelect.appendChild(option);
    });
}

async function createProduct(e) {
    e.preventDefault();
    const nameInput = document.getElementById('prod-name');
    const priceInput = document.getElementById('prod-price');
    const btn = e.target.querySelector('button');

    const product = {
        name: nameInput.value,
        price: parseFloat(priceInput.value)
    };

    try {
        btn.textContent = 'Creating...';
        btn.disabled = true;

        if (useMockData) {
            mockProducts.push({
                id: mockProducts.length + 1,
                name: product.name,
                price: product.price
            });
            nameInput.value = '';
            priceInput.value = '';
            await fetchProducts();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });

        if (!response.ok) throw new Error('Failed to create product');

        nameInput.value = '';
        priceInput.value = '';
        await fetchProducts(); // Refresh list

    } catch (error) {
        alert('Error creating product: ' + error.message);
    } finally {
        btn.textContent = 'Create Product';
        btn.disabled = false;
    }
}

async function fetchOrders() {
    const orderList = document.getElementById('order-list');
    
    try {
        if (useMockData) throw new Error('Using mock data');
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const orders = await response.json();
        renderOrders(orders, orderList);

    } catch (error) {
        if (!useMockData) {
            console.warn('Backend unavailable, trying mock mode for orders.');
            useMockData = true;
        }
        renderOrders(mockOrders, orderList);
    }
}

function renderOrders(orders, orderList) {
    orderList.innerHTML = '';

    if (orders.length === 0) {
        orderList.innerHTML = '<div class="loading">No orders yet. Place one above!</div>';
        return;
    }

    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = `
            <div class="order-details">
                <strong>Order #${order.id}</strong>
                <span>Product ID: ${order.productid}</span>
                <span>Qty: ${order.quantity}</span>
            </div>
            ${order.totalprice ? `<div class="order-total">$${order.totalprice.toFixed(2)}</div>` : ''}
        `;
        orderList.appendChild(card);
    });
}

async function placeOrder(e) {
    e.preventDefault();
    const prodIdInput = document.getElementById('order-prod-id');
    const qtyInput = document.getElementById('order-qty');
    const btn = e.target.querySelector('button');

    const order = {
        productid: parseInt(prodIdInput.value),
        quantity: parseInt(qtyInput.value)
    };

    try {
        btn.textContent = 'Placing...';
        btn.disabled = true;

        if (useMockData) {
            const product = mockProducts.find(p => p.id === order.productid);
            const totalprice = product ? product.price * order.quantity : 0;
            mockOrders.push({
                id: mockOrderIdCounter++,
                productid: order.productid,
                quantity: order.quantity,
                totalprice: totalprice
            });
            prodIdInput.value = '';
            qtyInput.value = '';
            await fetchOrders();
            alert(`Order placed successfully! Total: $${totalprice.toFixed(2)}`);
            return;
        }

        const response = await fetch(`${API_BASE_URL}/orders/placeorder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        if (!response.ok) throw new Error('Failed to place order');

        prodIdInput.value = '';
        qtyInput.value = '';
        await fetchOrders(); // Refresh list

        const responseData = await response.json();
        alert(`Order placed successfully! Total: $${responseData.totalprice.toFixed(2)}`);

    } catch (error) {
        alert('Error placing order: ' + error.message);
    } finally {
        btn.textContent = 'Place Order';
        btn.disabled = false;
    }
}
