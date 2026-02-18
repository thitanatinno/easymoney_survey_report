/**
 * Solar Survey Form - Report Generation Service
 * Orchestrates Excel report generation for solar installation surveys
 * 
 * This uses the generic orchestrateReport utility with solar-specific configuration
 */

import { orchestrateReport } from '../../../utils/reportOrchestrator.js';
import { normalize } from './solar-survey.normalize.js';

// Import all sheet services
import { renderCoverSheet } from './sheets/solar-survey.cover.service.js';
import { renderContentSheet } from './sheets/solar-survey.content.service.js';
import { renderSheet1 } from './sheets/solar-survey.sheet1.service.js';
import { renderSheet2 } from './sheets/solar-survey.sheet2.service.js';
import { renderSheet3 } from './sheets/solar-survey.sheet3.service.js';
import { renderSheet4 } from './sheets/solar-survey.sheet4.service.js';
import { renderSheet5 } from './sheets/solar-survey.sheet5.service.js';
import { renderSheet6 } from './sheets/solar-survey.sheet6.service.js';

/**
 * Generate solar survey report
 * @param {string} uid - Kobo asset UID
 * @param {string} submissionId - Submission ID
 * @returns {Promise<Buffer>} - Excel file buffer
 */
export async function generateReport(uid, submissionId) {
  return await orchestrateReport(uid, submissionId, {
    formName: 'Solar Survey',
    normalize: normalize,
    sheets: [
      {
        name: 'Cover',
        generator: renderCoverSheet
      },
      {
        name: 'Contents',
        generator: renderContentSheet
      },
      {
        name: 'Content 1-2',
        generator: renderSheet1
      },
      {
        name: 'Content 3',
        generator: renderSheet2
      },
      {
        name: 'Content 4',
        generator: renderSheet3
      },
      {
        name: 'Content 5',
        generator: renderSheet6
      },
      {
        name: 'Content 6',
        generator: renderSheet4
      },
      {
        name: 'Content 7',
        generator: renderSheet5
      }
    ]
  });
}
