module.exports = async function (req, res, next) {
    console.log('Auth middleware session:', req.session.user)
    if (!req.session.user) return res.redirect("/signin");
    else next();
  };