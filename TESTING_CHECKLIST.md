# 🧪 Pre-Deployment Testing Checklist

## Test Date: ___________
## Tester: ___________

---

## ✅ Backend API Tests (http://localhost:5000)

### 1. Health Check
- [ ] **Endpoint:** GET /health
- [ ] **Expected:** `{"status":"ok","message":"Smart Classroom API is running"}`
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 2. Student Login
- [ ] **Endpoint:** POST /api/auth/login
- [ ] **Body:** `{"registrationNumber":"DU-S001","password":"password123"}`
- [ ] **Expected:** JWT token + user object (type: student)
- [ ] **Verify:** User has `_id`, `name`, `department`, `university`
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 3. Teacher Login
- [ ] **Endpoint:** POST /api/auth/login
- [ ] **Body:** `{"registrationNumber":"DU-T001","password":"password123"}`
- [ ] **Expected:** JWT token + user object (type: teacher)
- [ ] **Verify:** User has `employeeId`, `department`
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 4. Admin Login
- [ ] **Endpoint:** POST /api/auth/admin/login
- [ ] **Body:** `{"username":"ADMIN001","password":"password123"}`
- [ ] **Expected:** JWT token + admin object
- [ ] **Verify:** Admin has `universityId`, `type`
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 5. Get Current User (Protected Route)
- [ ] **Endpoint:** GET /api/auth/me
- [ ] **Headers:** `Authorization: Bearer <token>`
- [ ] **Expected:** Current user object
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 6. List Universities
- [ ] **Endpoint:** GET /api/universities
- [ ] **Expected:** Array of 2 universities (Demo University, Test Institute)
- [ ] **Verify:** Each has teacher/student/class counts
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 7. List Classes (Student)
- [ ] **Endpoint:** GET /api/classes
- [ ] **Headers:** `Authorization: Bearer <student_token>`
- [ ] **Expected:** `{enrolledClasses: [], availableClasses: []}`
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 8. List Classes (Teacher)
- [ ] **Endpoint:** GET /api/classes
- [ ] **Headers:** `Authorization: Bearer <teacher_token>`
- [ ] **Expected:** Array of teacher's classes
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 9. Get Class Details
- [ ] **Endpoint:** GET /api/classes/:id
- [ ] **Headers:** `Authorization: Bearer <token>`
- [ ] **Expected:** Class with enrollments and joinRequests
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 10. Join Class Request (Student)
- [ ] **Endpoint:** POST /api/classes/:id/join
- [ ] **Headers:** `Authorization: Bearer <student_token>`
- [ ] **Expected:** Join request created with status "pending"
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

---

## 🌐 Frontend Tests (http://localhost:3000)

### 1. Homepage Load
- [ ] **URL:** http://localhost:3000
- [ ] **Expected:** Landing page or redirect to /signin
- [ ] **Verify:** No console errors
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 2. Student Sign In Page
- [ ] **URL:** http://localhost:3000/signin
- [ ] **Expected:** Sign in form with registration number field
- [ ] **Verify:** Form validation works
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 3. Student Login Flow
- [ ] **Action:** Enter DU-S001 / password123
- [ ] **Expected:** Redirect to /student/dashboard
- [ ] **Verify:** Dashboard shows student name and university
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 4. Student Classes View
- [ ] **URL:** http://localhost:3000/student/classes
- [ ] **Expected:** List of enrolled and available classes
- [ ] **Verify:** Can see class details
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 5. Student Minutes History
- [ ] **URL:** http://localhost:3000/student/minutes
- [ ] **Expected:** List of attendance records
- [ ] **Verify:** Shows date, class, duration
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 6. Student Logout
- [ ] **Action:** Click logout
- [ ] **Expected:** Redirect to /signin, token cleared
- [ ] **Verify:** Cannot access protected routes
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 7. Teacher Login Flow
- [ ] **Action:** Enter DU-T001 / password123
- [ ] **Expected:** Redirect to /teacher/dashboard
- [ ] **Verify:** Dashboard shows teacher's classes
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 8. Teacher View Classes
- [ ] **URL:** http://localhost:3000/teacher/classes
- [ ] **Expected:** List of teacher's classes
- [ ] **Verify:** Shows enrollment count
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 9. Teacher View Students
- [ ] **Action:** Click on a class
- [ ] **Expected:** See enrolled students list
- [ ] **Verify:** Can view student details
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 10. Teacher Add Minutes
- [ ] **Action:** Go to class → Add Minutes
- [ ] **Expected:** Form to add attendance
- [ ] **Verify:** Can select student, date, duration
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 11. Admin Login Page
- [ ] **URL:** http://localhost:3000/admin
- [ ] **Expected:** Admin login form
- [ ] **Verify:** Different UI from student/teacher
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 12. Admin Login Flow
- [ ] **Action:** Enter ADMIN001 / password123
- [ ] **Expected:** Redirect to admin dashboard
- [ ] **Verify:** Shows university stats
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 13. Admin View Universities
- [ ] **URL:** Admin dashboard
- [ ] **Expected:** List of universities with stats
- [ ] **Verify:** Shows teacher/student/class counts
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 14. Admin View Users
- [ ] **Action:** Navigate to users section
- [ ] **Expected:** List of teachers and students
- [ ] **Verify:** Filtered by university
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

