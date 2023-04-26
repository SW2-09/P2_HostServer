export { ensureAuthenticated, checkLoggedIn };

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/worker/login");
}

//Ensures you can not redirect from worker page to other pages if logged in
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/worker");
  }
  next();
}
