/**
 * Field extraction utilities for normalizing Kobo submissions
 * Reduces repetitive field extraction code
 */

/**
 * Safely extract field from submission with default value
 * @param {Object} submission - Raw submission
 * @param {string} path - Field path (e.g., 'group_hh1ii99/text_aa8ps42')
 * @param {*} defaultValue - Default value if field not found
 * @returns {*} - Field value or default
 */
export function extractField(submission, path, defaultValue = '') {
  return submission[path] || defaultValue;
}

/**
 * Extract multiple fields into object
 * @param {Object} submission - Raw submission
 * @param {Object} mapping - { outputKey: 'path/to/field' }
 * @returns {Object} - Extracted fields
 */
export function extractFields(submission, mapping) {
  const result = {};
  for (const [key, path] of Object.entries(mapping)) {
    result[key] = submission[path] || '';
  }
  return result;
}

/**
 * Extract repeat group as array
 * @param {Object} submission - Raw submission
 * @param {string} groupPath - Path to repeat group
 * @param {Function} mapper - Function to transform each item (item, index, groupPath) => {}
 * @returns {Array} - Extracted array
 */
export function extractRepeatGroup(submission, groupPath, mapper) {
  if (!submission[groupPath] || !Array.isArray(submission[groupPath])) {
    return [];
  }
  
  return submission[groupPath].map((item, index) => {
    return mapper(item, index, groupPath);
  });
}

/**
 * Extract meta fields (common across all forms)
 * @param {Object} submission - Raw submission
 * @returns {Object} - Meta fields
 */
export function extractMeta(submission) {
  return {
    id: submission._id || '',
    uuid: submission._uuid || '',
    submissionTime: submission._submission_time || '',
    status: submission._status || '',
    geolocation: submission._geolocation || '',
    submittedBy: submission._submitted_by || ''
  };
}

/**
 * Extract attachments list (common across all forms)
 * @param {Object} submission - Raw submission
 * @returns {Array} - Attachments array
 */
export function extractAttachments(submission) {
  return submission._attachments || [];
}
