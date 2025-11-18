const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes
joinRequestSchema.index({ studentId: 1 });
joinRequestSchema.index({ classId: 1 });
joinRequestSchema.index({ status: 1 });
joinRequestSchema.index({ studentId: 1, classId: 1 }, { unique: true });

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
