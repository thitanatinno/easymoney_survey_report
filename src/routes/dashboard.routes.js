import express from 'express';
import { renderDashboard } from '../controllers/dashboard.controller.js';

const router = express.Router();

// GET /dashboard/:uid
// uid: Kobo asset UID
// Returns: HTML dashboard page
router.get('/:uid', renderDashboard);

export default router;
