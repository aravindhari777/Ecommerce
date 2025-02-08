require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// MongoDB Schemas
const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    image: String
});

const OrderSchema = new mongoose.Schema({
    items: Array,
    timestamp: { type: Date, default: Date.now }
});

const CartSchema = new mongoose.Schema({
    userId: String,
    items: Array
});

const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Cart = mongoose.model('Cart', CartSchema);

// Routes

// Fetch all products
app.get('/products', async(req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Add a new product
app.post('/products', async(req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ message: "Product Added", product: newProduct });
});

// Delete a product
app.delete('/products/:id', async(req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Deleted" });
});

// Add product to cart
app.post('/cart', async(req, res) => {
    const { userId, productId } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    cart.items.push(productId);
    await cart.save();
    res.json({ message: "Product added to cart", cart });
});

// Get cart items
app.get('/cart/:userId', async(req, res) => {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart ? cart.items : []);
});

// Checkout and place an order
app.post('/order', async(req, res) => {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = new Order({ items: cart.items });
    await newOrder.save();
    await Cart.findOneAndDelete({ userId });

    res.json({ message: "Order Placed Successfully", order: newOrder });
});

// Get all orders
app.get('/orders', async(req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));