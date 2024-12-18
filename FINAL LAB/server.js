const express = require("express");
const mongoose = require("mongoose");
let session = require("express-session");

var expressLayouts = require("express-ejs-layouts");
let User = require("./models/user.model");
let adminProductsRouter = require("./routes/admin-products.controller");
let adminRouter = require("./routes/admin.controller");
let adminCategoriesRouter = require("./routes/categories.controller");
let adminOrdersRouter = require('./routes/admin-orders.controller');
let productsRouter = require("./routes/products.controller");
let cartRouter = require("./routes/cart.controller");
let authMiddleware = require("./middlewares/auth-middleware");
let siteMiddleware = require("./middlewares/site-middleware");
let adminRoleMiddleware = require("./middlewares/role-middleware")
let server = express();
let flash = require('connect-flash');
server.use(session({
  secret: "my session secret",
  resave: false,                
  saveUninitialized: false,     
  cookie: { 
    secure: false,              
    maxAge: 1000 * 60 * 60      
  }
})); 

server.use(flash());
server.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

server.use(express.static("public"));
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.urlencoded());
server.use(siteMiddleware);

server.get("/", (req, res) => {
  console.log('req.session.user', req.session.user); 
  res.render("portfolio");  
});

server.get("/signin", (req, res) => { 
  res.render("signin");
});

server.post("/signin", async (req, res) => { 
  console.log("Request data", req.body);  
  let data = req.body; 
  let user = await User.findOne({ email: data.email }); 
  if (!user) return res.redirect("/signup"); 
  isValid = user.password == data.password; 
  if (!isValid) return res.redirect("/signin"); 
  req.session.user = user;  

  return res.redirect("/");
});

server.get("/signup", (req, res) => { 
  res.render("signup"); 
});

server.post("/signup", async (req, res) => {  
  console.log("Request data", req.body); 
  let data = req.body; 
  let user = await User.findOne({ email: data.email }); 
  if (user) return res.redirect("/signup");
  user = new User(data); 
  await user.save(); 
  return res.redirect("/signin");  
});

server.get("/signout", (req, res) => {
  req.session.destroy(); 
  res.redirect("/");
});

server.get("/locations", (req, res) => {
  res.render("locations");
});

server.get("/index", (req, res) => {
  res.render("index");
});

server.use(authMiddleware); 


server.use(productsRouter);
server.use(cartRouter);


server.use(adminRoleMiddleware);
server.use(adminProductsRouter);
server.use(adminRouter);
server.use(adminCategoriesRouter);
server.use(adminOrdersRouter);

let connectionString = "mongodb+srv://hafsaRiaz:hafsa123@sp23-bse-b-068.y1gnr.mongodb.net/";
mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));


server.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});

