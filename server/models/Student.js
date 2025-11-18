const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  semester: {
    type: String,
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
studentSchema.index({ universityId: 1 });
studentSchema.index({ registrationNumber: 1 });
studentSchema.index({ isActive: 1 });
studentSchema.index({ registrationNumber: 1, universityId: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
