'use strict';
const router = require('express').Router();
const { readUser, updateUser } = require('../../controllers/userController');
const {
  readSubjectLines,
  readSubjectLineById,
  createSubjectLines,
  updateSubjectLineUseCount,
  updateSubjectLinePixels,
} = require('../../controllers/subjectLineController');
const { checkUserId, usageConditionalGate, checkPlanCancellation } = require('../../middlewares/userMiddleware');

router.get('/:id', checkUserId, readUser);
router.patch('/:id', checkUserId, updateUser);

router.get('/:id/subject-lines', checkUserId, readSubjectLines);
router.get('/:id/subject-lines/:subjectLineId', checkUserId, readSubjectLineById);
router.post('/:id/subject-lines', checkPlanCancellation, usageConditionalGate, createSubjectLines);
router.patch('/:id/subject-lines/use-count', checkUserId, updateSubjectLineUseCount);
router.patch('/:id/subject-lines/pixels', checkUserId, updateSubjectLinePixels);

module.exports = router;
