// User Routes - Multi-tenant user management
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Teacher, Student, Admin, University } = require('../models');

// Get all users (Admin only)
router.get('/', async (req, res) => {
  try {
    const { type, universityId } = req.user;
    const { userType } = req.query; // 'teacher', 'student', or 'admin'

    if (type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filter = type === 'super_admin' ? {} : { universityId };

    let users;
    
    if (userType === 'teacher') {
      users = await Teacher.find(filter)
        .populate('universityId', 'name')
        .select('-password')
        .sort({ createdAt: -1 });
    } else if (userType === 'student') {
      users = await Student.find(filter)
        .populate('universityId', 'name')
        .select('-password')
        .sort({ createdAt: -1 });
    } else if (userType === 'admin') {
      users = await Admin.find(filter)
        .populate('universityId', 'name')
        .select('-password')
        .sort({ createdAt: -1 });
    } else {
      // Get all users
      const [teachers, students, admins] = await Promise.all([
        Teacher.find(filter).populate('universityId', 'name').select('-password'),
        Student.find(filter).populate('universityId', 'name').select('-password'),
        Admin.find(filter).populate('universityId', 'name').select('-password')
      ]);

      users = {
        teachers: teachers.map(u => ({ ...u.toObject(), university: u.universityId })),
        students: students.map(u => ({ ...u.toObject(), university: u.universityId })),
        admins: admins.map(u => ({ ...u.toObject(), university: u.universityId }))
      };
      
      return res.json(users);
    }

    res.json(users.map(u => ({
      ...u.toObject(),
      university: u.universityId
    })));
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, universityId } = req.user;
    const { userType } = req.query; // 'teacher', 'student', or 'admin'

    if (type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    let user;
    
    if (userType === 'teacher') {
      user = await Teacher.findById(id)
        .populate('universityId', 'name')
        .select('-password');
    } else if (userType === 'student') {
      user = await Student.findById(id)
        .populate('universityId', 'name')
        .select('-password');
    } else if (userType === 'admin') {
      user = await Admin.findById(id)
        .populate('universityId', 'name')
        .select('-password');
    } else {
      return res.status(400).json({ error: 'userType query parameter required' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check university access
    if (type === 'university_admin' && user.universityId._id.toString() !== universityId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      ...user.toObject(),
      university: user.universityId
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user (Admin only)
router.post('/', async (req, res) => {
  try {
    const { type, universityId: adminUniversityId } = req.user;
    const { userType, universityId, ...userData } = req.body;

    if (type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // University admins can only create users in their university
    const targetUniversityId = type === 'super_admin' ? universityId : adminUniversityId;

    if (type === 'university_admin' && universityId && universityId !== adminUniversityId) {
      return res.status(403).json({ error: 'Cannot create users for other universities' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    let newUser;
    
    if (userType === 'teacher') {
      // Check if employeeId already exists
      const existing = await Teacher.findOne({ 
        employeeId: userData.employeeId, 
        universityId: targetUniversityId 
      });
      if (existing) {
        return res.status(400).json({ error: 'Employee ID already exists' });
      }

      newUser = await Teacher.create({
        ...userData,
        password: hashedPassword,
        universityId: targetUniversityId,
        isActive: true
      });
    } else if (userType === 'student') {
      // Check if registrationNumber already exists
      const existing = await Student.findOne({ 
        registrationNumber: userData.registrationNumber, 
        universityId: targetUniversityId 
      });
      if (existing) {
        return res.status(400).json({ error: 'Registration number already exists' });
      }

      newUser = await Student.create({
        ...userData,
        password: hashedPassword,
        universityId: targetUniversityId,
        isActive: true
      });
    } else if (userType === 'admin') {
      // Check if registrationNumber already exists
      const existing = await Admin.findOne({ 
        registrationNumber: userData.registrationNumber 
      });
      if (existing) {
        return res.status(400).json({ error: 'Registration number already exists' });
      }

      newUser = await Admin.create({
        ...userData,
        password: hashedPassword,
        universityId: targetUniversityId
      });
    } else {
      return res.status(400).json({ error: 'Invalid userType' });
    }

    // Populate and return without password
    const Model = userType === 'teacher' ? Teacher : userType === 'student' ? Student : Admin;
    const populated = await Model.findById(newUser._id)
      .populate('universityId', 'name')
      .select('-password');

    res.status(201).json({
      ...populated.toObject(),
      university: populated.universityId
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, universityId: adminUniversityId } = req.user;
    const { userType, password, ...updateData } = req.body;

    if (type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const Model = userType === 'teacher' ? Teacher : userType === 'student' ? Student : Admin;
    const user = await Model.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // University admins can only update users in their university
    if (type === 'university_admin' && user.universityId.toString() !== adminUniversityId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    // Update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const populated = await Model.findById(id)
      .populate('universityId', 'name')
      .select('-password');

    res.json({
      ...populated.toObject(),
      university: populated.universityId
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete/Deactivate user (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, universityId: adminUniversityId } = req.user;
    const { userType } = req.query;

    if (type !== 'university_admin' && type !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const Model = userType === 'teacher' ? Teacher : userType === 'student' ? Student : Admin;
    const user = await Model.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // University admins can only delete users in their university
    if (type === 'university_admin' && user.universityId.toString() !== adminUniversityId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Soft delete - set isActive to false
    user.isActive = false;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
