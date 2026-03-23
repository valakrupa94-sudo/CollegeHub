// 1. Register
exports.register = async (req, res) => {
    try {
        const { email, password, role, enrollmentNo, branch, semester, department, employeeId } = req.body;
        const user = await require('../models/User').create({ 
            email, 
            password, role, enrollmentNo, branch, semester, department, employeeId 
        });
        res.status(201).json({ message: "Registration Successful!" });
    } catch (err) {
        res.status(400).json({ error: "Email already exists or Error" });
    }
};

// 2. Login (Sudharelu)
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body; 
        const user = await require('../models/User').findOne({ email, role });

        if (!user) {
            return res.status(401).json({ error: "User not found with this Email" });
        }

        const isMatch = await require('bcryptjs').compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Wrong Password" });
        }

        // --- MUKHYA SUDHARO ---
        req.session.userId = user._id;
        req.session.role = user.role; 
        req.session.enrollmentNo = user.enrollmentNo; // Session ma enrollmentNo store karyo

        res.json({ message: "Login successful", role: user.role });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => res.json({ message: "Logged out" }));
};

// 3. checkAuth (Sudharelu)
exports.checkAuth = (req, res) => {
    if (req.session.userId) {
        // Frontend ne enrollmentNo pan moklavo padse
        res.json({ 
            loggedIn: true, 
            role: req.session.role, 
            enrollmentNo: req.session.enrollmentNo 
        });
    } else {
        res.json({ loggedIn: false });
    }
};