import React, { useState, useEffect } from "react";
import "App.css";

const EcommerceApp = () => {
        const [products, setProducts] = useState([]);
        const [searchTerm, setSearchTerm] = useState("");
        const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
        const [vendorProducts, setVendorProducts] = useState(JSON.parse(localStorage.getItem("vendorProducts")) || []);
        const [orders, setOrders] = useState(JSON.parse(localStorage.getItem("orders")) || []);

        useEffect(() => {
            fetch("https://fakestoreapi.com/products")
                .then(res => res.json())
                .then(data => setProducts(data));
        }, []);

        const addToCart = (product) => {
            const updatedCart = [...cart, product];
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        };

        const placeOrder = () => {
            const newOrder = { id: Date.now(), items: cart, timestamp: new Date().toISOString() };
            const updatedOrders = [...orders, newOrder];
            setOrders(updatedOrders);
            localStorage.setItem("orders", JSON.stringify(updatedOrders));
            setCart([]);
            localStorage.removeItem("cart");
        };

        return ( <
                div className = "container" >
                <
                header >
                <
                h1 > E - Commerce App < /h1> <
                input type = "text"
                placeholder = "Search products..."
                onChange = {
                    (e) => setSearchTerm(e.target.value.toLowerCase()) }
                /> <
                /header>

                <
                section className = "products" > {
                    [...products, ...vendorProducts]
                    .filter(product => product.title.toLowerCase().includes(searchTerm))
                    .map((product) => ( <
                        div key = { product.id }
                        className = "product" >
                        <
                        img src = { product.image }
                        alt = { product.title }
                        /> <
                        h3 > { product.title } < /h3> <
                        p > { product.description } < /p> <
                        p className = "product-price" > $ { product.price } < /p> <
                        button onClick = {
                            () => addToCart(product) } > Add to Cart < /button> <
                        /div>
                    ))
                } <
                /section>

                <
                section className = "cart" >
                <
                h2 > Cart < /h2> {
                    cart.length === 0 ? ( <
                        p > Cart is empty < /p>
                    ) : (
                        cart.map((item, index) => ( <
                            div key = { index }
                            className = "cart-item" >
                            <
                            h4 > { item.title } < /h4> <
                            p > $ { item.price } < /p> <
                            /div>
                        ))
                    )
                } {
                    cart.length > 0 && < button onClick = { placeOrder } > Checkout < /button>} <
                        /section>

                    <
                    section className = "orders" >
                        <
                        h2 > Order History < /h2> {
                            orders.length === 0 ? ( <
                                p > No orders yet < /p>
                            ) : (
                                orders.map(order => ( <
                                    div key = { order.id }
                                    className = "order" >
                                    <
                                    h4 > Order ID: { order.id } < /h4> <
                                    p > { order.timestamp } < /p> {
                                        order.items.map((item, idx) => ( <
                                            p key = { idx } > { item.title } - $ { item.price } < /p>
                                        ))
                                    } <
                                    /div>
                                ))
                            )
                        } <
                        /section>