const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  sender: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'sender.type'
    },
    type: {
      type: String,
      required: true,
      enum: ['Teacher', 'Student']
    },
    name: {
      type: String,
      required: true
    },
    registrationNumber: {
      type: String,
      required: true
    }
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  fileUrl: {
    type: String,
    required: false
  },
  fileName: {
    type: String,
    required: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient querying
chatMessageSchema.index({ classId: 1, createdAt: -1 });
chatMessageSchema.index({ 'sender.id': 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);