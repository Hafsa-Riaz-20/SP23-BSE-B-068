const express = require("express");
let router = express.Router();
let Product = require("../models/product.model");

router.get("/admin/products", async (req, res) => {
  //Search
  const q = (req.query.q ?? '').trim(); 
  const filters = q
      ? {
          $or: [ 
            { title: { $regex: q, $options: "i" } },        
            { description: { $regex: q, $options: "i" } } 
          ],
        }
      : {}; 
  
  // Sorting
  const sortField = req.query.sort || "_id"; 
  const sortOrder = req.query.order ||  "desc"; 
  


  //Pagination
  const page = parseInt(req.query.page) || 1;  
  const limit = 10; 
  console.log('page', page);
  let totalRecords = await Product.countDocuments(filters);
  let totalPages = Math.ceil(totalRecords / limit); 

  let products = await Product.find(filters) // filter
                .sort({ [sortField]: sortOrder ==  "desc" ? -1 : 1 }) //sorting
                .skip((page-1)*limit) //pagination start
                .limit(limit);       //pagination end

  res.locals.buildQueryLink = (object) => {
    const query = { ...req.query, ...object };
    return `/admin/products?${new URLSearchParams(query).toString()}`;
  };
  
  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Home Furniture",
    products,
    page,
    totalPages,
    totalRecords,
    q,
    sortField,
    sortOrder
  });
});

module.exports = router;
