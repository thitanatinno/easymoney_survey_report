/**
 * Reusable style definitions for Excel sheets
 */

export const THEME = {
  colors: {
    headerBg: 'FFD9E1F2',      // Light blue
    sectionBg: 'FFF2F2F2',     // Light gray
    borderColor: 'FF000000',    // Black
    white: 'FFFFFFFF'
  },
  fonts: {
    header: { size: 14, bold: true, name: 'Arial' },
    subheader: { size: 12, bold: true, name: 'Arial' },
    normal: { size: 11, name: 'Arial' },
    small: { size: 10, name: 'Arial' }
  }
};

export const BORDERS = {
  thick: {
    top: { style: 'thick', color: { argb: 'FF000000' } },
    left: { style: 'thick', color: { argb: 'FF000000' } },
    bottom: { style: 'thick', color: { argb: 'FF000000' } },
    right: { style: 'thick', color: { argb: 'FF000000' } }
  },
  thin: {
    top: { style: 'thin', color: { argb: 'FF000000' } },
    left: { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FF000000' } },
    right: { style: 'thin', color: { argb: 'FF000000' } }
  },
  none: {
    top: { style: 'none' },
    left: { style: 'none' },
    bottom: { style: 'none' },
    right: { style: 'none' }
  }
};

export const ALIGNMENT = {
  centerMiddle: { vertical: 'middle', horizontal: 'center' },
  leftMiddle: { vertical: 'middle', horizontal: 'left' },
  rightMiddle: { vertical: 'middle', horizontal: 'right' },
  topLeft: { vertical: 'top', horizontal: 'left' },
  topCenter: { vertical: 'top', horizontal: 'center' }
};

/**
 * Creates a header cell style
 */
export function headerStyle() {
  return {
    font: THEME.fonts.header,
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: THEME.colors.headerBg }
    },
    border: BORDERS.thin,
    alignment: ALIGNMENT.centerMiddle
  };
}

/**
 * Creates a normal cell style with border
 */
export function cellStyle() {
  return {
    font: THEME.fonts.normal,
    border: BORDERS.thin,
    alignment: ALIGNMENT.leftMiddle
  };
}

/**
 * Creates a section header style
 */
export function sectionHeaderStyle() {
  return {
    font: THEME.fonts.subheader,
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: THEME.colors.sectionBg }
    },
    border: BORDERS.thin,
    alignment: ALIGNMENT.leftMiddle
  };
}
