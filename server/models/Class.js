const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true
  },
  schedule: {
    type: mongoose.Schema.Types.Mixed, // Flexible JSON object
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
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
classSchema.index({ universityId: 1 });
classSchema.index({ teacherId: 1 });
classSchema.index({ code: 1 });
classSchema.index({ isActive: 1 });
classSchema.index({ code: 1, universityId: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);
