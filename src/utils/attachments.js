/**
 * Builds attachment maps from _attachments array
 * Creates two-layer mapping: by xPath and by filename
 * 
 * @param {Array} attachments - _attachments array from submission
 * @returns {Object} - { byXPath, byFilename }
 */
export function buildAttachmentMaps(attachments) {
  const byXPath = {};
  const byFilename = {};
  const byBasename = {};

  if (!attachments || !Array.isArray(attachments)) {
    return { byXPath, byFilename, byBasename };
  }

  attachments.forEach(attachment => {
    const { filename, download_url, download_medium_url, download_small_url, question_xpath, media_file_basename } = attachment;
    const url = download_medium_url || download_small_url || download_url;

    // Map by xPath (handles repeat groups with indices)
    if (question_xpath) {
      byXPath[question_xpath] = {
        filename,
        url,
        xpath: question_xpath
      };
    }

    // Map by filename (fallback)
    if (filename) {
      byFilename[filename] = {
        filename,
        url,
        xpath: question_xpath
      };
    }

    if (media_file_basename) {
      byBasename[media_file_basename] = {
        filename: media_file_basename,
        url,
        xpath: question_xpath
      };
    }
  });

  return { byXPath, byFilename, byBasename };
}

/**
 * Resolves attachment for a given field value and context
 * 
 * @param {string} fieldValue - Field value (usually filename)
 * @param {string} xPath - Question xPath if known
 * @param {Object} attachmentMaps - Maps from buildAttachmentMaps
 * @returns {Object|null} - Attachment object or null
 */
export function resolveAttachment(fieldValue, xPath, attachmentMaps) {
  if (!fieldValue) return null;

  const { byXPath, byFilename, byBasename } = attachmentMaps;

  // Priority 1: Try exact xPath match (best for repeats)
  if (xPath && byXPath[xPath]) {
    return byXPath[xPath];
  }

  // Priority 2: Try filename match
  if (byFilename[fieldValue]) {
    return byFilename[fieldValue];
  }

  if (byBasename && byBasename[fieldValue]) {
    return byBasename[fieldValue];
  }

  return null;
}

/**
 * Builds xPath for a field in a repeat group
 * Example: buildRepeatXPath('group_ns6fp26', 0, 'image_ki1nl22') => 'group_ns6fp26[0]/image_ki1nl22'
 * 
 * @param {string} groupName - Repeat group name
 * @param {number} index - Item index in repeat
 * @param {string} fieldName - Field name
 * @returns {string} - Constructed xPath
 */
export function buildRepeatXPath(groupName, index, fieldName) {
  return `${groupName}[${index + 1}]/${fieldName}`;
}
