const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
    enum: ['active', 'dropped', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
enrollmentSchema.index({ studentId: 1 });
enrollmentSchema.index({ classId: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ studentId: 1, classId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
