const express = require("express");
let router = express.Router();
let Category = require("../models/category.model");

router.get("/admin/categories", async (req, res) => {
  let categories = await Category.find();
  return res.render("admin/categories", {
    layout: "adminlayout",
    categories,
    pageTitle: "Manage Categories"
  });
});

router.get("/admin/categories/delete/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/categories");
});

router.get("/admin/categories/editForm/:id", async (req, res) => {
  let category = await Category.findById(req.params.id);
  return res.render("admin/editCategory", { layout: "adminlayout", category });
});

router.post("/admin/categories/editForm/:id", async (req, res) => {
  let category = await Category.findById(req.params.id);
  category.name = req.body.name;
  category.description = req.body.description;
  category.status = req.body.status;
  await category.save();
  return res.redirect("/admin/categories");
});

router.get("/admin/createCategory", (req, res) => {
  return res.render("admin/createCategory", {
    layout: "adminlayout",
  });
});

router.post("/admin/createCategory", async (req, res) => {
  let data = req.body;
  let newCategory = new Category(data);
  await newCategory.save();
  return res.redirect("/admin/categories");
});

module.exports = router;

