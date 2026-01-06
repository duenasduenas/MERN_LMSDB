import express from 'express';
import upload from '../middleware/upload.js';
import { getAllSubjects, deleteSubject, addStudentToSubject, getSubjectById, editSubject, toggleEnrollement, uploadLesson } from '../controller/subjectController.js';
import { getActivityById } from '../controller/activityController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { submitActivity } from '../controller/submissionController.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = express.Router();

router.get('/activity', getAllSubjects)
router.put('/toggle-enroll', toggleEnrollement)
router.delete('/:id',deleteSubject)
router.put("/:id", editSubject)
router.get('/:id', getSubjectById)
router.get('/', getAllSubjects);

// Activity Routes
router.post('/submit-activity/:activityId', verifyToken, roleGuard('student'), submitActivity)
router.get('/activity', getAllSubjects)
router.get('/activity/:activityId', getActivityById)

router.post('/add-student', verifyToken, addStudentToSubject)

// Upload Lesson Route
router.post('/upload-lesson/:subjectId', verifyToken, roleGuard('teacher'), upload.array("files"), uploadLesson)




export default router;