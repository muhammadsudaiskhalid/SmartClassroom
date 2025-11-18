const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  subscriptionType: {
    type: String,
    enum: ['trial', 'basic', 'premium', 'enterprise'],
    default: 'trial'
  },
  maxUsers: {
    type: Number,
    default: 1000
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
universitySchema.index({ name: 1 });
universitySchema.index({ isActive: 1 });

module.exports = mongoose.model('University', universitySchema);
