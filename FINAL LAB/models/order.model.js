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
  paymentMethod: {
    type: String,
    default: 'Cash'
  },
  paymentStatus: {
    type: String,
    default: 'Pending'
  },
  items : [orderProductsSchema], 
  address: String,
  deliveryStatus: {
    type: String,
    default: 'Pending'
  },

}, { timestamps: true }); 

let OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
