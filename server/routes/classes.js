// Class Routes - Multi-tenant isolated
const express = require('express');
const router = express.Router();
const { Class, Teacher, Student, Enrollment, JoinRequest, Minute, University } = require('../models');

// Middleware to ensure user belongs to university
const ensureUniversityAccess = (req, res, next) => {
  if (req.user.type === 'super_admin') {
    return next(); // Super admin has access to all
  }
  next();
};

// Get all classes for current user's university
router.get('/', ensureUniversityAccess, async (req, res) => {
  try {
    const { type, universityId, id } = req.user;

    let classes;
    
    if (type === 'teacher') {
      // Teacher sees their own classes
      classes = await Class.find({
        teacherId: id,
        universityId,
        isActive: true
      })
      .populate('teacherId', 'name department')
      .sort({ createdAt: -1 });

      // Add counts
      const classesWithCounts = await Promise.all(
        classes.map(async (cls) => {
          const enrollmentCount = await Enrollment.countDocuments({ classId: cls._id });
          const pendingRequestsCount = await JoinRequest.countDocuments({ 
            classId: cls._id, 
            status: 'pending' 
          });
          
          return {
            ...cls.toObject(),
            teacher: cls.teacherId,
            _count: {
              enrollments: enrollmentCount,
              joinRequests: pendingRequestsCount
            }
          };
        })
      );
      
      return res.json(classesWithCounts);
      
    } else if (type === 'student') {
      // Student sees available classes and enrolled classes
      const enrolledClassIds = await Enrollment.find({
        studentId: id,
        status: 'active'
      }).distinct('classId');

      const [enrolledClasses, availableClasses] = await Promise.all([
        Class.find({
          _id: { $in: enrolledClassIds },
          universityId,
          isActive: true
        }).populate('teacherId', 'name department'),
        
        Class.find({
          _id: { $nin: enrolledClassIds },
          universityId,
          isActive: true
        }).populate('teacherId', 'name department')
      ]);

      // Add counts
      const enrolledWithCounts = await Promise.all(
        enrolledClasses.map(async (cls) => {
          const count = await Enrollment.countDocuments({ classId: cls._id });
          return {
            ...cls.toObject(),
            teacher: cls.teacherId,
            _count: { enrollments: count }
          };
        })
      );

      const availableWithCounts = await Promise.all(
        availableClasses.map(async (cls) => {
          const count = await Enrollment.countDocuments({ classId: cls._id });
          return {
            ...cls.toObject(),
            teacher: cls.teacherId,
            _count: { enrollments: count }
          };
        })
      );
      
      return res.json({ 
        enrolledClasses: enrolledWithCounts, 
        availableClasses: availableWithCounts 
      });
      
    } else if (type === 'university_admin' || type === 'super_admin') {
      // Admin sees all classes in their university
      const filter = type === 'super_admin' ? {} : { universityId };
      
      classes = await Class.find(filter)
        .populate('teacherId', 'name department')
        .populate('universityId', 'name')
        .sort({ createdAt: -1 });

      const classesWithCounts = await Promise.all(
        classes.map(async (cls) => {
          const count = await Enrollment.countDocuments({ classId: cls._id });
          return {
            ...cls.toObject(),
            teacher: cls.teacherId,
            university: cls.universityId,
            _count: { enrollments: count }
          };
        })
      );
      
      return res.json(classesWithCounts);
    }

    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get class by ID
router.get('/:id', ensureUniversityAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const { universityId, type } = req.user;

    const classData = await Class.findById(id)
      .populate('teacherId', 'name department email')
      .populate('universityId', 'name');

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check university access
    if (type !== 'super_admin' && classData.universityId._id.toString() !== universityId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get enrollments
    const enrollments = await Enrollment.find({ classId: id, status: 'active' })
      .populate('studentId', 'name registrationNumber email department');

    // Get join requests
    const joinRequests = await JoinRequest.find({ classId: id })
      .populate('studentId', 'name registrationNumber email')
      .sort({ createdAt: -1 });

    res.json({
      ...classData.toObject(),
      teacher: classData.teacherId,
      university: classData.universityId,
      enrollments: enrollments.map(e => ({
        ...e.toObject(),
        student: e.studentId
      })),
      joinRequests: joinRequests.map(jr => ({
        ...jr.toObject(),
        student: jr.studentId
      }))
    });
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create class (Teacher only)
router.post('/', async (req, res) => {
  try {
    const { type, id, universityId } = req.user;

    if (type !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can create classes' });
    }

    const { name, subject, code, schedule } = req.body;

    // Check if class code already exists in university
    const existing = await Class.findOne({ code, universityId });
    if (existing) {
      return res.status(400).json({ error: 'Class code already exists in your university' });
    }

    const newClass = await Class.create({
      name,
      subject,
      code,
      schedule: schedule || null,
      teacherId: id,
      universityId,
      isActive: true
    });

    const populated = await Class.findById(newClass._id)
      .populate('teacherId', 'name department');

    res.status(201).json({
      ...populated.toObject(),
      teacher: populated.teacherId
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update class (Teacher only, their own class)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, id: userId } = req.user;
    const { name, subject, code, schedule, isActive } = req.body;

    const classData = await Class.findById(id);
    
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Only teacher who created it can update
    if (type === 'teacher' && classData.teacherId.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (type !== 'teacher' && type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update fields
    if (name !== undefined) classData.name = name;
    if (subject !== undefined) classData.subject = subject;
    if (code !== undefined) classData.code = code;
    if (schedule !== undefined) classData.schedule = schedule;
    if (isActive !== undefined) classData.isActive = isActive;

    await classData.save();

    const populated = await Class.findById(id).populate('teacherId', 'name department');

    res.json({
      ...populated.toObject(),
      teacher: populated.teacherId
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete class
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, id: userId } = req.user;

    const classData = await Class.findById(id);
    
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Only teacher who created it or admin can delete
    if (type === 'teacher' && classData.teacherId.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (type !== 'teacher' && type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Class.findByIdAndDelete(id);

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join request (Student)
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, id: studentId, universityId } = req.user;

    if (type !== 'student') {
      return res.status(403).json({ error: 'Only students can join classes' });
    }

    const classData = await Class.findById(id);
    
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classData.universityId.toString() !== universityId) {
      return res.status(403).json({ error: 'Cannot join class from different university' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ studentId, classId: id });
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this class' });
    }

    // Check if request already exists
    const existingRequest = await JoinRequest.findOne({ studentId, classId: id });
    if (existingRequest) {
      return res.status(400).json({ error: 'Join request already exists' });
    }

    const joinRequest = await JoinRequest.create({
      studentId,
      classId: id,
      status: 'pending'
    });

    res.status(201).json(joinRequest);
  } catch (error) {
    console.error('Join request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject join request (Teacher)
router.put('/:classId/requests/:requestId', async (req, res) => {
  try {
    const { classId, requestId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    const { type, id: teacherId } = req.user;

    if (type !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can approve join requests' });
    }

    const classData = await Class.findById(classId);
    
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classData.teacherId.toString() !== teacherId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const joinRequest = await JoinRequest.findById(requestId);
    
    if (!joinRequest || joinRequest.classId.toString() !== classId) {
      return res.status(404).json({ error: 'Join request not found' });
    }

    joinRequest.status = status;
    await joinRequest.save();

    // If approved, create enrollment
    if (status === 'approved') {
      await Enrollment.create({
        studentId: joinRequest.studentId,
        classId,
        status: 'active'
      });
    }

    res.json(joinRequest);
  } catch (error) {
    console.error('Update join request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get students in class (Teacher)
router.get('/:id/students', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, id: userId } = req.user;

    const classData = await Class.findById(id);
    
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Teacher must own the class
    if (type === 'teacher' && classData.teacherId.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const enrollments = await Enrollment.find({ classId: id, status: 'active' })
      .populate('studentId', 'name registrationNumber email department phone');

    const students = enrollments.map(e => e.studentId);

    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get minutes for a class
router.get('/:id/minutes', async (req, res) => {
  try {
    const { id } = req.params;

    const minutes = await Minute.find({ classId: id })
      .populate('studentId', 'name registrationNumber')
      .populate('teacherId', 'name')
      .sort({ date: -1 });

    res.json(minutes.map(m => ({
      ...m.toObject(),
      student: m.studentId,
      teacher: m.teacherId
    })));
  } catch (error) {
    console.error('Get minutes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add minutes (Teacher)
router.post('/:id/minutes', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, id: teacherId } = req.user;
    const { studentId, date, duration, topic, description } = req.body;

    if (type !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can add minutes' });
    }

    const classData = await Class.findById(id);
    
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classData.teacherId.toString() !== teacherId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if student is enrolled
    const enrollment = await Enrollment.findOne({ 
      studentId, 
      classId: id, 
      status: 'active' 
    });
    
    if (!enrollment) {
      return res.status(400).json({ error: 'Student not enrolled in this class' });
    }

    const minute = await Minute.create({
      classId: id,
      studentId,
      teacherId,
      date: new Date(date),
      duration,
      topic: topic || '',
      description: description || ''
    });

    const populated = await Minute.findById(minute._id)
      .populate('studentId', 'name registrationNumber')
      .populate('teacherId', 'name');

    res.status(201).json({
      ...populated.toObject(),
      student: populated.studentId,
      teacher: populated.teacherId
    });
  } catch (error) {
    console.error('Add minutes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
