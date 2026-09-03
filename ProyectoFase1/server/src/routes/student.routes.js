const express = require("express");
const router = express.Router();
const { verifyToken, isEstudiante } = require("../middlewares/auth");
const {
    getTutorCatalog,
    getTutorAvailability,
    createSession,
    searchTutors,
    getActiveSessions,
    cancelSession,
    getSessionHistory,
    getStudentProfile,
    updateStudentProfile,
} = require("../controllers/student.controller");

router.get("/catalog", verifyToken, isEstudiante, getTutorCatalog);
router.get("/catalog/search", verifyToken, isEstudiante, searchTutors);
router.get("/tutor/:idTutor/availability", verifyToken, isEstudiante, getTutorAvailability);
router.get("/sessions/active", verifyToken, isEstudiante, getActiveSessions);
router.get("/sessions/history", verifyToken, isEstudiante, getSessionHistory);
router.post("/sessions", verifyToken, isEstudiante, createSession);
router.patch("/sessions/:id/cancel", verifyToken, isEstudiante, cancelSession);
router.get("/profile", verifyToken, isEstudiante, getStudentProfile);
router.put("/profile", verifyToken, isEstudiante, updateStudentProfile);

module.exports = router;
