// Class Routes - Multi-tenant isolated
const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

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
      classes = await prisma.class.findMany({
        where: {
          teacherId: id,
          universityId,
          isActive: true
        },
        include: {
          teacher: { select: { name: true, department: true } },
          _count: {
            select: { enrollments: true, joinRequests: { where: { status: 'pending' } } }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (type === 'student') {
      // Student sees available classes and enrolled classes
      const [enrolledClasses, availableClasses] = await Promise.all([
        prisma.class.findMany({
          where: {
            universityId,
            isActive: true,
            enrollments: {
              some: {
                studentId: id,
                status: 'active'
              }
            }
          },
          include: {
            teacher: { select: { name: true, department: true } },
            _count: { select: { enrollments: true } }
          }
        }),
        prisma.class.findMany({
          where: {
            universityId,
            isActive: true,
            enrollments: {
              none: { studentId: id }
            }
          },
          include: {
            teacher: { select: { name: true, department: true } },
            _count: { select: { enrollments: true } }
          }
        })
      ]);
      
      return res.json({ enrolledClasses, availableClasses });
    } else if (type === 'university_admin' || type === 'super_admin') {
      // Admin sees all classes in their university
      classes = await prisma.class.findMany({
        where: type === 'super_admin' ? {} : { universityId },
        include: {
          teacher: { select: { name: true, department: true } },
          university: { select: { name: true } },
          _count: { select: { enrollments: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
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

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        teacher: { select: { name: true, department: true, email: true } },
        university: { select: { name: true } },
        enrollments: {
          include: {
            student: {
              select: { id: true, name: true, registrationNumber: true, email: true, department: true }
            }
          }
        },
        joinRequests: {
          where: { status: 'pending' },
          include: {
            student: {
              select: { id: true, name: true, registrationNumber: true, email: true, department: true }
            }
          }
        },
        _count: { select: { enrollments: true, minutes: true } }
      }
    });

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check university access
    if (type !== 'super_admin' && classData.universityId !== universityId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(classData);
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create class (Teacher only)
router.post('/', ensureUniversityAccess, async (req, res) => {
  try {
    const { type, id, universityId } = req.user;

    if (type !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can create classes' });
    }

    const { name, subject, code, schedule } = req.body;

    // Check if code already exists in this university
    const existing = await prisma.class.findFirst({
      where: { code, universityId }
    });

    if (existing) {
      return res.status(400).json({ error: 'Class code already exists in your university' });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        subject,
        code,
        schedule,
        teacherId: id,
        universityId
      },
      include: {
        teacher: { select: { name: true, department: true } }
      }
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update class (Teacher only - their own class)
router.put('/:id', ensureUniversityAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, id: userId, universityId } = req.user;

    if (type !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can update classes' });
    }

    const classData = await prisma.class.findUnique({ where: { id } });
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classData.teacherId !== userId) {
      return res.status(403).json({ error: 'You can only update your own classes' });
    }

    const { name, subject, schedule, isActive } = req.body;

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(subject && { subject }),
        ...(schedule && { schedule }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        teacher: { select: { name: true, department: true } }
      }
    });

    res.json(updatedClass);
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete class (Teacher only - their own class)
router.delete('/:id', ensureUniversityAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, id: userId } = req.user;

    if (type !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can delete classes' });
    }

    const classData = await prisma.class.findUnique({ where: { id } });
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classData.teacherId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own classes' });
    }

    await prisma.class.delete({ where: { id } });
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Request to join class (Student only)
router.post('/:id/join', ensureUniversityAccess, async (req, res) => {
  try {
    const { id: classId } = req.params;
    const { type, id: studentId, universityId } = req.user;

    if (type !== 'student') {
      return res.status(403).json({ error: 'Only students can join classes' });
    }

    // Check if class exists and is in same university
    const classData = await prisma.class.findUnique({ where: { id: classId } });
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classData.universityId !== universityId) {
      return res.status(403).json({ error: 'Cannot join classes from other universities' });
    }

    // Check if already enrolled
    const enrolled = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: { studentId, classId }
      }
    });

    if (enrolled) {
      return res.status(400).json({ error: 'Already enrolled in this class' });
    }

    // Check if request already exists
    const existingRequest = await prisma.joinRequest.findUnique({
      where: {
        studentId_classId: { studentId, classId }
      }
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return res.status(400).json({ error: 'Join request already pending' });
      } else if (existingRequest.status === 'rejected') {
        // Update rejected request to pending
        const updatedRequest = await prisma.joinRequest.update({
          where: { id: existingRequest.id },
          data: { status: 'pending' }
        });
        return res.json(updatedRequest);
      }
    }

    // Create new join request
    const joinRequest = await prisma.joinRequest.create({
      data: {
        studentId,
        classId,
        status: 'pending'
      },
      include: {
        student: {
          select: { name: true, registrationNumber: true, department: true }
        },
        class: {
          select: { name: true, code: true }
        }
      }
    });

    res.status(201).json(joinRequest);
  } catch (error) {
    console.error('Join class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject join request (Teacher only)
router.put('/:id/join-requests/:requestId', ensureUniversityAccess, async (req, res) => {
  try {
    const { id: classId, requestId } = req.params;
    const { type, id: teacherId } = req.user;
    const { status } = req.body; // 'approved' or 'rejected'

    if (type !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can approve/reject join requests' });
    }

    // Check if class belongs to teacher
    const classData = await prisma.class.findUnique({ where: { id: classId } });
    if (!classData || classData.teacherId !== teacherId) {
      return res.status(403).json({ error: 'You can only manage requests for your own classes' });
    }

    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId }
    });

    if (!joinRequest) {
      return res.status(404).json({ error: 'Join request not found' });
    }

    if (status === 'approved') {
      // Create enrollment
      await prisma.enrollment.create({
        data: {
          studentId: joinRequest.studentId,
          classId: joinRequest.classId,
          status: 'active'
        }
      });
    }

    // Update request status
    const updatedRequest = await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        student: {
          select: { name: true, registrationNumber: true }
        }
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error('Approve/reject join request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
