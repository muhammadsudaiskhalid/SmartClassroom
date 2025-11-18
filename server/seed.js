// MongoDB Seed Script
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { 
  University, 
  Admin, 
  Teacher, 
  Student, 
  Class, 
  Enrollment, 
  JoinRequest, 
  Minute 
} = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await University.deleteMany({});
    await Admin.deleteMany({});
    await Teacher.deleteMany({});
    await Student.deleteMany({});
    await Class.deleteMany({});
    await Enrollment.deleteMany({});
    await JoinRequest.deleteMany({});
    await Minute.deleteMany({});
    console.log('Data cleared');

    // Create Universities
    console.log('Creating universities...');
    const [demoUniversity, testInstitute] = await University.create([
      {
        name: 'Demo University',
        contactEmail: 'admin@demouniversity.edu',
        subscriptionType: 'premium',
        maxUsers: 1000,
        isActive: true
      },
      {
        name: 'Test Institute',
        contactEmail: 'admin@testinstitute.edu',
        subscriptionType: 'basic',
        maxUsers: 500,
        isActive: true
      }
    ]);
    console.log(`Created universities: ${demoUniversity.name}, ${testInstitute.name}`);

    // Create Admins
    console.log('Creating admins...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const [admin1, admin2] = await Admin.create([
      {
        registrationNumber: 'ADMIN001',
        name: 'John Admin',
        email: 'admin1@demouniversity.edu',
        password: hashedPassword,
        phone: '1234567890',
        universityId: demoUniversity._id
      },
      {
        registrationNumber: 'ADMIN002',
        name: 'Jane Admin',
        email: 'admin2@testinstitute.edu',
        password: hashedPassword,
        phone: '0987654321',
        universityId: testInstitute._id
      }
    ]);
    console.log(`Created admins: ${admin1.registrationNumber}, ${admin2.registrationNumber}`);

    // Create Teachers
    console.log('Creating teachers...');
    const [teacher1, teacher2, teacher3] = await Teacher.create([
      {
        employeeId: 'DU-T001',
        registrationNumber: 'DU-T001',
        name: 'Dr. Sarah Smith',
        email: 'sarah.smith@demouniversity.edu',
        password: hashedPassword,
        phone: '1111111111',
        department: 'Computer Science',
        universityId: demoUniversity._id,
        isActive: true
      },
      {
        employeeId: 'DU-T002',
        registrationNumber: 'DU-T002',
        name: 'Prof. Michael Johnson',
        email: 'michael.johnson@demouniversity.edu',
        password: hashedPassword,
        phone: '2222222222',
        department: 'Mathematics',
        universityId: demoUniversity._id,
        isActive: true
      },
      {
        employeeId: 'TI-T101',
        registrationNumber: 'TI-T101',
        name: 'Dr. Emily Chen',
        email: 'emily.chen@testinstitute.edu',
        password: hashedPassword,
        phone: '3333333333',
        department: 'Physics',
        universityId: testInstitute._id,
        isActive: true
      }
    ]);
    console.log(`Created teachers: ${teacher1.employeeId}, ${teacher2.employeeId}, ${teacher3.employeeId}`);

    // Create Students
    console.log('Creating students...');
    const [student1, student2, student3, student4] = await Student.create([
      {
        registrationNumber: 'DU-S001',
        name: 'Alice Williams',
        email: 'alice.williams@student.demouniversity.edu',
        password: hashedPassword,
        phone: '4444444444',
        department: 'Computer Science',
        semester: 3,
        universityId: demoUniversity._id,
        isActive: true
      },
      {
        registrationNumber: 'DU-S002',
        name: 'Bob Davis',
        email: 'bob.davis@student.demouniversity.edu',
        password: hashedPassword,
        phone: '5555555555',
        department: 'Computer Science',
        semester: 2,
        universityId: demoUniversity._id,
        isActive: true
      },
      {
        registrationNumber: 'TI-S101',
        name: 'Charlie Brown',
        email: 'charlie.brown@student.testinstitute.edu',
        password: hashedPassword,
        phone: '6666666666',
        department: 'Physics',
        semester: 4,
        universityId: testInstitute._id,
        isActive: true
      },
      {
        registrationNumber: 'DU-S003',
        name: 'Diana Martinez',
        email: 'diana.martinez@student.demouniversity.edu',
        password: hashedPassword,
        phone: '7777777777',
        department: 'Mathematics',
        semester: 1,
        universityId: demoUniversity._id,
        isActive: true
      }
    ]);
    console.log(`Created students: ${student1.registrationNumber}, ${student2.registrationNumber}, ${student3.registrationNumber}, ${student4.registrationNumber}`);

    // Create Classes
    console.log('Creating classes...');
    const [class1, class2, class3] = await Class.create([
      {
        code: 'CS101',
        name: 'Introduction to Programming',
        subject: 'Computer Science',
        teacherId: teacher1._id,
        universityId: demoUniversity._id,
        schedule: {
          days: ['Monday', 'Wednesday'],
          time: '10:00 AM - 11:30 AM',
          room: 'CS Building Room 301'
        },
        isActive: true
      },
      {
        code: 'MATH101',
        name: 'Calculus I',
        subject: 'Mathematics',
        teacherId: teacher2._id,
        universityId: demoUniversity._id,
        schedule: {
          days: ['Tuesday', 'Thursday'],
          time: '2:00 PM - 3:30 PM',
          room: 'Math Building Room 201'
        },
        isActive: true
      },
      {
        code: 'PHY301',
        name: 'Quantum Mechanics',
        subject: 'Physics',
        teacherId: teacher3._id,
        universityId: testInstitute._id,
        schedule: {
          days: ['Monday', 'Wednesday', 'Friday'],
          time: '9:00 AM - 10:00 AM',
          room: 'Physics Lab 101'
        },
        isActive: true
      }
    ]);
    console.log(`Created classes: ${class1.code}, ${class2.code}, ${class3.code}`);

    // Create Enrollments
    console.log('Creating enrollments...');
    await Enrollment.create([
      {
        studentId: student1._id,
        classId: class1._id,
        status: 'active'
      },
      {
        studentId: student2._id,
        classId: class1._id,
        status: 'active'
      },
      {
        studentId: student1._id,
        classId: class2._id,
        status: 'active'
      },
      {
        studentId: student4._id,
        classId: class2._id,
        status: 'active'
      },
      {
        studentId: student3._id,
        classId: class3._id,
        status: 'active'
      }
    ]);
    console.log('Created enrollments');

    // Create Join Requests
    console.log('Creating join requests...');
    await JoinRequest.create([
      {
        studentId: student4._id,
        classId: class1._id,
        status: 'pending'
      },
      {
        studentId: student2._id,
        classId: class2._id,
        status: 'approved'
      }
    ]);
    console.log('Created join requests');

    // Create Minutes
    console.log('Creating attendance minutes...');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    await Minute.create([
      {
        classId: class1._id,
        studentId: student1._id,
        teacherId: teacher1._id,
        date: today,
        duration: 90,
        topic: 'Introduction to Variables and Data Types',
        description: 'Covered basic programming concepts including variables, data types, and operators.'
      },
      {
        classId: class1._id,
        studentId: student2._id,
        teacherId: teacher1._id,
        date: today,
        duration: 90,
        topic: 'Introduction to Variables and Data Types',
        description: 'Covered basic programming concepts including variables, data types, and operators.'
      },
      {
        classId: class1._id,
        studentId: student1._id,
        teacherId: teacher1._id,
        date: yesterday,
        duration: 90,
        topic: 'Control Flow Statements',
        description: 'Learned about if-else statements, loops, and conditional logic.'
      },
      {
        classId: class2._id,
        studentId: student1._id,
        teacherId: teacher2._id,
        date: lastWeek,
        duration: 90,
        topic: 'Limits and Continuity',
        description: 'Introduction to calculus concepts: limits, continuity, and derivatives.'
      },
      {
        classId: class3._id,
        studentId: student3._id,
        teacherId: teacher3._id,
        date: today,
        duration: 60,
        topic: 'Wave-Particle Duality',
        description: 'Discussion on quantum mechanics principles and wave functions.'
      }
    ]);
    console.log('Created attendance minutes');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Universities: 2`);
    console.log(`   Admins: 2`);
    console.log(`   Teachers: 3`);
    console.log(`   Students: 4`);
    console.log(`   Classes: 3`);
    console.log(`   Enrollments: 5`);
    console.log(`   Join Requests: 2`);
    console.log(`   Attendance Minutes: 5`);
    
    console.log('\n🔐 Test Credentials (password: password123):');
    console.log('\n   Demo University Admin:');
    console.log(`   - Registration: ADMIN001`);
    console.log(`   - Email: admin1@demouniversity.edu`);
    console.log('\n   Test Institute Admin:');
    console.log(`   - Registration: ADMIN002`);
    console.log(`   - Email: admin2@testinstitute.edu`);
    console.log('\n   Teacher:');
    console.log(`   - Registration: DU-T001`);
    console.log(`   - Email: sarah.smith@demouniversity.edu`);
    console.log('\n   Student:');
    console.log(`   - Registration: DU-S001`);
    console.log(`   - Email: alice.williams@student.demouniversity.edu`);

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
}

seed();
