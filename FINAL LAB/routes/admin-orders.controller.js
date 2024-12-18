const express = require("express");
let router = express.Router();
let Order = require("../models/order.model");

router.get("/admin/orders", async (req, res) => {

  // Sorting
  const sortField = req.query.sort || "createdAt"; // Default to _id if no sort field is provided
  const sortOrder = req.query.order ||  "desc"; // Default to ascending (1) or descending (-1) order
  


  //Pagination
  const page = parseInt(req.query.page) || 1;  
  const limit = 10; 
  console.log('page', page);
  let totalRecords = await Order.countDocuments(); 
  let totalPages = Math.ceil(totalRecords / limit); 

  let orders = await Order.find() // filter
                .populate({
                  path: "user", 
                  select: "name", 
                })
                .populate({
                  path: "items.product", 
                  select: "title", 
                })
                .sort({ [sortField]: sortOrder ==  "desc" ? -1 : 1 }) //sorting
                .skip((page-1)*limit) //pagination start
                .limit(limit);       //pagination end

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

module.exports = router;
