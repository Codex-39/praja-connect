const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    citizenName: {
      type: String,
      required: [true, 'Citizen name is required'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
    },
    colonyName: {
      type: String,
      required: [true, 'Colony name is required'],
    },
    streetName: {
      type: String,
      required: [true, 'Street name is required'],
    },
    wardNumber: {
      type: String,
      required: [true, 'Ward number is required'],
    },
    landmark: {
      type: String,
      default: '',
    },
    issueTitle: {
      type: String,
      required: [true, 'Issue title is required'],
    },
    issueDescription: {
      type: String,
      required: [true, 'Issue description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Potholes',
        'Drainage Overflow',
        'Garbage Collection',
        'Water Supply Problem',
        'Street Light Not Working',
        'Road Damage',
        'Sewage Leakage',
        'Electricity Problem',
        'Illegal Dumping',
        'Mosquito Breeding',
        'Public Toilet Issue',
        'Park Maintenance',
        'Traffic Signal Issue',
        'Other',
      ],
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Low',
    },
    imageUrl: {
      type: String,
    },
    pincode: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
