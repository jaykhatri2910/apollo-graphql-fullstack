const path = require('path');
const fs = require('fs');

// Resolve dependencies from backend to avoid redundant root dependencies
const backendDir = path.resolve(__dirname, '../backend');
const dotenv = require(path.join(backendDir, 'node_modules/dotenv'));
const mongoose = require(path.join(backendDir, 'node_modules/mongoose'));
const bcrypt = require(path.join(backendDir, 'node_modules/bcryptjs'));
const Employee = require(path.join(backendDir, 'src/models/Employee'));

// Load environment variables (checking root .env, then backend/.env)
const rootEnvPath = path.resolve(__dirname, '../.env');
const backendEnvPath = path.resolve(backendDir, '.env');

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hiring-test';
const isResetRequested = process.argv.includes('--reset') || process.env.RESET_DB === 'true';

const subjectsList = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English Literature',
  'World History',
  'Fine Arts',
];

const classesList = ['10A', '10B', '11A', '11B', '12A', '12B'];

const initialEmployeesData = [
  {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    age: 34,
    class: '10A',
    subjects: ['Mathematics', 'Physics'],
    attendance: 96,
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'David Chen',
    email: 'david.chen@example.com',
    age: 41,
    class: '11B',
    subjects: ['Computer Science', 'Mathematics'],
    attendance: 98,
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@example.com',
    age: 29,
    class: '12A',
    subjects: ['English Literature', 'World History'],
    attendance: 92,
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus.johnson@example.com',
    age: 38,
    class: '10B',
    subjects: ['Chemistry', 'Biology'],
    attendance: 88,
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    age: 32,
    class: '11A',
    subjects: ['Physics', 'Mathematics'],
    attendance: 95,
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    age: 45,
    class: '12B',
    subjects: ['Fine Arts', 'World History'],
    attendance: 85,
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ananya Patel',
    email: 'ananya.patel@example.com',
    age: 27,
    class: '10A',
    subjects: ['Computer Science'],
    attendance: 91,
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Robert Taylor',
    email: 'robert.taylor@example.com',
    age: 50,
    class: '11A',
    subjects: ['Chemistry'],
    attendance: 94,
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sophia Martinez',
    email: 'sophia.martinez@example.com',
    age: 31,
    class: '12A',
    subjects: ['Biology', 'Chemistry'],
    attendance: 89,
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Lucas Kim',
    email: 'lucas.kim@example.com',
    age: 36,
    class: '10B',
    subjects: ['Mathematics', 'Computer Science'],
    attendance: 97,
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
];

// Additional synthetic employee generator for scalable pagination testing
const generateAdditionalEmployees = (count, defaultHashedPassword) => {
  const generated = [];
  for (let i = 1; i <= count; i++) {
    const classVal = classesList[(i - 1) % classesList.length];
    const subCount = (i % 3) + 1;
    const subs = subjectsList.slice(i % 5, (i % 5) + subCount);
    generated.push({
      name: `Employee Demo ${i}`,
      email: `employee${i}@example.com`,
      age: 24 + (i % 35),
      class: classVal,
      subjects: subs.length ? subs : ['General Studies'],
      attendance: 75 + (i % 25),
      role: 'employee',
      password: defaultHashedPassword,
      avatar: `https://i.pravatar.cc/150?u=employee${i}`,
      date: new Date(Date.now() - i * 86400000 * 3),
    });
  }
  return generated;
};

async function seedDatabase() {
  console.log('--- Starting Database Seeding ---');

  let targetUri = MONGO_URI;
  try {
    console.log(`Connecting to: ${targetUri}`);
    await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 2500 });
    console.log('✓ Successfully connected to MongoDB.');
  } catch (initialErr) {
    if (targetUri.includes('//mongo:') || targetUri.includes('//mongo/')) {
      console.warn(`⚠ Could not connect to container host "${targetUri}".`);
      console.log('ℹ Attempting fallback to local MongoDB instance (mongodb://localhost:27017/hiring-test)...');
      targetUri = 'mongodb://localhost:27017/hiring-test';
      await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 3000 });
      console.log('✓ Successfully connected to local MongoDB.');
    } else {
      throw initialErr;
    }
  }

  try {

    if (isResetRequested) {
      console.log('⚠ Reset mode requested (--reset). Clearing existing employee records...');
      await Employee.deleteMany({});
      console.log('✓ Cleared existing records.');
    } else {
      console.log('ℹ Safe seed mode active (preserving existing data and upserting seed records).');
    }

    const defaultPassword = process.env.DEFAULT_SEED_PASSWORD || 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // 1. Seed or update Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminData = {
      name: 'System Admin',
      email: adminEmail,
      age: 38,
      class: 'Staff',
      subjects: ['Administration', 'Management'],
      attendance: 100,
      role: 'admin',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      date: new Date('2024-01-01T00:00:00.000Z'),
    };

    await Employee.findOneAndUpdate(
      { email: adminEmail },
      { $set: adminData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Admin account prepared: ${adminEmail}`);

    // 2. Seed realistic employee profiles
    let upsertedCount = 0;
    for (const emp of initialEmployeesData) {
      const payload = {
        ...emp,
        password: hashedPassword,
        date: emp.date || new Date(),
      };
      await Employee.findOneAndUpdate(
        { email: emp.email },
        { $set: payload },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      upsertedCount++;
    }

    // 3. Seed additional paginated records
    const extraRecords = generateAdditionalEmployees(20, hashedPassword);
    for (const emp of extraRecords) {
      await Employee.findOneAndUpdate(
        { email: emp.email },
        { $set: emp },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      upsertedCount++;
    }

    const totalCount = await Employee.countDocuments();
    console.log(`✓ Seeding finished. Processed ${upsertedCount + 1} records. Total employees in DB: ${totalCount}`);
    console.log('\nSeed Credentials:');
    console.log(`  Admin:    ${adminEmail} / ${defaultPassword}`);
    console.log(`  Employee: sarah.jenkins@example.com / ${defaultPassword}`);

    await mongoose.disconnect();
    console.log('✓ MongoDB connection cleanly closed.');
    process.exit(0);
  } catch (err) {
    console.error('✖ Database seeding error:', err);
    try {
      await mongoose.disconnect();
    } catch (_) {
      // ignore disconnect error on failure
    }
    process.exit(1);
  }
}

seedDatabase();
