import express from 'express';
import { createActivities, deleteActivity, editActivity } from '../controller/activityController.js';
import { createActivitiesToSubject } from '../controller/subjectController.js';
import {
  createTeacherWithSubject,
  getAllSubjectTeacher,
  getSubjectTeacherById,
  createSubjectByTeacherId,
  loginTeacher,
  removeStudent,
  unenrollSubject
} from '../controller/teacherController.js';
import verifyToken from '../middleware/authMiddleware.js';
import { roleGuard } from '../middleware/roleGuard.js';




const router = express.Router();

// ==========================
// ✅ API Routes
// ==========================

// Login route (must be ABOVE dynamic routes)
/// http://localhost:5001/api/teacher/login
router.post('/login', loginTeacher);

// Create teacher with subjects
// http://localhost:5001/api/teacher/
router.post('/', createTeacherWithSubject);




// Create subject by teacher ID
// http://localhost:5001/api/teacher/:teacherId/subjects
router.post('/:teacherId/subjects', verifyToken, roleGuard('teacher'), createSubjectByTeacherId);

router.post('/:teacherId/activity', createActivitiesToSubject)

// routes/teacherRoutes.js
router.delete("/student/unenroll", verifyToken, roleGuard('teacher'), removeStudent);

// Get all teachers with subjects
// http://localhost:5001/api/teacher/
router.get('/', verifyToken, roleGuard('teacher'), getAllSubjectTeacher);

// Get teacher by ID
// http://localhost:5001/api/teacher/:id
router.get('/:id', verifyToken, roleGuard('teacher'), getSubjectTeacherById);

router.post('/remove-subject', verifyToken, roleGuard('teacher'), unenrollSubject)

// Activty Routes
router.post('/:subjectId/create-activity', verifyToken, roleGuard('teacher'), createActivities)
router.put('/:id/edit-activity', verifyToken, roleGuard('teacher'), editActivity)
router.delete('/:activityId/delete-activity', verifyToken, roleGuard('teacher'), deleteActivity)

export default router;
