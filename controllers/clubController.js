const Club = require('../models/Club');
const ClubRegister = require('../models/ClubRegister');
const Notification = require('../models/Notification');

exports.getAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find().lean();
        const clubsWithMembers = await Promise.all(clubs.map(async (club) => {
            const members = await ClubRegister.find({ clubId: club._id });
            return { ...club, members }; 
        }));
        res.json(clubsWithMembers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createClub = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newClub = await Club.create({ name, description });

        // Notification for students (Default isRead: false)
        await Notification.create({
            recipientRole: 'student',
            message: `📢 New Club Added: "${name}". Check it out and join now!`,
            isRead: false
        });

        res.status(201).json(newClub);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const { clubId, name, enrollmentNo, branch, semester } = req.body;
        const newRegistration = new ClubRegister({ clubId, name, enrollmentNo, branch, semester });
        await newRegistration.save();

        const club = await Club.findById(clubId);

        // Notification for teachers (Default isRead: false)
        await Notification.create({
            recipientRole: 'teacher',
            message: `👤 New Member: ${name} (${enrollmentNo}) has joined "${club.name}".`,
            isRead: false
        });

        res.status(200).json({ message: "Successfully registered in club!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMyJoinedClubs = async (req, res) => {
    try {
        const enrollmentNo = req.session.enrollmentNo; 
        if (!enrollmentNo) return res.status(401).json({ message: "Not logged in" });

        const registrations = await ClubRegister.find({ enrollmentNo }).populate('clubId');
        const joinedClubs = registrations.map(reg => reg.clubId).filter(club => club !== null);
        res.json(joinedClubs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const role = req.session.role;
        const userId = req.session.userId; 
        const notifications = await Notification.find({ 
            recipientRole: role, 
            readBy: { $ne: userId } 
        }).sort({ createdAt: -1 });
        
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.userId;

        await Notification.findByIdAndUpdate(id, { 
            $addToSet: { readBy: userId } 
        });
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};