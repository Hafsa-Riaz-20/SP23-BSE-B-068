const express = require("express");
let router = express.Router();
let Product = require("../models/product.model");

router.get("/products", async (req, res) => {
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
  const sortField = req.query.sort || "title"; 
  const sortOrder = req.query.order ||  "asc"; 
  


  //Pagination
  const page = parseInt(req.query.page) || 1;  
  const limit = 10; 
  console.log('page', page);
  let totalRecords = await Product.countDocuments(filters); 
  let totalPages = Math.ceil(totalRecords / limit); 

  let products = await Product.find(filters) 
                .sort({ [sortField]: sortOrder ==  "desc" ? -1 : 1 })
                .skip((page-1)*limit) 
                .limit(limit);       

  res.locals.buildQueryLink = (object) => {
    const query = { ...req.query, ...object }; 
    return `/products?${new URLSearchParams(query).toString()}`;
  };
  
  return res.render("products", {
    layout: "layout",
    pageTitle: "Store Home",
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
