//======================================================
// MIDDLEWARE ADMIN LOGGED IN
//======================================================

isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(400).json('Access is restricted to admin.');
};

module.exports = { isLoggedIn };
