# Smart Classroom Backend

**Multi-Tenant Architecture with University Isolation**

This backend provides a secure, isolated database system where each university has completely separate data spaces. No data mixing between universities!

## 🏗️ Architecture

- **Node.js + Express**: REST API server
- **PostgreSQL**: Production database
- **Prisma ORM**: Type-safe database operations
- **bcryptjs**: Password hashing
- **JWT**: Secure authentication
- **Multi-Tenant**: Each university has isolated data via `universityId`

## 🔐 Security Features

✅ **Password Hashing** (bcrypt with 10 salt rounds)  
✅ **JWT Authentication** (24-hour token expiration)  
✅ **Rate Limiting** (5 attempts per 5 minutes)  
✅ **Row-Level Isolation** (University data separation)  
✅ **SQL Injection Protection** (Prisma ORM)  
✅ **XSS Protection** (Input validation)

## 📦 Installation

### Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/smartclassroom"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
SUPER_ADMIN_USERNAME="superadmin"
SUPER_ADMIN_PASSWORD="SuperAdmin@2024!ChangeThis"
PORT=5000
NODE_ENV=development
```

**⚠️ CRITICAL**: Change `JWT_SECRET` and super admin credentials before production!

### Step 3: Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations (creates tables)
npm run db:migrate

# Seed demo data (optional)
npm run db:seed
```

### Step 4: Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## 🗄️ Database Schema

### Multi-Tenant Isolation

Each university has completely isolated data:

```
University (Tenant)
├── Admins (University admins)
├── Teachers
├── Students
├── Classes
├── Enrollments
├── JoinRequests
└── Minutes (Attendance)
```

**Key Concept**: Every data record has `universityId` field ensuring complete isolation.

### Models

- **University**: Tenant container (subscription, limits, status)
- **Admin**: University administrators
- **Teacher**: Faculty members (uniqueId per university)
- **Student**: Enrolled students (uniqueId per university)
- **Class**: Courses (isolated per university)
- **Enrollment**: Student-Class relationships
- **JoinRequest**: Pending enrollment requests
- **Minute**: Attendance/session records

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/login
Body: { registrationNumber, password }
Response: { token, user }

POST /api/auth/admin/login
Body: { username, password }
Response: { token, type, university }

GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { user }
```

### Universities (Super Admin Only)

```http
GET /api/universities
Headers: Authorization: Bearer <token>
Response: [{ id, name, contactEmail, ... }]

POST /api/universities
Headers: Authorization: Bearer <token>
Body: { name, contactEmail, contactPhone, admin: {...} }
Response: { id, name, ... }
```

### Users (Admin Only)

```http
GET /api/users
Headers: Authorization: Bearer <token>
Response: { teachers, students, admins }

POST /api/users/teachers
Headers: Authorization: Bearer <token>
Body: { name, employeeId, registrationNumber, email, department, password }
Response: { id, name, type: 'teacher', ... }

POST /api/users/students
Headers: Authorization: Bearer <token>
Body: { name, registrationNumber, email, department, semester, password }
Response: { id, name, type: 'student', ... }

PUT /api/users/:userType/:id
Headers: Authorization: Bearer <token>
Body: { name, email, department, ... }
Response: { updated user }

POST /api/users/:userType/:id/reset-password
Headers: Authorization: Bearer <token>
Body: { newPassword }
Response: { message }

DELETE /api/users/:userType/:id
Headers: Authorization: Bearer <token>
Response: { message }
```

### Classes

```http
GET /api/classes
Headers: Authorization: Bearer <token>
Response: [{ id, name, subject, code, teacher, ... }]

GET /api/classes/:id
Headers: Authorization: Bearer <token>
Response: { id, name, enrollments, joinRequests, ... }

POST /api/classes
Headers: Authorization: Bearer <token>
Body: { name, subject, code, schedule }
Response: { id, name, code, ... }

PUT /api/classes/:id
Headers: Authorization: Bearer <token>
Body: { name, subject, schedule, isActive }
Response: { updated class }

DELETE /api/classes/:id
Headers: Authorization: Bearer <token>
Response: { message }

POST /api/classes/:id/join (Student only)
Headers: Authorization: Bearer <token>
Response: { joinRequest }

