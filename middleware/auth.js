module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/auth/login');
    },

    isAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === 'admin') return next();
        res.redirect('/books');
    }
};
