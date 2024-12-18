const mongoose = require("mongoose");

let orderProductsSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
  price: Number,
  quantity: Number,
});

let orderSchema = mongoose.Schema(
  {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  amount: Number, 
  paymentMethod: String, 
  items : [orderProductsSchema], 
  address: String 
}, { timestamps: true }); 

let OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
