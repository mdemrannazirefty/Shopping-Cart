// script.js
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadCart(); // Load cart from localStorage
});

let cart = []; // Initialize cart

function loadProducts() {
    fetch("products.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            const productList = document.getElementById("product-list");
            productList.innerHTML = "";

            products.slice(0, 6).forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("col-md-4", "mb-4");
                productCard.innerHTML = `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <h5>${product.name}</h5>
                        <p>${product.description}</p>
                        <p class="price">৳${product.price}</p>
                        <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
                    </div>`;
                productList.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error("Error loading products:", error);
        });
}


function addToCart(id, name, price, image) {
    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    updateCartCount();
    updateCartTable();
    saveCart();
}

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}


function updateCartTable() {
    const cartTableBody = document.getElementById("cart-table").querySelector("tbody");
    cartTableBody.innerHTML = "";

    cart.forEach(item => {
        const row = cartTableBody.insertRow();
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" style="max-width: 50px;"></td>
            <td>${item.name}</td>
            <td>৳${item.price}</td>
            <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)"></td>
            <td>৳${item.price * item.quantity}</td>
            <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button></td>
        `;
    });

    updateCartTotal();
}

function updateQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    if (item && quantity > 0) {
        item.quantity = parseInt(quantity);
        updateCartTable();
        saveCart();
    } else if (item && quantity <= 0) {
        removeFromCart(id);
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartTable();
    updateCartCount();
    saveCart();
}

function clearCart() {
    cart = [];
    updateCartTable();
    updateCartCount();
    saveCart();
}

function updateCartTotal() {
    const cartTotal = document.getElementById("cart-total");
    cartTotal.textContent = cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const order = {
        items: cart,
        total: document.getElementById("cart-total").textContent,
    };

    localStorage.setItem("latestOrder", JSON.stringify(order));
    clearCart();
    alert("Thank you for your order!");
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartCount();
        updateCartTable();
    }
}