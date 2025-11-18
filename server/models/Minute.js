const mongoose = require('mongoose');

const minuteSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  topic: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
minuteSchema.index({ classId: 1 });
minuteSchema.index({ studentId: 1 });
minuteSchema.index({ teacherId: 1 });
minuteSchema.index({ date: 1 });

module.exports = mongoose.model('Minute', minuteSchema);
