import express from 'express';
import { getAllSubjects, deleteSubject, addStudentToSubject, getSubjectById, editSubject } from '../controller/subjectController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/:id', getSubjectById)
router.get('/', getAllSubjects);
router.delete('/:id',deleteSubject)
router.put("/:id", editSubject)

router.post('/add-student', verifyToken, addStudentToSubject)

export default router;