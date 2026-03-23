const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const app = express();

const clubRoutes = require('./routes/clubRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public', { index: false })); 

// Session Config (Sudharelu)
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // session start for 24 hours
}));

mongoose.connect('mongodb://127.0.0.1:27017/CollegeClubDB')
  .then(() => console.log('✅ New Database Connected!'))
  .catch((err) => console.log('❌ DB Error', err));

app.use('/api', clubRoutes);
app.use('/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    if (req.session.userId) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});