module.exports = async function (req, res, next) {
    if (req.session && req.session.user && Array.isArray(req.session.user.role) && req.session.user.role.includes('admin')) {
     next();
    } else {
      req.flash("error", "Ops! Please log in as a admin to access admin panel.");
      return res.redirect('/');
    }
  };