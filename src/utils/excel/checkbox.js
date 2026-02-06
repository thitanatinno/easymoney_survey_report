/**
 * Checkbox utilities for Excel cells
 * Uses unicode characters: ☑ (checked) and ☐ (unchecked)
 */

/**
 * Sets a checkbox value in a cell
 * @param {Object} cell - ExcelJS cell object
 * @param {any} value - Value to interpret (yes/no, true/false, 1/0, etc.)
 * @param {string} label - Optional label text (e.g., "Yes", "PEA")
 */
export function setCheckbox(cell, value, label = '') {
  const isChecked = isValueChecked(value);
  const checkbox = isChecked ? '☑' : '☐';
  
  if (label) {
    cell.value = `${checkbox} ${label}`;
  } else {
    cell.value = checkbox;
  }
}

/**
 * Creates a checkbox list for multiple options
 * @param {Object} cell - ExcelJS cell object
 * @param {Array} options - Array of {label, value} objects
 */
export function setCheckboxList(cell, options) {
  const items = options.map(opt => {
    const checkbox = isValueChecked(opt.value) ? '☑' : '☐';
    return `${checkbox} ${opt.label}`;
  });
  
  cell.value = items.join('  ');
}

/**
 * Creates Yes/No checkbox pair
 * @param {Object} cell - ExcelJS cell object
 * @param {any} value - Value to check
 */
export function setYesNoCheckbox(cell, value) {
  const isYes = isValueChecked(value);
  cell.value = isYes ? '☑ Yes  ☐ No' : '☐ Yes  ☑ No';
}

/**
 * Interprets various value formats as checked/unchecked
 * @param {any} value - Value to interpret
 * @returns {boolean} - True if checked
 */
function isValueChecked(value) {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  
  const str = String(value).toLowerCase().trim();
  
  // True values
  if (['yes', 'true', '1', 'checked', 'y'].includes(str)) {
    return true;
  }
  
  // False values
  if (['no', 'false', '0', 'unchecked', 'n'].includes(str)) {
    return false;
  }
  
  // Default: if value exists and is not explicitly false, consider checked
  return Boolean(value);
}

/**
 * Creates checkbox for specific value comparison
 * @param {Object} cell - ExcelJS cell object
 * @param {string} actualValue - Actual value from form
 * @param {string} checkValue - Value to check against
 * @param {string} label - Label to display
 */
export function setCheckboxForValue(cell, actualValue, checkValue, label) {
  const isChecked = String(actualValue || '').toLowerCase() === String(checkValue).toLowerCase();
  const checkbox = isChecked ? '☑' : '☐';
  cell.value = `${checkbox} ${label}`;
}
