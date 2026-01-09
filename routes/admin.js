const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Middleware to allow only admin
function isAdmin(req, res, next) {
    if(req.user && req.user.role === 'admin'){
        return next();
    }
    req.flash('error', 'Access denied');
    res.redirect('/auth/login');
}

// Admin Dashboard
router.get('/', isAdmin, async (req, res) => {
    try {
        const books = await Book.find();
        res.render('admin/dashboard', { books });
    } catch(err) {
        console.error(err);
        res.send('Something went wrong');
    }
});

module.exports = router;
