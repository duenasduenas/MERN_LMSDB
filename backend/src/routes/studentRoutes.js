import express from 'express';
import { createStudent, getAllStudents, getStudentById,loginStudent,enrollStudent, unenrollSubject } from '../controller/studentController.js';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import { roleGuard } from '../middleware/roleguard.js';


const router = express.Router();

// student authentication
/// http://localhost:5001/api/student/login
router.post('/login', loginStudent)
router.post('/', verifyToken, roleGuard('student'), createStudent)
router.post('/enroll', verifyToken, authorizeRoles("student"),enrollStudent)
router.post('/unenroll', verifyToken, roleGuard('student'), unenrollSubject)
router.get('/me', verifyToken, roleGuard('student'), getStudentById)
router.get('/:id', verifyToken, roleGuard('student'), getStudentById)

router.get('/',  getAllStudents)







export default router;
