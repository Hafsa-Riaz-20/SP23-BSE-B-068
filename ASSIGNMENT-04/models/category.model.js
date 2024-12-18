const mongoose = require("mongoose");

let categorySchema = mongoose.Schema({
  name: String,
  description: String,
  status: {
    type: String,
    enum: ['available', 'out of stock'],
    default: 'available'
  }
});

let CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;

