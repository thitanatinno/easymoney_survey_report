/**
 * Form Router - Central dispatcher for form-specific report handlers
 * Routes requests to appropriate form modules based on Kobo asset UID
 * 
 * HOW TO ADD A NEW FORM:
 * 1. Create a new folder in src/services/forms/{form-name}/
 * 2. Implement {form-name}.normalize.js and {form-name}.report.service.js
 * 3. Import the report service at the top of this file
 * 4. Add an entry to FORM_REGISTRY with the Kobo asset UID
 */

import { generateReport as generateSolarSurveyReport } from './forms/solar-survey/solar-survey.report.service.js';
import { generateReport as generateTemplateReport } from './forms/template-form/template.report.service.js';

/**
 * Form Registry - Maps Kobo asset UIDs to form handlers
 * Add new forms here by importing their report service and adding to registry
 */
const FORM_REGISTRY = {
  /**
   * Solar Survey Form (Current Production Form)
   * IMPORTANT: Replace 'YOUR_SOLAR_SURVEY_UID_HERE' with actual Kobo asset UID
   * 
   * To find your UID:
   * 1. Go to KoboToolbox
   * 2. Open your form
   * 3. Look at the URL: .../forms/{UID}/...
   * 4. Or check the API endpoint you're using
   */
  'aj3WDbyQqWkw6qSrV2feVo': {
    name: 'Solar Survey',
    description: 'Installation inspection report for solar PV systems',
    handler: generateSolarSurveyReport
  },
  
  /**
   * Template Form (Placeholder for AI Code Generation)
   * This is a template/example for creating new forms
   * Replace 'YOUR_TEMPLATE_UID_HERE' with actual Kobo asset UID when ready
   */
  'YOUR_TEMPLATE_UID_HERE': {
    name: 'Template Form',
    description: 'Template placeholder for new form implementation',
    handler: generateTemplateReport
  }
  
  /**
   * ============================================================
   * ADD NEW FORMS BELOW THIS LINE
   * ============================================================
   * 
   * Example:
   * 
   * 'aKoboAssetUID12345': {
   *   name: 'Building Inspection',
   *   description: 'Building structural inspection report',
   *   handler: generateBuildingReport
   * },
   * 
   * Remember to import the handler at the top of this file:
   * import { generateReport as generateBuildingReport } from './forms/building-inspection/building.report.service.js';
   */
};

/**
 * Route request to appropriate form handler
 * @param {string} uid - Kobo asset UID
 * @param {string} submissionId - Submission ID
 * @returns {Promise<Buffer>} - Excel file buffer
 * @throws {Error} - If form UID not registered
 */
export async function routeToForm(uid, submissionId) {
  const formConfig = FORM_REGISTRY[uid];
  
  if (!formConfig) {
    const registeredUIDs = Object.keys(FORM_REGISTRY).filter(key => !key.startsWith('YOUR_'));
    const errorMessage = [
      `❌ Unknown form UID: ${uid}`,
      `No handler registered for this form.`,
      ``,
      registeredUIDs.length > 0 
        ? `Registered UIDs:\n${registeredUIDs.map(id => `  - ${id}: ${FORM_REGISTRY[id].name}`).join('\n')}`
        : `No forms registered yet. Please update FORM_REGISTRY in src/services/form.router.js`,
      ``,
      `To add this form:`,
      `1. Create form module in src/services/forms/{form-name}/`,
      `2. Add UID to FORM_REGISTRY in src/services/form.router.js`
    ].join('\n');
    
    throw new Error(errorMessage);
  }
  
  console.log(`\n🔀 FORM ROUTER - Routing to: ${formConfig.name}`);
  console.log(`   Description: ${formConfig.description}`);
  console.log(`   UID: ${uid}`);
  
  // Delegate to form-specific handler
  return await formConfig.handler(uid, submissionId);
}

/**
 * Get list of registered forms
 * Useful for debugging and API documentation
 * @returns {Array} - Array of registered form info
 */
export function getRegisteredForms() {
  return Object.entries(FORM_REGISTRY)
    .filter(([uid]) => !uid.startsWith('YOUR_'))
    .map(([uid, config]) => ({
      uid,
      name: config.name,
      description: config.description
    }));
}

export { FORM_REGISTRY };
