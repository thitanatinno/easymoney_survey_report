/**
 * ============================================================
 * TEMPLATE FORM - Data Normalization
 * ============================================================
 * 
 * This is a TEMPLATE FILE for creating new forms.
 * AI Code Generation Instructions:
 * 
 * 1. COPY this entire file to a new location:
 *    src/services/forms/{YOUR_FORM_NAME}/{your-form}.normalize.js
 * 
 * 2. ANALYZE the Kobo form structure:
 *    - Get the form's asset_content.json from KoboToolbox API
 *    - Identify all group names (e.g., group_abc123)
 *    - Identify all field paths within groups
 *    - Note which groups are repeat groups (arrays)
 * 
 * 3. REPLACE the field extraction logic below:
 *    - Update group names to match your Kobo form
 *    - Update field paths to match your Kobo form
 *    - Keep semantic output names (e.g., 'projectName', 'siteName')
 *    - Preserve the structure: sections + repeat groups + attachments
 * 
 * 4. OUTPUT STRUCTURE:
 *    Return an object with:
 *    - meta: { id, uuid, submissionTime, status, ... }
 *    - {sectionName}: { field1, field2, ... } for each logical section
 *    - {repeatGroupName}: [ { field1, field2, ... }, ... ] for repeat groups
 *    - attachments: array of attachment objects
 * 
 * ============================================================
 */

import { extractMeta, extractAttachments } from '../../../utils/fieldExtractor.js';

/**
 * Normalize template form submission
 * 
 * @param {Object} submission - Raw Kobo submission
 * @returns {Object} - Normalized data structure
 * 
 * AI INSTRUCTION: Replace this entire function body with your form-specific extraction logic
 */
export function normalize(submission) {
  console.log('\n🔄 NORMALIZING TEMPLATE FORM SUBMISSION...');
  console.log('Submission keys:', Object.keys(submission));
  
  // ============================================================
  // STEP 1: Extract meta fields (ALWAYS THE SAME FOR ALL FORMS)
  // ============================================================
  const meta = extractMeta(submission);

  // ============================================================
  // STEP 2: Extract simple sections (single groups)
  // AI INSTRUCTION: Replace group names and field paths below
  // ============================================================
  
  // Example Section 1: Basic Information
  // REPLACE 'group_xyz123' with your actual group name
  const basicInfo = {
    // REPLACE field paths below with your actual field paths from Kobo
    // Format: fieldName: submission['group_name/field_id'] || '',
    
    field1: submission['group_xyz123/text_field1'] || '',
    field2: submission['group_xyz123/text_field2'] || '',
    field3: submission['group_xyz123/date_field3'] || '',
    // ... add more fields as needed
  };

  // Example Section 2: Details
  // REPLACE 'group_abc456' with your actual group name
  const details = {
    field1: submission['group_abc456/field_a'] || '',
    field2: submission['group_abc456/field_b'] || '',
    // ... add more fields as needed
  };

  // ============================================================
  // STEP 3: Extract repeat groups (arrays)
  // AI INSTRUCTION: For each repeat group in your Kobo form
  // ============================================================
  
  // Example Repeat Group 1
  // REPLACE 'group_repeat_def789' with your actual repeat group name
  const items = [];
  if (submission['group_repeat_def789'] && Array.isArray(submission['group_repeat_def789'])) {
    submission['group_repeat_def789'].forEach((item, index) => {
      items.push({
        index,
        // REPLACE field paths below with your actual field paths
        itemField1: item['group_repeat_def789/item_field1'] || '',
        itemField2: item['group_repeat_def789/item_field2'] || '',
        // ... add more fields as needed
      });
    });
  }

  // Example Nested Repeat Group (if you have repeats within repeats)
  // REPLACE 'group_parent/group_child_repeat' with your actual path
  const nestedItems = [];
  if (submission['group_parent/group_child_repeat'] && Array.isArray(submission['group_parent/group_child_repeat'])) {
    nestedItems = submission['group_parent/group_child_repeat'].map((item, index) => ({
      index,
      nestedField1: item['group_parent/group_child_repeat/field1'] || '',
      nestedField2: item['group_parent/group_child_repeat/field2'] || '',
      // ... add more fields as needed
    }));
  }

  // ============================================================
  // STEP 4: Extract attachments (ALWAYS THE SAME FOR ALL FORMS)
  // ============================================================
  const attachments = extractAttachments(submission);

  // ============================================================
  // STEP 5: Assemble normalized data structure
  // AI INSTRUCTION: Include all sections and arrays you extracted above
  // ============================================================
  const normalized = {
    meta,
    basicInfo,    // REPLACE with your section names
    details,      // REPLACE with your section names
    items,        // REPLACE with your repeat group names
    nestedItems,  // REPLACE with your repeat group names (if applicable)
    attachments
  };
  
  // ============================================================
  // STEP 6: Log summary (helpful for debugging)
  // AI INSTRUCTION: Update log messages to match your sections
  // ============================================================
  console.log('\n✅ TEMPLATE FORM - NORMALIZED DATA:');
  console.log('- Meta fields:', Object.keys(meta));
  console.log('- Basic info:', Object.keys(basicInfo));
  console.log('- Details:', Object.keys(details));
  console.log('- Items count:', items.length);
  console.log('- Nested items count:', nestedItems.length);
  console.log('- Attachments count:', attachments.length);
  
  return normalized;
}

/**
 * ============================================================
 * EXAMPLE: How to use extractFields utility (optional)
 * ============================================================
 * 
 * Instead of manually extracting each field, you can use:
 * 
 * import { extractFields, extractRepeatGroup } from '../../../utils/fieldExtractor.js';
 * 
 * const basicInfo = extractFields(submission, {
 *   field1: 'group_xyz123/text_field1',
 *   field2: 'group_xyz123/text_field2',
 *   field3: 'group_xyz123/date_field3'
 * });
 * 
 * const items = extractRepeatGroup(
 *   submission,
 *   'group_repeat_def789',
 *   (item, index, groupPath) => ({
 *     index,
 *     itemField1: item[`${groupPath}/item_field1`] || '',
 *     itemField2: item[`${groupPath}/item_field2`] || ''
 *   })
 * );
 * 
 * ============================================================
 */
