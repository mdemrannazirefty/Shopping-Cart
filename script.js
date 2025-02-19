document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadCart();
});

let cart = [];
let appliedPromo = null;

const promoCodes = {
    "ostad10": 0.10,
    "ostad5": 0.05
};

function loadProducts() {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById("product-list");
            productList.innerHTML = "";
            products.forEach(product => {
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
        .catch(error => console.error("Error loading products:", error));
}

function addToCart(id, name, price, image) {
    const existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    updateCartCount();
    updateCartTable();
    saveCart();
}

function updateCartCount() {
    document.getElementById("cart-count").textContent = cart.reduce((total, item) => total + item.quantity, 0);
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

function updateCartTotal() {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    let discount = appliedPromo ? subtotal * promoCodes[appliedPromo] : 0;
    document.getElementById("cart-subtotal").textContent = subtotal;
    document.getElementById("cart-discount").textContent = `৳${discount.toFixed(2)}`;
    document.getElementById("cart-total").textContent = (subtotal - discount).toFixed(2);
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

function applyPromoCode() {
    const promoInput = document.getElementById("promo-code").value.trim();
    const promoMessage = document.getElementById("promo-message");
    if (promoCodes[promoInput]) {
        appliedPromo = promoInput;
        updateCartTotal();
        promoMessage.textContent = `Promo code applied: ${promoInput} (${promoCodes[promoInput] * 100}% discount)`;
        promoMessage.style.color = "green";
    } else {
        promoMessage.textContent = "Invalid promo code.";
        promoMessage.style.color = "red";
    }
}

function clearCart() {
    cart = [];
    appliedPromo = null;
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Thank you for your order!");
    clearCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCart();
    }
}
