module.exports = auth = (req, res, next) => {
  if (!req.session.loggedIn) return res.redirect('/login')
  res.locals.user = req.session.user;
  return next();
};
