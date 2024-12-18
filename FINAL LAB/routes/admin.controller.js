const express = require("express");
let router = express.Router();
let Product = require("../models/product.model");
const { uploadProductImage } = require("../middlewares/multer.middleware");


router.get("/admin/products/delete/:id",  async (req, res) => { 
  // let params = req.params;
  await Product.findByIdAndDelete(req.params.id);
  // let query = req.query;
  // return res.send({ query, params });
  // return res.send(product);
  return res.redirect("/admin/products");
}); 

router.get("/admin/products/editForm/:id", async (req, res) => {
  // let params = req.params;
  let product = await Product.findById(req.params.id);
  return res.render("admin/editForm", { layout: "adminlayout", product });
});

router.post(
  "/admin/products/editForm/:id",
  uploadProductImage.single("picture"),
  async (req, res) => {
    let product = await Product.findById(req.params.id);
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;

    if (req.file) {
      product.picture = req.file.path; 
    }

    await product.save();
    return res.redirect("/admin/products");
  }
);


router.post(
  "/admin/createForm",
  uploadProductImage.single("picture"), 
  async (req, res) => {
    try {
      const { title, description, price } = req.body;
      if (!req.file) {
        throw new Error("File upload failed");
      }
      const picture = req.file.path;
      const newProduct = new Product({
        title,
        price,
        picture,
        description,
      });
      await newProduct.save();
      return res.redirect("/admin/products");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error saving product: " + err.message);
    }
  }
);


router.get("/admin/createForm", (req, res) => {
  return res.render("admin/createForm", {
    layout: "adminlayout",
  });
});
module.exports = router;
