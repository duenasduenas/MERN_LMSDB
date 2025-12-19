import express from 'express';
import { getAllSubjects, deleteSubject, addStudentToSubject, getSubjectById, editSubject, toggleEnrollement } from '../controller/subjectController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/activity', getAllSubjects)
router.put('/toggle-enroll', toggleEnrollement)
router.delete('/:id',deleteSubject)
router.put("/:id", editSubject)
router.get('/:id', getSubjectById)
router.get('/', getAllSubjects);

router.get('/activity', getAllSubjects)

router.post('/add-student', verifyToken, addStudentToSubject)

export default router;