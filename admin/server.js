const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const app = express();

const Club = require('./models/Club'); 
const User = require('./models/User');   
const Event = require('./models/Event'); 
const Participant = require('./models/Participant'); 
const ClubRegister = require('./models/ClubRegister'); 

mongoose.connect('mongodb://127.0.0.1:27017/CollegeClubDB')
  .then(() => console.log('👑 Admin DB Connected!'))
  .catch((err) => console.log('❌ DB Error', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'admin-super-secret-key', resave: false, saveUninitialized: true, cookie: { maxAge: 24 * 60 * 60 * 1000 } }));
app.use(express.static(path.join(__dirname, 'public'))); 

const isAdmin = (req, res, next) => { if (req.session.isAdmin) { next(); } else { res.redirect('/login'); } };

app.post('/auth/admin-login', (req, res) => {
    const { email, pass } = req.body;
    if (email === 'admin@college.com' && pass === 'admin123') { req.session.isAdmin = true; res.json({ success: true }); }
    else { res.status(401).json({ success: false, message: "Invalid Credentials" }); }
});

app.get('/api/admin/data', isAdmin, async (req, res) => {
    try {
        const clubs = await Club.find();
        const teacherCount = await User.countDocuments({ role: 'teacher' }).catch(() => 0);
        const eventCount = await Event.countDocuments().catch(() => 0);
        res.json({ clubs, teacherCount, eventCount });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// --- FULL UPDATE ROUTES ---
app.put('/api/admin/update-club/:id', isAdmin, async (req, res) => { try { await Club.findByIdAndUpdate(req.params.id, req.body); res.json({m:"ok"}); } catch(e){ res.status(500).send(); } });
app.put('/api/admin/update-student/:id', isAdmin, async (req, res) => { try { await User.findByIdAndUpdate(req.params.id, req.body); res.json({m:"ok"}); } catch(e){ res.status(500).send(); } });
app.put('/api/admin/update-teacher/:id', isAdmin, async (req, res) => { try { await User.findByIdAndUpdate(req.params.id, req.body); res.json({m:"ok"}); } catch(e){ res.status(500).send(); } });

// Live Event: Fakt Date update thase, Title કે Club nahi (કેમ કે field readonly છે)
app.put('/api/admin/update-event/:id', isAdmin, async (req, res) => { 
    try { 
        // Fakt Date update karshe, body ma bija data hase to pan 
        // logic fix rakhyu che jethi fakt Date j change thase.
        await Event.findByIdAndUpdate(req.params.id, { date: req.body.date }); 
        res.json({m:"ok"}); 
    } 
    catch(e){ res.status(500).send(); } 
});

app.put('/api/admin/update-participant/:id', isAdmin, async (req, res) => { 
    try { await Participant.findByIdAndUpdate(req.params.id, { name: req.body.name, enrollment: req.body.enrollment }); res.json({m:"ok"}); } 
    catch(e){ res.status(500).send(); } 
});

app.put('/api/admin/update-club-reg/:id', isAdmin, async (req, res) => { 
    try { await ClubRegister.findByIdAndUpdate(req.params.id, { name: req.body.name, enrollmentNo: req.body.enrollmentNo }); res.json({m:"ok"}); } 
    catch(e){ res.status(500).send(); } 
});

// --- DATA FETCH ROUTES ---
app.get('/api/admin/students', isAdmin, async (req, res) => {
    try {
        const students = await User.find({ role: 'student' });
        res.json(students.map(s => ({ _id: s._id, email: s.email, enrollmentNo: s.enrollmentNo || "N/A", branch: s.branch || "N/A", semester: s.semester || "N/A" })));
    } catch (err) { res.status(500).json([]); }
});

app.get('/api/admin/teachers', isAdmin, async (req, res) => { try { res.json(await User.find({ role: 'teacher' })); } catch (err) { res.status(500).json([]); } });

app.get('/api/admin/events-data', isAdmin, async (req, res) => {
    try {
        const events = await Event.find().populate('clubId'); 
        res.json(events.map(event => ({ _id: event._id, title: event.name, clubName: event.clubId ? event.clubId.name : "General", date: event.date ? new Date(event.date).toLocaleDateString('en-GB') : "N/A" })));
    } catch (err) { res.status(500).json([]); }
});

app.get('/api/admin/event-participants', isAdmin, async (req, res) => {
    try {
        const participants = await Participant.find().populate({ path: 'eventId' });
        res.json(participants.map(p => ({ _id: p._id, userName: p.name, enrollment: p.enrollment, branchSem: `${p.branch} - ${p.semester}`, eventName: p.eventId ? p.eventId.name : "Unknown" })));
    } catch (err) { res.status(500).json([]); }
});

app.get('/api/admin/club-registrations', isAdmin, async (req, res) => {
    try {
        const registrations = await ClubRegister.find().populate('clubId');
        res.json(registrations.map(reg => ({ _id: reg._id, name: reg.name, enrollmentNo: reg.enrollmentNo, branchSem: `${reg.branch} - ${reg.semester}`, clubName: reg.clubId ? reg.clubId.name : "Unknown" })));
    } catch (err) { res.status(500).json([]); }
});

// --- DELETE API ROUTES ---
app.delete('/api/admin/delete/:id', isAdmin, async (req, res) => { await Club.findByIdAndDelete(req.params.id); res.json({m:"ok"}); });
app.delete('/api/admin/delete-student/:id', isAdmin, async (req, res) => { await User.findByIdAndDelete(req.params.id); res.json({m:"ok"}); });
app.delete('/api/admin/delete-teacher/:id', isAdmin, async (req, res) => { await User.findByIdAndDelete(req.params.id); res.json({m:"ok"}); });
app.delete('/api/admin/delete-event/:id', isAdmin, async (req, res) => { await Event.findByIdAndDelete(req.params.id); res.json({m:"ok"}); });
app.delete('/api/admin/delete-participant/:id', isAdmin, async (req, res) => { await Participant.findByIdAndDelete(req.params.id); res.json({m:"ok"}); });
app.delete('/api/admin/delete-club-reg/:id', isAdmin, async (req, res) => { await ClubRegister.findByIdAndDelete(req.params.id); res.json({m:"ok"}); });

app.get('/', isAdmin, (req, res) => { res.sendFile(path.join(__dirname, 'public', 'dashboard.html')); });
app.get('/login', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'login.html')); });
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

app.listen(3500, () => { console.log(`🚀 Admin runs on http://localhost:3500`); });