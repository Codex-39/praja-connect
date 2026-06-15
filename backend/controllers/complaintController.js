const Complaint = require('../models/Complaint');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
  try {
    const {
      citizenName,
      mobileNumber,
      colonyName,
      streetName,
      wardNumber,
      landmark,
      issueTitle,
      issueDescription,
      category,
      priority,
      pincode,
      latitude,
      longitude,
    } = req.body;

    // Validate required fields (landmark is optional)
    if (
      !citizenName ||
      !mobileNumber ||
      !colonyName ||
      !streetName ||
      !wardNumber ||
      !issueTitle ||
      !issueDescription ||
      !category ||
      !priority ||
      !pincode
    ) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // FormData sends everything as strings; parse lat/lng to numbers
    const parsedLat = latitude ? parseFloat(latitude) : undefined;
    const parsedLng = longitude ? parseFloat(longitude) : undefined;

    const complaint = await Complaint.create({
      pincode,
      latitude: parsedLat !== undefined && !isNaN(parsedLat) ? parsedLat : undefined,
      longitude: parsedLng !== undefined && !isNaN(parsedLng) ? parsedLng : undefined,
      citizenName,
      mobileNumber,
      colonyName,
      streetName,
      wardNumber,
      landmark: landmark || '',
      issueTitle,
      issueDescription,
      category,
      priority,
      imageUrl,
      userId: req.user.id,
    });


    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user complaints
// @route   GET /api/complaints/my
// @access  Private
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints (admin) with optional filters
// @route   GET /api/complaints
// @access  Private/Admin
const getComplaints = async (req, res) => {
  try {
    const { category, ward, priority, status, search } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if (ward && ward !== 'All') filter.wardNumber = ward;
    if (priority && priority !== 'All') filter.priority = priority;
    if (status && status !== 'All') filter.status = status;
    if (search) {
      filter.citizenName = { $regex: search, $options: 'i' };
    }

    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email mobile address')
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    const updatedComplaint = await complaint.save();

    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email mobile address');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    // Only allow the user who created it or an admin to view it
    if (complaint.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics data
// @route   GET /api/complaints/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const [byCategory, byWard, byStatus, emergencyCount, totalCount] = await Promise.all([
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        { $group: { _id: '$wardNumber', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Complaint.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Complaint.countDocuments({ priority: 'Emergency' }),
      Complaint.countDocuments(),
    ]);

    res.status(200).json({
      byCategory: byCategory.map((c) => ({ name: c._id, count: c.count })),
      byWard: byWard.map((w) => ({ name: `Ward ${w._id}`, count: w.count })),
      byStatus: byStatus.map((s) => ({ name: s._id, count: s.count })),
      emergencyCount,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  getAnalytics,
};
