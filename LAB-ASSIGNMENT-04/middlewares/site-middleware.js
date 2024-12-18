
module.exports = async function (req, res, next) {
  req.user = req.session.user;

  res.locals.user = req.session.user; 
  res.locals.cartCount = req.session.cart ? req.session.cart.length : 0;
  next();
};