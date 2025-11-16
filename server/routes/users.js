// User Management Routes (Admin only)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');

// Get all users in university (Admin only)
router.get('/', async (req, res) => {
  try {
    const { type, universityId } = req.user;

    if (type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const where = type === 'super_admin' ? {} : { universityId };

    const [teachers, students, admins] = await Promise.all([
      prisma.teacher.findMany({
        where,
        select: {
          id: true,
          name: true,
          employeeId: true,
          registrationNumber: true,
          email: true,
          department: true,
          isActive: true,
          universityId: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.student.findMany({
        where,
        select: {
          id: true,
          name: true,
          registrationNumber: true,
          email: true,
          department: true,
          semester: true,
          isActive: true,
          universityId: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      type === 'super_admin' ? prisma.admin.findMany({
        select: {
          id: true,
          name: true,
          registrationNumber: true,
          email: true,
          universityId: true,
          createdAt: true
        }
      }) : []
    ]);

    res.json({
      teachers: teachers.map(t => ({ ...t, type: 'teacher', userType: 'teacher' })),
      students: students.map(s => ({ ...s, type: 'student', userType: 'student' })),
      admins: admins.map(a => ({ ...a, type: 'admin', userType: 'admin' }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create teacher (Admin only)
router.post('/teachers', async (req, res) => {
  try {
    const { type, universityId } = req.user;

    if (type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, employeeId, registrationNumber, email, department, phone, password, targetUniversityId } = req.body;

    // Determine which university to add to
    const targetUni = type === 'super_admin' && targetUniversityId ? targetUniversityId : universityId;

    // Check if employeeId or registrationNumber already exists
    const existing = await prisma.teacher.findFirst({
      where: {
        OR: [
          { employeeId },
          { registrationNumber }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Employee ID or Registration Number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await prisma.teacher.create({
      data: {
        name,
        employeeId,
        registrationNumber,
        email,
        department,
        phone,
        password: hashedPassword,
        universityId: targetUni
      },
      include: {
        university: { select: { name: true } }
      }
    });

    // Remove password from response
    const { password: _, ...teacherWithoutPassword } = teacher;
    res.status(201).json({ ...teacherWithoutPassword, type: 'teacher', userType: 'teacher' });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create student (Admin only)
router.post('/students', async (req, res) => {
  try {
    const { type, universityId } = req.user;

    if (type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, registrationNumber, email, department, semester, phone, password, targetUniversityId } = req.body;

    // Determine which university to add to
    const targetUni = type === 'super_admin' && targetUniversityId ? targetUniversityId : universityId;

    // Check if registrationNumber already exists
    const existing = await prisma.student.findUnique({
      where: { registrationNumber }
    });

    if (existing) {
      return res.status(400).json({ error: 'Registration Number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.student.create({
      data: {
        name,
        registrationNumber,
        email,
        department,
        semester,
        phone,
        password: hashedPassword,
        universityId: targetUni
      },
      include: {
        university: { select: { name: true } }
      }
    });

    // Remove password from response
    const { password: _, ...studentWithoutPassword } = student;
    res.status(201).json({ ...studentWithoutPassword, type: 'student', userType: 'student' });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (Admin only)
router.put('/:userType/:id', async (req, res) => {
  try {
    const { type, universityId } = req.user;
    const { userType, id } = req.params;

    if (type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updates = req.body;
    delete updates.password; // Don't allow direct password updates
    delete updates.id;
    delete updates.universityId;

    let updatedUser;

    if (userType === 'teacher') {
      const teacher = await prisma.teacher.findUnique({ where: { id } });
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      if (type !== 'super_admin' && teacher.universityId !== universityId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      updatedUser = await prisma.teacher.update({
        where: { id },
        data: updates,
        select: {
          id: true,
          name: true,
          employeeId: true,
          registrationNumber: true,
          email: true,
          department: true,
          phone: true,
          isActive: true,
          universityId: true
        }
      });
    } else if (userType === 'student') {
      const student = await prisma.student.findUnique({ where: { id } });
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      if (type !== 'super_admin' && student.universityId !== universityId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      updatedUser = await prisma.student.update({
        where: { id },
        data: updates,
        select: {
          id: true,
          name: true,
          registrationNumber: true,
          email: true,
          department: true,
          semester: true,
          phone: true,
          isActive: true,
          universityId: true
        }
      });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    res.json({ ...updatedUser, type: userType, userType });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password (Admin only)
router.post('/:userType/:id/reset-password', async (req, res) => {
  try {
    const { type, universityId } = req.user;
    const { userType, id } = req.params;
    const { newPassword } = req.body;

    if (type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (userType === 'teacher') {
      const teacher = await prisma.teacher.findUnique({ where: { id } });
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      if (type !== 'super_admin' && teacher.universityId !== universityId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await prisma.teacher.update({
        where: { id },
        data: { password: hashedPassword }
      });
    } else if (userType === 'student') {
      const student = await prisma.student.findUnique({ where: { id } });
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      if (type !== 'super_admin' && student.universityId !== universityId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await prisma.student.update({
        where: { id },
        data: { password: hashedPassword }
      });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (Admin only)
router.delete('/:userType/:id', async (req, res) => {
  try {
    const { type, universityId } = req.user;
    const { userType, id } = req.params;

    if (type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (userType === 'teacher') {
      const teacher = await prisma.teacher.findUnique({ where: { id } });
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      if (type !== 'super_admin' && teacher.universityId !== universityId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await prisma.teacher.delete({ where: { id } });
    } else if (userType === 'student') {
      const student = await prisma.student.findUnique({ where: { id } });
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      if (type !== 'super_admin' && student.universityId !== universityId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await prisma.student.delete({ where: { id } });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
