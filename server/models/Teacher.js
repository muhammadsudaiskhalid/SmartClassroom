const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
teacherSchema.index({ universityId: 1 });
teacherSchema.index({ employeeId: 1 });
teacherSchema.index({ registrationNumber: 1 });
teacherSchema.index({ isActive: 1 });
teacherSchema.index({ employeeId: 1, universityId: 1 }, { unique: true });

module.exports = mongoose.model('Teacher', teacherSchema);
