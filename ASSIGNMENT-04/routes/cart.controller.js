const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const Order = require("../models/order.model");

// Initialize cart in session if it doesn't exist
router.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

// Add item to cart
router.post("/cart/add", async (req, res) => {
  const productId = req.body.productId;
  const product = await Product.findById(productId);

  if (product) {
    const cartItem = req.session.cart.find(item => item.id == productId);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      req.session.cart.push({
        id: product._id,
        name: product.title,
        price: product.price,
        quantity: 1
      });
    }
    req.flash("success", "Item added to cart");
  } else {
    req.flash("error", "Product not found");
  }

  res.redirect("/products");
});

// Remove item from cart
router.post("/cart/remove", (req, res) => {
  const productId = req.body.productId;
  req.session.cart = req.session.cart.filter(item => item.id != productId);
  req.flash("success", "Item removed from cart");
  res.redirect("/cart");
});

// View cart
router.get("/cart", (req, res) => {
  const items = req.session.cart || [];
  console.log('Checking session of cart:',req.session.cart);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("cart", { layout: "layout", cart: {items: items, total}});
});

// Process order
router.post("/cart/order", async (req, res) => {
  if (!req.session.user) {
    req.flash("error", "Please sign in to place an order");
    return res.redirect("/signin");
  }

  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = new Order({
    user: req.session.user._id,
    items: cart.map(item => ({
      product: item.id,
      quantity: item.quantity,
      price: item.price
    })),
    amount: total,
    paymentMethod: req.body.paymentMethod  || 'Cash',
    address: req.body.address || ''
  });

  await order.save();
  req.session.cart = [];
  req.flash("success", "Order placed successfully");
  res.redirect("/");
});

module.exports = router;

