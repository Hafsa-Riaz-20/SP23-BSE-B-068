const express = require("express");
let router = express.Router();
let Order = require("../models/order.model");

router.get("/admin/orders", async (req, res) => {


  const sortField = req.query.sort || "createdAt";
  const sortOrder = req.query.order ||  "desc"; 
  


  
  const page = parseInt(req.query.page) || 1;  
  const limit = 10; 
  console.log('page', page);
  let totalRecords = await Order.countDocuments(); 
  let totalPages = Math.ceil(totalRecords / limit); 

  let orders = await Order.find()
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
    return `/admin/orders?${new URLSearchParams(query).toString()}`;
  };
  
  return res.render("admin/orders", {
    layout: "adminlayout",
    pageTitle: "Manage orders",
    orders,
    page,
    totalPages,
    totalRecords,
    sortField,
    sortOrder
  });
});

router.get("/admin/orders/delete/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/orders");
});

router.get("/admin/orders/confirm/:id", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    deliveryStatus: 'Delivered'
  });
  req.flash("success", "Order delivered successfully");

  return res.redirect("/admin/orders");
});

module.exports = router;
