import express from 'express';
import { createActivitiesToSubject } from '../controller/subjectController.js';
import {
  createTeacherWithSubject,
  getAllSubjectTeacher,
  getSubjectTeacherById,
  createSubjectByTeacherId,
  loginTeacher,
  removeStudent
} from '../controller/teacherController.js';
import verifyToken from '../middleware/authMiddleware.js';
import { roleGuard } from '../middleware/roleguard.js';



const router = express.Router();

// ==========================
// ✅ API Routes
// ==========================

// Login route (must be ABOVE dynamic routes)
/// http://localhost:5001/api/teacher/login
router.post('/login', loginTeacher);

// Create teacher with subjects
// http://localhost:5001/api/teacher/
router.post('/', verifyToken, roleGuard('teacher'), createTeacherWithSubject);

// Create subject by teacher ID
// http://localhost:5001/api/teacher/:teacherId/subjects
router.post('/:teacherId/subjects', verifyToken, roleGuard('teacher'), createSubjectByTeacherId);

router.post('/:teacherId/activity', createActivitiesToSubject)

// routes/teacherRoutes.js
router.delete("/students", verifyToken, roleGuard('teacher'), removeStudent);

// Get all teachers with subjects
// http://localhost:5001/api/teacher/
router.get('/', verifyToken, roleGuard('teacher'), getAllSubjectTeacher);

// Get teacher by ID
router.get('/me',verifyToken, roleGuard('teacher'), getSubjectTeacherById)
// http://localhost:5001/api/teacher/:id
router.get('/:id', verifyToken, roleGuard('teacher'), getSubjectTeacherById);

export default router;
