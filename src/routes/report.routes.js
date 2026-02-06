import express from 'express';
import { generateReport, getSiteList } from '../controllers/report.controller.js';

const router = express.Router();

// GET /generate/sites/:uid
// uid: Kobo asset UID
// Returns: JSON array of all sites with siteid and sitename
// NOTE: This route must come BEFORE /:uid/:id to avoid conflicts
router.get('/sites/:uid', getSiteList);

// GET /generate/:uid/:id
// uid: Kobo asset UID
// id: Submission ID
// Returns: Excel file as direct browser download with filename format: report_{siteName}.xlsx
router.get('/:uid/:id', generateReport);

export default router;
