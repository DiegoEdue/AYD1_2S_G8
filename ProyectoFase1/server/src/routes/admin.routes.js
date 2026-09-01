const express = require('express');
const router = express.Router();
const {
  getPendingStudents,
  approveStudent,
  rejectStudent,
} = require('../controllers/admin');

router.get('/students/pending', getPendingStudents);

router.put('/students/:id/approve', approveStudent);

router.put('/students/:id/reject', rejectStudent);

module.exports = router;
