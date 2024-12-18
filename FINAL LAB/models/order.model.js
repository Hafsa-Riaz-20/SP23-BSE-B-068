const mongoose = require("mongoose");

let orderProductsSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, //to map real product for image and other things
  price: Number,
  quantity: Number,
});

let orderSchema = mongoose.Schema(
  {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, //who is ordering
  amount: Number, // Total billed amount
  paymentMethod: String, // Cash only
  items : [orderProductsSchema], //  ordered products list
  address: String // delivery address 
}, { timestamps: true }); // Enable auto set createdAt and updatedAt time, this is built in feature.

let OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
