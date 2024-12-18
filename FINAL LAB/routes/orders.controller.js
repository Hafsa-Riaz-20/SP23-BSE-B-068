const express = require("express");
let router = express.Router();
let Order = require("../models/order.model");

router.get("/orders", async (req, res) => {
  const sortField = req.query.sort || "createdAt";
  const sortOrder = req.query.order ||  "desc"; 
  
  const page = parseInt(req.query.page) || 1;  
  const limit = 10; 
  console.log('page', page);
  let totalRecords = await Order.countDocuments(); 
  let totalPages = Math.ceil(totalRecords / limit); 

  let orders = await Order.find({
    user: req.user._id
  })
                .populate({
                  path: "user", 
                  select: "name", 
                })
                .populate({
                  path: "items.product", 
                  select: "title", 
                })
                .sort({ [sortField]: sortOrder ==  "desc" ? -1 : 1 }) //sorting
                .skip((page-1)*limit) 
                .limit(limit);       

                console.log('orders', orders)
  res.locals.buildQueryLink = (object) => {
    const query = { ...req.query, ...object }; 
    return `/orders?${new URLSearchParams(query).toString()}`;
  };
  
  return res.render("orders", {
    layout: "layout",
    pageTitle: "My orders",
    orders,
    page,
    totalPages,
    totalRecords,
    sortField,
    sortOrder
  });
});


module.exports = router;
