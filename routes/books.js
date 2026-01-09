const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');

// Middleware to check login
function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/login');
}

// Multer setup for cover image uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// List books
router.get('/', ensureAuth, async (req, res) => {
    const books = await Book.find();
    res.render('books/index', { books });
});

// Add new book
router.get('/new', ensureAuth, (req, res) => {
    if (req.user.role !== 'admin') return res.redirect('/books');
    res.render('books/new');
});

router.post('/new', ensureAuth, upload.single('coverImage'), async (req, res) => {
    if (req.user.role !== 'admin') return res.redirect('/books');
    const { title, author } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;
    const book = new Book({ title, author, coverImage });
    await book.save();
    res.redirect('/books');
});

// Edit book
router.get('/edit/:id', ensureAuth, async (req, res) => {
    if (req.user.role !== 'admin') return res.redirect('/books');
    const book = await Book.findById(req.params.id);
    res.render('books/edit', { book });
});

router.post('/edit/:id', ensureAuth, upload.single('coverImage'), async (req, res) => {
    if (req.user.role !== 'admin') return res.redirect('/books');
    const { title, author } = req.body;
    const updateData = { title, author };
    if (req.file) updateData.coverImage = `/uploads/${req.file.filename}`;
    await Book.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/books');
});

// Delete book
router.get('/delete/:id', ensureAuth, async (req, res) => {
    if (req.user.role !== 'admin') return res.redirect('/books');
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books');
});

// Download book cover
router.get('/download/:id', ensureAuth, async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book || !book.coverImage) return res.redirect('/books');
    const filePath = path.join(__dirname, '../public', book.coverImage);
    res.download(filePath);
});

module.exports = router;
