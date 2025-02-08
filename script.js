// script.js

// Function to switch between sections
function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
}

// Function to search and filter products
function searchProducts() {
    let searchValue = document.getElementById("search").value.toLowerCase();
    let products = document.querySelectorAll(".product");

    products.forEach(product => {
        let title = product.querySelector(".product-title").textContent.toLowerCase();
        product.style.display = title.includes(searchValue) ? "block" : "none";
    });
}

function filterProducts() {
    let maxPrice = parseFloat(document.getElementById("price-filter").value) || Infinity;
    let category = document.getElementById("category-filter").value;
    let products = document.querySelectorAll(".product");

    products.forEach(product => {
        let price = parseFloat(product.querySelector(".product-price").textContent);
        let productCategory = product.getAttribute("data-category");

        product.style.display = (price <= maxPrice && (category === "all" || productCategory === category)) ? "block" : "none";
    });
}

// Ensure the DOM is loaded before adding event listeners
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("search").addEventListener("input", searchProducts);
    document.getElementById("price-filter").addEventListener("change", filterProducts);
    document.getElementById("category-filter").addEventListener("change", filterProducts);
});

// script.js

// Function to switch between sections
function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
}

// Function to search and filter products
function searchProducts() {
    let searchValue = document.getElementById("search").value.toLowerCase();
    let products = document.querySelectorAll(".product");

    products.forEach(product => {
        let title = product.querySelector(".product-title").textContent.toLowerCase();
        product.style.display = title.includes(searchValue) ? "block" : "none";
    });
}

function filterProducts() {
    let maxPrice = parseFloat(document.getElementById("price-filter").value) || Infinity;
    let category = document.getElementById("category-filter").value;
    let products = document.querySelectorAll(".product");

    products.forEach(product => {
        let price = parseFloat(product.querySelector(".product-price").textContent);
        let productCategory = product.getAttribute("data-category");

        product.style.display = (price <= maxPrice && (category === "all" || productCategory === category)) ? "block" : "none";
    });
}

// Store and retrieve cart items using LocalStorage
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(productId);
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// IndexedDB setup for product storage
let db;
const request = indexedDB.open("ecommerceDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    let store = db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
    store.createIndex("title", "title", { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
};

function addProduct(product) {
    let transaction = db.transaction(["products"], "readwrite");
    let store = transaction.objectStore("products");
    store.add(product);
}

function getProducts(callback) {
    let transaction = db.transaction(["products"], "readonly");
    let store = transaction.objectStore("products");
    let request = store.getAll();
    request.onsuccess = function() {
        callback(request.result);
    };
}

// Ensure the DOM is loaded before adding event listeners
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("search").addEventListener("input", searchProducts);
    document.getElementById("price-filter").addEventListener("change", filterProducts);
    document.getElementById("category-filter").addEventListener("change", filterProducts);

    getProducts(products => {
        console.log("Loaded products:", products);
    });
});



// Sample product data

const products = [{
        "id": 1,
        "title": "Fjallraven - Foldsack No. 1 Backpack",
        "price": 109.95,
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
    },
    {
        "id": 2,
        "title": "Mens Casual Premium Slim Fit T-Shirts",
        "price": 22.3,
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
    },
    {
        "id": 3,
        "title": "Mens Cotton Jacket",
        "price": 55.99,
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"
    }
];

// Cart array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to display products
function displayProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Category: ${product.category}</p>
            <p class="product-price">$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });
}

// Function to add a product to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }
}

// Function to update cart items and count
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Cart is empty</p>";
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <h4>${item.title}</h4>
                <p>$${item.price}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    document.getElementById("cart-count").textContent = cart.length;
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

// Function to handle checkout
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Simulate order processing
    const order = {
        id: Date.now(),
        items: [...cart],
        timestamp: new Date().toLocaleString(),
    };

    // Save order to local storage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart
    cart = [];
    localStorage.removeItem("cart");
    updateCart();

    alert("Order placed successfully!");
    showSection("order-history");
    displayOrderHistory();
}

// Function to display order history
function displayOrderHistory() {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = "";

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length === 0) {
        orderList.innerHTML = "<p>No orders yet.</p>";
    } else {
        orders.forEach(order => {
                    const orderDiv = document.createElement("div");
                    orderDiv.classList.add("order");
                    orderDiv.innerHTML = `
                <h4>Order ID: ${order.id}</h4>
                <p>Date: ${order.timestamp}</p>
                <ul>
                    ${order.items.map(item => `<li>${item.title} - $${item.price}</li>`).join("")}
                </ul>
            `;
            orderList.appendChild(orderDiv);
        });
    }
}

// Function to show sections
function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
}

// Function to search products
function searchProducts() {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchInput)
    );

    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Category: ${product.category}</p>
            <p class="product-price">$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    displayProducts();
    updateCart();
    displayOrderHistory();
});