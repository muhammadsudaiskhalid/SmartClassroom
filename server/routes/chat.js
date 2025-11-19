const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ChatMessage, Class, Enrollment } = require('../models');

// Get chat messages for a class
router.get('/:classId/messages', async (req, res) => {
  try {
    const { classId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    // Verify user has access to this class
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    let hasAccess = false;
    
    if (req.user.type === 'teacher' && classData.teacherId.toString() === req.user.id) {
      hasAccess = true;
    } else if (req.user.type === 'student') {
      const enrollment = await Enrollment.findOne({ 
        studentId: req.user.id, 
        classId: classId, 
        status: 'approved' 
      });
      hasAccess = !!enrollment;
    }

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this class chat' });
    }

    // Get messages with pagination
    const messages = await ChatMessage.find({ 
      classId: classId,
      isDeleted: false
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .exec();

    // Get total count for pagination
    const totalCount = await ChatMessage.countDocuments({ 
      classId: classId,
      isDeleted: false
    });

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a message (only sender can delete)
router.delete('/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only the sender can delete their message
    if (message.sender.id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }

    // Soft delete the message
    await ChatMessage.findByIdAndUpdate(messageId, { 
      isDeleted: true,
      message: 'This message has been deleted'
    });

    res.json({ success: true, message: 'Message deleted successfully' });

  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit a message (only sender can edit)
router.put('/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message: newMessage } = req.body;
    
    if (!newMessage || newMessage.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only the sender can edit their message
    if (message.sender.id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own messages' });
    }

    // Update the message
    const updatedMessage = await ChatMessage.findByIdAndUpdate(
      messageId, 
      { 
        message: newMessage.trim(),
        editedAt: new Date()
      },
      { new: true }
    );

    res.json({ success: true, message: updatedMessage });

  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat statistics for a class
router.get('/:classId/stats', async (req, res) => {
  try {
    const { classId } = req.params;
    
    // Verify user has access to this class
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    let hasAccess = false;
    
    if (req.user.type === 'teacher' && classData.teacherId.toString() === req.user.id) {
      hasAccess = true;
    } else if (req.user.type === 'student') {
      const enrollment = await Enrollment.findOne({ 
        studentId: req.user.id, 
        classId: classId, 
        status: 'approved' 
      });
      hasAccess = !!enrollment;
    }

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this class' });
    }

    // Get chat statistics
    const totalMessages = await ChatMessage.countDocuments({ 
      classId: classId,
      isDeleted: false
    });

    const messagesThisWeek = await ChatMessage.countDocuments({
      classId: classId,
      isDeleted: false,
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    });

    const activeUsers = await ChatMessage.aggregate([
      {
        $match: {
          classId: new mongoose.Types.ObjectId(classId),
          isDeleted: false,
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: '$sender.id'
        }
      },
      {
        $count: 'totalActiveUsers'
      }
    ]);

    res.json({
      totalMessages,
      messagesThisWeek,
      activeUsersThisWeek: activeUsers[0]?.totalActiveUsers || 0
    });

  } catch (error) {
    console.error('Error fetching chat statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;