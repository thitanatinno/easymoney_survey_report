import express from 'express';
import { generateReport, downloadReport } from '../controllers/report.controller.js';

const router = express.Router();

// GET /generate/:uid/:id
// uid: Kobo asset UID
// id: Submission ID
// Returns: Excel file as buffer (streamed download)
router.get('/:uid/:id', generateReport);

// GET /generate/download/:uid/:id
// uid: Kobo asset UID
// id: Submission ID
// Returns: JSON response with file path (saves to disk)
router.get('/download/:uid/:id', downloadReport);

export default router;
