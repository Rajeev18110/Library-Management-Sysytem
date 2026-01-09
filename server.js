const adminRoutes = require('./routes/admin');

// Make user available in templates
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/admin', adminRoutes); // <-- Admin Dashboard
