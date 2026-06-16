const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  getAnalytics,
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Analytics route (must be before /:id to avoid conflict)
router.route('/analytics').get(protect, admin, getAnalytics);

router.route('/')
  .post(protect, createComplaint)
  .get(protect, admin, getComplaints);

router.route('/my').get(protect, getMyComplaints);

router.route('/:id/status').put(protect, admin, updateComplaintStatus);
router.route('/:id')
  .get(protect, getComplaintById)
  .delete(protect, admin, deleteComplaint);

module.exports = router;
