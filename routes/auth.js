const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Register GET
router.get('/register', (req, res) => {
    res.render('auth/register', { error: null });
});

// Register POST
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if username already exists
        const exists = await User.findOne({ username });
        if (exists) return res.render('auth/register', { error: 'Username already exists' });

        // Create user
        const user = new User({ username, password, email: email || null });
        await user.save();

        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.render('auth/register', { error: 'Something went wrong' });
    }
});

// Login GET
router.get('/login', (req, res) => res.render('auth/login', { error: null }));

// Login POST
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureMessage: true
}), (req, res) => res.redirect('/books'));

// Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/auth/login');
    });
});

module.exports = router;
