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
    getStudyPlans,
    downloadStudyPlanPdf,
    rateTutor,
    reportTutor,
    getReportCategories,
    getStudentProfile,
    updateStudentProfile,
} = require("../controllers/student.controller");

router.get("/catalog", verifyToken, isEstudiante, getTutorCatalog);
router.get("/catalog/search", verifyToken, isEstudiante, searchTutors);
router.get("/tutor/:idTutor/availability", verifyToken, isEstudiante, getTutorAvailability);
router.get("/sessions/active", verifyToken, isEstudiante, getActiveSessions);
router.get("/sessions/history", verifyToken, isEstudiante, getSessionHistory);
router.get("/report-categories", verifyToken, isEstudiante, getReportCategories);
router.get("/study-plans", verifyToken, isEstudiante, getStudyPlans);
router.get("/study-plans/:id/pdf", verifyToken, isEstudiante, downloadStudyPlanPdf);
router.post("/sessions", verifyToken, isEstudiante, createSession);
router.post("/sessions/:id/rating", verifyToken, isEstudiante, rateTutor);
router.post("/sessions/:id/report", verifyToken, isEstudiante, reportTutor);
router.patch("/sessions/:id/cancel", verifyToken, isEstudiante, cancelSession);
router.get("/profile", verifyToken, isEstudiante, getStudentProfile);
router.put("/profile", verifyToken, isEstudiante, updateStudentProfile);

module.exports = router;