### 15. Responsive Design
- [ ] **Action:** Resize browser window
- [ ] **Expected:** UI adapts to mobile/tablet/desktop
- [ ] **Verify:** All features accessible on mobile
- [ ] **Status:** Pass / Fail
- [ ] **Notes:** ___________

---

## 🔒 Security Tests

### 1. Unauthorized Access (No Token)
- [ ] **Test:** Access /api/auth/me without token
- [ ] **Expected:** 401 Unauthorized
- [ ] **Status:** Pass / Fail

### 2. Invalid Token
- [ ] **Test:** Access /api/auth/me with fake token
- [ ] **Expected:** 403 Forbidden
- [ ] **Status:** Pass / Fail

### 3. Cross-University Access
- [ ] **Test:** Student from DU tries to access TI classes
- [ ] **Expected:** 403 Access denied
- [ ] **Status:** Pass / Fail

### 4. Password Security
- [ ] **Test:** Check MongoDB - passwords are hashed
- [ ] **Expected:** Passwords start with $2a$ or $2b$
- [ ] **Status:** Pass / Fail

### 5. CORS Protection
- [ ] **Test:** Try API call from different origin
- [ ] **Expected:** CORS error (in production)
- [ ] **Status:** Pass / Fail

---

## 📊 Database Tests

### 1. MongoDB Connection
- [ ] **Test:** Backend connects to MongoDB Atlas
- [ ] **Expected:** "✅ MongoDB connected successfully" in logs
- [ ] **Status:** Pass / Fail

### 2. Data Integrity
- [ ] **Test:** Check MongoDB Atlas → Browse Collections
- [ ] **Expected:** 8 collections with seeded data
- [ ] **Verify:** universities (2), admins (2), teachers (3), students (4), classes (3)
- [ ] **Status:** Pass / Fail

### 3. Relationships
- [ ] **Test:** Check enrollments collection
- [ ] **Expected:** studentId and classId references valid
- [ ] **Status:** Pass / Fail

### 4. Indexes
- [ ] **Test:** Check index creation in MongoDB
- [ ] **Expected:** Indexes on registrationNumber, email, etc.
- [ ] **Status:** Pass / Fail

---

## 🚀 Pre-Deployment Checklist

### Environment Variables
- [ ] Backend .env has MONGODB_URI
- [ ] Backend .env has JWT_SECRET
- [ ] Frontend .env has REACT_APP_API_URL
- [ ] All secrets are secure (not default values)

### Code Quality
- [ ] No console.errors in production code
- [ ] All API endpoints return proper error messages
- [ ] Frontend handles API errors gracefully
- [ ] No hardcoded credentials in code

### Documentation
- [ ] README.md is up to date
- [ ] API endpoints are documented
- [ ] Environment variables are documented
- [ ] Deployment guide is complete

### Git Repository
- [ ] All changes committed
- [ ] .env files are in .gitignore
- [ ] No sensitive data in git history
- [ ] Repository is pushed to GitHub

### Vercel Configuration
- [ ] server/vercel.json exists and correct
- [ ] package.json has correct start scripts
- [ ] Node version specified in package.json
- [ ] Build commands are correct

---

## 📝 Test Results Summary

**Total Tests:** ___________
**Passed:** ___________
**Failed:** ___________
**Pass Rate:** ___________%

### Critical Issues Found:
1. ___________
2. ___________
3. ___________

### Minor Issues Found:
1. ___________
2. ___________
3. ___________

### Recommended Actions Before Deployment:
1. ___________
2. ___________
3. ___________

---

## ✅ Deployment Approval

**Ready for Production Deployment:** YES / NO

**Approved By:** ___________
**Date:** ___________
**Signature:** ___________

---

## 📞 Quick Test Commands

### Backend Tests (PowerShell):
```powershell
# Health Check
Invoke-RestMethod -Uri "http://localhost:5000/health"

# Student Login
$body = @{registrationNumber='DU-S001';password='password123'} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
$token = $response.token
echo $token

# Get Current User
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Headers @{Authorization="Bearer $token"}

# List Classes
Invoke-RestMethod -Uri "http://localhost:5000/api/classes" -Headers @{Authorization="Bearer $token"}
```

### Frontend Tests:
1. Open http://localhost:3000
2. Login with test credentials
3. Navigate through all pages
4. Check browser console for errors

---

**Note:** Complete all tests before deploying to production!