PUT /api/classes/:id/join-requests/:requestId (Teacher only)
Headers: Authorization: Bearer <token>
Body: { status: 'approved' | 'rejected' }
Response: { updated request }
```

## 🏢 Multi-Tenant How It Works

### Data Isolation

1. **University Creation** (Super Admin):
   ```javascript
   POST /api/universities
   {
     "name": "Harvard University",
     "contactEmail": "admin@harvard.edu",
     "admin": {
       "registrationNumber": "HARVARD-ADMIN",
       "password": "SecurePass@123"
     }
   }
   ```

2. **University Admin Creates Users**:
   - All created users get `universityId` automatically
   - Users can ONLY see data from their university
   - Example: Harvard students can't see MIT classes

3. **Database Query Filtering**:
   ```javascript
   // Every query is automatically filtered by universityId
   const classes = await prisma.class.findMany({
     where: { universityId: req.user.universityId } // Auto-filtered
   });
   ```

### Benefits

✅ **Complete Isolation**: No data leakage between universities  
✅ **Scalable**: Add unlimited universities  
✅ **Secure**: Row-level access control  
✅ **Simple**: Automatic filtering by universityId  

## 🧪 Testing

### Demo Credentials (After Seeding)

**Demo University**:
- Admin: `ADMIN001` / `Admin@123`
- Teacher: `DU-T001` / `Teacher@123`
- Student: `DU-S001` / `Student@123`

**Test Institute**:
- Admin: `ADMIN002` / `Admin@123`
- Teacher: `TI-T101` / `Teacher@123`
- Student: `TI-S101` / `Student@123`

### Test University Isolation

```bash
# 1. Login as Demo University student
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"registrationNumber": "DU-S001", "password": "Student@123"}'

# 2. Get classes (only sees Demo University classes)
curl http://localhost:5000/api/classes \
  -H "Authorization: Bearer <token>"

# 3. Login as Test Institute student
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"registrationNumber": "TI-S101", "password": "Student@123"}'

# 4. Get classes (only sees Test Institute classes)
curl http://localhost:5000/api/classes \
  -H "Authorization: Bearer <token>"
```

## 📊 Database Management

### Prisma Studio (GUI)

```bash
npm run db:studio
```

Opens browser at `http://localhost:5555` with visual database editor.

### Migrations

```bash
# Create new migration
npm run db:migrate

# Push schema without migration
npm run db:push

# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset
```

## 🚀 Production Deployment

### Environment Setup

1. **Database**: Use managed PostgreSQL (AWS RDS, Heroku Postgres, Supabase)
2. **Environment Variables**: Set all `.env` variables in hosting platform
3. **Build**: Run migrations before starting server

### Deployment Platforms

**Heroku**:
```bash
heroku create smartclassroom-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run npm run db:migrate
```

**Railway**:
```bash
railway init
railway add postgresql
railway up
railway run npm run db:migrate
```

**Vercel/Netlify**: Use serverless functions with Prisma Data Proxy

### Security Checklist

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Change super admin credentials
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS only for your frontend domain
- [ ] Use HTTPS (SSL/TLS)
- [ ] Enable database SSL connections
- [ ] Set up monitoring and logging
- [ ] Regular database backups

## 🔧 Development

### Project Structure

```
server/
├── index.js              # Main server file
├── package.json          # Dependencies
├── .env                  # Environment variables
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── client.js         # Prisma client
│   └── seed.js           # Demo data seeder
└── routes/
    ├── classes.js        # Class management
    └── users.js          # User management
```

### Adding New Features

1. **Update Schema**: Edit `prisma/schema.prisma`
2. **Create Migration**: Run `npm run db:migrate`
3. **Add Routes**: Create route file in `routes/`
4. **Register Routes**: Add to `index.js`
5. **Test**: Use Postman or curl

### Database Tips

- **Always include `universityId`** in where clauses
- **Use Prisma transactions** for multi-step operations
- **Index frequently queried fields** (already done in schema)
- **Use `include`** for eager loading relations
- **Validate data** before database operations

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check PostgreSQL is running
psql -U postgres

# Test connection string
npx prisma db pull
```

### Prisma Client Not Generated

```bash
npm run db:generate
```

### Migration Failed

```bash
# Reset and re-migrate
npx prisma migrate reset
npm run db:migrate
```

### Rate Limiting Issues

Clear rate limit storage (currently in-memory, resets on server restart).

For production, use Redis:
```javascript
// Replace Map with Redis
const redis = require('redis');
const client = redis.createClient();
```

## 📞 Support

For issues or questions:
1. Check this README
2. Review Prisma documentation: https://www.prisma.io/docs
3. Check server logs: `npm run dev`
4. Use Prisma Studio to inspect data: `npm run db:studio`

## 📝 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for educational institutions**
