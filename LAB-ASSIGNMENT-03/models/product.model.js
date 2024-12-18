const mongoose = require("mongoose");

let productSchema = mongoose.Schema({
  title: String,
  price: Number,
  picture: String,
  description: String,
});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
