const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo universities
  const university1 = await prisma.university.create({
    data: {
      name: 'Demo University',
      contactEmail: 'admin@demouniversity.edu',
      contactPhone: '+1234567890',
      subscriptionType: 'premium',
      maxUsers: 5000,
      isActive: true,
    },
  });

  const university2 = await prisma.university.create({
    data: {
      name: 'Test Institute',
      contactEmail: 'admin@testinstitute.edu',
      contactPhone: '+1987654321',
      subscriptionType: 'basic',
      maxUsers: 1000,
      isActive: true,
    },
  });

  console.log('✅ Universities created');

  // Create admins for each university
  const admin1Password = await bcrypt.hash('Admin@123', 10);
  const admin1 = await prisma.admin.create({
    data: {
      name: 'Demo University Admin',
      registrationNumber: 'ADMIN001',
      email: 'admin@demouniversity.edu',
      password: admin1Password,
      universityId: university1.id,
    },
  });

  const admin2Password = await bcrypt.hash('Admin@123', 10);
  const admin2 = await prisma.admin.create({
    data: {
      name: 'Test Institute Admin',
      registrationNumber: 'ADMIN002',
      email: 'admin@testinstitute.edu',
      password: admin2Password,
      universityId: university2.id,
    },
  });

  console.log('✅ Admins created');

  // Create teachers for Demo University
  const teacher1Password = await bcrypt.hash('Teacher@123', 10);
  const teacher1 = await prisma.teacher.create({
    data: {
      name: 'Dr. John Smith',
      employeeId: 'T001',
      registrationNumber: 'DU-T001',
      email: 'john.smith@demouniversity.edu',
      password: teacher1Password,
      department: 'Computer Science',
      phone: '+1234567891',
      universityId: university1.id,
    },
  });

  const teacher2Password = await bcrypt.hash('Teacher@123', 10);
  const teacher2 = await prisma.teacher.create({
    data: {
      name: 'Dr. Sarah Johnson',
      employeeId: 'T002',
      registrationNumber: 'DU-T002',
      email: 'sarah.johnson@demouniversity.edu',
      password: teacher2Password,
      department: 'Mathematics',
      phone: '+1234567892',
      universityId: university1.id,
    },
  });

  // Create teacher for Test Institute
  const teacher3Password = await bcrypt.hash('Teacher@123', 10);
  const teacher3 = await prisma.teacher.create({
    data: {
      name: 'Prof. Michael Brown',
      employeeId: 'T101',
      registrationNumber: 'TI-T101',
      email: 'michael.brown@testinstitute.edu',
      password: teacher3Password,
      department: 'Physics',
      phone: '+1987654322',
      universityId: university2.id,
    },
  });

  console.log('✅ Teachers created');

  // Create students for Demo University
  const student1Password = await bcrypt.hash('Student@123', 10);
  const student1 = await prisma.student.create({
    data: {
      name: 'Alice Williams',
      registrationNumber: 'DU-S001',
      email: 'alice.williams@demouniversity.edu',
      password: student1Password,
      department: 'Computer Science',
      semester: '3rd Semester',
      phone: '+1234567893',
      universityId: university1.id,
    },
  });

  const student2Password = await bcrypt.hash('Student@123', 10);
  const student2 = await prisma.student.create({
    data: {
      name: 'Bob Davis',
      registrationNumber: 'DU-S002',
      email: 'bob.davis@demouniversity.edu',
      password: student2Password,
      department: 'Computer Science',
      semester: '3rd Semester',
      phone: '+1234567894',
      universityId: university1.id,
    },
  });

  // Create students for Test Institute
  const student3Password = await bcrypt.hash('Student@123', 10);
  const student3 = await prisma.student.create({
    data: {
      name: 'Emily Chen',
      registrationNumber: 'TI-S101',
      email: 'emily.chen@testinstitute.edu',
      password: student3Password,
      department: 'Physics',
      semester: '2nd Semester',
      phone: '+1987654323',
      universityId: university2.id,
    },
  });

  console.log('✅ Students created');

  // Create classes for Demo University
  const class1 = await prisma.class.create({
    data: {
      name: 'Introduction to Programming',
      subject: 'Computer Science',
      code: 'CS101',
      schedule: {
        day: 'Monday',
        time: '10:00 AM',
        duration: '2 hours',
      },
      teacherId: teacher1.id,
      universityId: university1.id,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: 'Calculus I',
      subject: 'Mathematics',
      code: 'MATH101',
      schedule: {
        day: 'Wednesday',
        time: '2:00 PM',
        duration: '1.5 hours',
      },
      teacherId: teacher2.id,
      universityId: university1.id,
    },
  });

  // Create class for Test Institute
  const class3 = await prisma.class.create({
    data: {
      name: 'Quantum Mechanics',
      subject: 'Physics',
      code: 'PHY301',
      schedule: {
        day: 'Tuesday',
        time: '11:00 AM',
        duration: '2 hours',
      },
      teacherId: teacher3.id,
      universityId: university2.id,
    },
  });

  console.log('✅ Classes created');

  // Create enrollments for Demo University students
  await prisma.enrollment.create({
    data: {
      studentId: student1.id,
      classId: class1.id,
      status: 'active',
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student2.id,
      classId: class1.id,
      status: 'active',
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student1.id,
      classId: class2.id,
      status: 'active',
    },
  });

  // Create enrollment for Test Institute student
  await prisma.enrollment.create({
    data: {
      studentId: student3.id,
      classId: class3.id,
      status: 'active',
    },
  });

  console.log('✅ Enrollments created');

  // Create some minutes (attendance records)
  await prisma.minute.create({
    data: {
      classId: class1.id,
      studentId: student1.id,
      teacherId: teacher1.id,
      date: new Date('2024-01-15'),
      duration: 120,
      topic: 'Variables and Data Types',
      description: 'Introduction to basic programming concepts',
    },
  });

  await prisma.minute.create({
    data: {
      classId: class1.id,
      studentId: student2.id,
      teacherId: teacher1.id,
      date: new Date('2024-01-15'),
      duration: 120,
      topic: 'Variables and Data Types',
      description: 'Introduction to basic programming concepts',
    },
  });

  console.log('✅ Minutes created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('\n=== Demo University ===');
  console.log('Admin: ADMIN001 / Admin@123');
  console.log('Teacher 1: DU-T001 / Teacher@123 (Dr. John Smith - CS)');
  console.log('Teacher 2: DU-T002 / Teacher@123 (Dr. Sarah Johnson - Math)');
  console.log('Student 1: DU-S001 / Student@123 (Alice Williams)');
  console.log('Student 2: DU-S002 / Student@123 (Bob Davis)');
  console.log('\n=== Test Institute ===');
  console.log('Admin: ADMIN002 / Admin@123');
  console.log('Teacher: TI-T101 / Teacher@123 (Prof. Michael Brown)');
  console.log('Student: TI-S101 / Student@123 (Emily Chen)');
  console.log('\n⚠️  Note: Each university has isolated data!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
