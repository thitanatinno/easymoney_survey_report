import { fetchSubmission, fetchAllSubmissions } from '../services/kobo.service.js';
import { routeToForm } from '../services/form.router.js';
import { normalizeSubmission } from '../utils/normalizeSubmission.js';

/**
 * Controller for generating Excel report
 * GET /generate/:uid/:id
 * 
 * Updated to use form routing system - automatically selects the correct form handler based on UID
 */
export async function generateReport(req, res, next) {
  try {
    const { uid, id } = req.params;

    // Validate parameters
    if (!uid || !id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Both uid and id parameters are required'
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 GENERATING REPORT`);
    console.log(`Asset UID: ${uid}`);
    console.log(`Submission ID: ${id}`);
    console.log('='.repeat(60));

    // Route to appropriate form handler and generate report
    console.log('\n⏳ Routing to form handler...');
    const buffer = await routeToForm(uid, id);

    // Extract site name for filename (form-agnostic approach)
    console.log('\n⏳ Preparing file download...');
    const submission = await fetchSubmission(uid, id);
    const normalizedData = normalizeSubmission(submission);
    const siteName = normalizedData.general?.siteName || normalizedData.basicInfo?.siteName || 'unknown_site';
    
    // Sanitize site name for safe filename (remove invalid characters)
    const sanitizedSiteName = siteName
      .replace(/[^a-zA-Z0-9_\-\s]/g, '') // Remove invalid chars
      .replace(/\s+/g, '_')              // Replace spaces with underscores
      .substring(0, 100);                // Limit length
    
    const filename = `report_${sanitizedSiteName}.xlsx`;

    // Send as direct browser download
    console.log('\n✅ SUCCESS!');
    console.log(`📄 Report generated: ${filename}`);
    console.log(`📦 File size: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log('='.repeat(60) + '\n');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);

  } catch (error) {
    console.error('Error generating report:', error);
    next(error);
  }
}

/**
 * Controller for getting list of sites from all submissions
 * GET /sites/:uid
 */
export async function getSiteList(req, res, next) {
  try {
    const { uid } = req.params;

    // Validate parameters
    if (!uid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Asset UID parameter is required'
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📋 FETCHING SITE LIST`);
    console.log(`Asset UID: ${uid}`);
    console.log('='.repeat(60));

    // Fetch all submissions from Kobo
    console.log('\n⏳ Fetching all submissions from KoboToolbox...');
    const response = await fetchAllSubmissions(uid);

    // Extract siteid and sitename from each submission
    const sites = response.results.map(submission => ({
      siteid: submission._id,
      sitename: submission['group_hh1ii99/text_pl66z95'] || null
    }));

    console.log('\n✅ SUCCESS!');
    console.log(`📊 Total sites: ${sites.length}`);
    console.log('='.repeat(60) + '\n');

    // Return JSON response
    res.status(200).json(sites);

  } catch (error) {
    console.error('Error fetching site list:', error);
    next(error);
  }
}
