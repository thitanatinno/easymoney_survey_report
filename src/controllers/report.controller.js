import { fetchSubmission, fetchAllSubmissions } from '../services/kobo.service.js';
import { generateExcelReport } from '../services/report.service.js';
import { saveExcelFile } from '../utils/excel/fileWriter.js';

/**
 * Controller for generating Excel report
 * GET /generate/:uid/:id
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

    // Step 1: Fetch submission from Kobo
    console.log('\n⏳ Step 1: Fetching submission from KoboToolbox...');
    const submission = await fetchSubmission(uid, id);

    // Step 2: Generate Excel report
    console.log('\n⏳ Step 2: Generating Excel report...');
    const buffer = await generateExcelReport(submission);

    // Step 3: Send as download
    const filename = `kobo_report_${uid}_${id}_${Date.now()}.xlsx`;
    console.log('\n✅ SUCCESS!');
    console.log(`📄 Report generated: ${filename}`);
    console.log(`📦 File size: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log('='.repeat(60) + '\n');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    console.log(`Report generated successfully: ${filename}`);
    res.send(buffer);

  } catch (error) {
    console.error('Error generating report:', error);
    next(error);
  }
}

/**
 * Controller for downloading Excel report to physical file
 * GET /download/:uid/:id
 */
export async function downloadReport(req, res, next) {
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
    console.log(`💾 DOWNLOADING REPORT TO FILE`);
    console.log(`Asset UID: ${uid}`);
    console.log(`Submission ID: ${id}`);
    console.log('='.repeat(60));

    // Step 1: Fetch submission from Kobo
    console.log('\n⏳ Step 1: Fetching submission from KoboToolbox...');
    const submission = await fetchSubmission(uid, id);

    // Step 2: Generate Excel report
    console.log('\n⏳ Step 2: Generating Excel report...');
    const buffer = await generateExcelReport(submission);

    // Step 3: Save to file
    const filename = `kobo_report_${uid}_${id}_${Date.now()}.xlsx`;
    console.log('\n⏳ Step 3: Saving file to disk...');
    const result = await saveExcelFile(buffer, filename);

    console.log('\n✅ SUCCESS!');
    console.log(`📄 Report saved: ${result.filename}`);
    console.log(`📁 File path: ${result.filePath}`);
    console.log(`📦 File size: ${result.sizeFormatted}`);
    console.log('='.repeat(60) + '\n');

    // Return JSON response
    res.status(200).json({
      success: true,
      message: 'Report saved successfully',
      filePath: result.filePath,
      filename: result.filename,
      size: result.sizeFormatted,
      timestamp: result.timestamp
    });

  } catch (error) {
    console.error('Error downloading report:', error);
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
