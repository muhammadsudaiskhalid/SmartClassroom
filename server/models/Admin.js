const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
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
adminSchema.index({ universityId: 1 });
adminSchema.index({ registrationNumber: 1 });
adminSchema.index({ email: 1 });

module.exports = mongoose.model('Admin', adminSchema);
