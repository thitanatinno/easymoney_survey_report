# Multi-Form System - Guide for Adding New Forms

This system supports multiple KoboToolbox forms, each with its own Excel report layout. Each form is isolated in its own module for easy maintenance.

## Quick Start: Adding a New Form

### Step 1: Get Your Kobo Form Information

1. **Get the Asset UID:**
   - Go to KoboToolbox
   - Open your form
   - Find the UID in the URL or API endpoint

2. **Get the Form Structure:**
   - Fetch `asset_content.json` from Kobo API:
     ```bash
     curl -H "Authorization: Token YOUR_TOKEN" \
       https://kf.kobotoolbox.org/api/v2/assets/YOUR_UID/
     ```
   - Note all group names (e.g., `group_abc123`)
   - Note all field IDs within groups
   - Identify which groups are repeat groups (arrays)

### Step 2: Create Form Module

Create a new folder structure:

```
src/services/forms/YOUR-FORM-NAME/
├── your-form.normalize.js
├── your-form.report.service.js
└── sheets/
    ├── your-form.sheet1.service.js
    ├── your-form.sheet2.service.js
    └── ...
```

### Step 3: Copy Template Files

**Copy and customize these template files:**

1. **Normalization:**
   - Copy: `src/services/forms/template-form/template.normalize.js`
   - To: `src/services/forms/YOUR-FORM-NAME/your-form.normalize.js`
   - Update all group names and field paths to match your Kobo form

2. **Report Service:**
   - Copy: `src/services/forms/template-form/template.report.service.js`
   - To: `src/services/forms/YOUR-FORM-NAME/your-form.report.service.js`
   - Update sheet names and imports

3. **Sheet Services:**
   - Copy: `src/services/forms/template-form/sheets/template.sheet1.service.js`
   - Create one file per Excel sheet you want
   - Implement rendering logic using utilities

### Step 4: Register Form

**Update `src/services/form.router.js`:**

```javascript
// 1. Import your report service
import { generateReport as generateYourFormReport } from './forms/your-form-name/your-form.report.service.js';

// 2. Add to FORM_REGISTRY
const FORM_REGISTRY = {
  // ... existing forms ...
  
  'aYourKoboUID12345': {
    name: 'Your Form Name',
    description: 'Brief description of the form',
    handler: generateYourFormReport
  }
};
```

### Step 5: Test

```bash
# Test the API endpoint
curl http://localhost:3000/generate/aYourKoboUID12345/SUBMISSION_ID

# Should download an Excel file
```

---

## Architecture Overview

```
API Request
    ↓
form.router.js - Detects UID, routes to correct form
    ↓
forms/
  ├── solar-survey/          # Current production form (example)
  │   ├── solar-survey.normalize.js
  │   ├── solar-survey.report.service.js
  │   └── (uses existing sheet services)
  │
  ├── your-form-name/        # Your new form
  │   ├── your-form.normalize.js
  │   ├── your-form.report.service.js
  │   └── sheets/
  │       ├── your-form.sheet1.service.js
  │       └── ...
  │
  └── template-form/         # Template for AI/new forms
      └── ...
```

---

## Available Utilities

### Data Extraction (`src/utils/fieldExtractor.js`)

```javascript
import { extractFields, extractRepeatGroup, extractMeta } from '../../../utils/fieldExtractor.js';

// Extract multiple fields at once
const section = extractFields(submission, {
  field1: 'group_abc/text_123',
  field2: 'group_abc/date_456'
});

// Extract repeat groups
const items = extractRepeatGroup(
  submission,
  'group_repeat_xyz',
  (item, index, groupPath) => ({
    index,
    name: item[`${groupPath}/name`] || ''
  })
);
```

### Excel Rendering (`src/utils/excel/sectionRenderer.js`)

```javascript
import { 
  renderSectionHeader, 
  renderLabelValueRows, 
  renderTable 
} from '../../../../utils/excel/sectionRenderer.js';

// Render section header
currentRow = renderSectionHeader(worksheet, currentRow, 'Section Title');

// Render label-value pairs
currentRow = renderLabelValueRows(worksheet, currentRow, [
  ['Label 1', data.field1],
  ['Label 2', data.field2]
]);

// Render table
currentRow = renderTable(worksheet, currentRow, 
  ['Header 1', 'Header 2'],
  [
    ['Row 1 Col 1', 'Row 1 Col 2'],
    ['Row 2 Col 1', 'Row 2 Col 2']
  ]
);
```

### Image Rendering (`src/utils/excel/imageRenderer.js`)

```javascript
import { renderImageSection, renderRepeatGroupImages } from '../../../../utils/excel/imageRenderer.js';
import { buildRepeatXPath } from '../../../../utils/attachments.js';

// Single image
currentRow = await renderImageSection(
  worksheet, workbook, currentRow,
  'Image Caption',
  data.imageField,
  'group_name/image_field_id',
  attachmentMaps
);

// Images from repeat group
currentRow = await renderRepeatGroupImages(
  worksheet, workbook, currentRow,
  data.items,
  {
    captionExtractor: (item) => `Item ${item.index}`,
    xPathBuilder: (item) => buildRepeatXPath('group_repeat', item.index, 'image_field'),
    imageFieldExtractor: (item) => item.image
  },
  attachmentMaps
);
```

---

## Examples

### Example: Normalizing a Form

```javascript
// your-form.normalize.js
export function normalize(submission) {
  const meta = extractMeta(submission);
  
  const info = extractFields(submission, {
    name: 'group_info/text_name',
    date: 'group_info/date_survey',
    inspector: 'group_info/text_inspector'
  });
  
  const defects = extractRepeatGroup(
    submission,
    'group_defects',
    (item, index, groupPath) => ({
      index,
      location: item[`${groupPath}/text_location`] || '',
      severity: item[`${groupPath}/select_severity`] || '',
      photo: item[`${groupPath}/image_photo`] || ''
    })
  );
  
  return {
    meta,
    info,
    defects,
    attachments: extractAttachments(submission)
  };
}
```

### Example: Sheet Service

```javascript
// sheets/summary.service.js
export async function generate(worksheet, data, attachmentMaps, workbook) {
  setColumnWidths(worksheet, [30, 50]);
  let currentRow = 1;
  
  // Header
  currentRow = renderSectionHeader(worksheet, currentRow, 'Inspection Summary');
  currentRow++;
  
  // Basic info
  currentRow = renderLabelValueRows(worksheet, currentRow, [
    ['Inspector Name', data.info.inspector],
    ['Date', data.info.date],
    ['Building Name', data.info.name]
  ]);
  currentRow += 2;
  
  // Defects table
  if (data.defects.length > 0) {
    currentRow = renderSectionHeader(worksheet, currentRow, 'Defects Found');
    currentRow++;
    
    currentRow = renderRepeatGroupTable(
      worksheet, currentRow,
      ['#', 'Location', 'Severity'],
      data.defects,
      (item, idx) => [idx + 1, item.location, item.severity]
    );
  }
  
  return currentRow;
}
```

---

## AI Code Generation Tips

When asking AI to create a new form:

**Provide these inputs:**
1. Kobo form `asset_content.json`
2. Desired Excel sheet structure (describe or show example)
3. Any specific formatting requirements

**AI should generate:**
1. `{form-name}.normalize.js` - Extract all fields from Kobo structure
2. `{form-name}.report.service.js` - Define sheet list
3. One service file per Excel sheet

**Prompt template:**
```
I have a KoboToolbox form with this structure:
[paste asset_content.json]

I want an Excel report with these sheets:
1. Summary - Shows basic info fields X, Y, Z
2. Details - Shows section A data in label-value format
3. Items - Shows repeat group B as a table
4. Images - Shows images from repeat group C

Generate the normalize.js, report.service.js, and sheet service files 
using the template-form as a base. Use the utilities from 
src/utils/excel/ for rendering.
```

---

## Troubleshooting

**Form UID not found error:**
- Check FORM_REGISTRY in `src/services/form.router.js`
- Make sure UID matches exactly (case-sensitive)

**Fields showing as empty:**
- Verify field paths in normalize.js match Kobo form
- Check console logs for submission structure
- Use `console.log(submission)` to see available fields

**Images not showing:**
- Verify xPath strings match Kobo structure
- Check attachment resolution with console logs
- Ensure images were uploaded in Kobo submission

---

## File Reference

- **Form Router:** `src/services/form.router.js`
- **Solar Survey Example:** `src/services/forms/solar-survey/`
- **Template Files:** `src/services/forms/template-form/`
- **Utilities:** `src/utils/` and `src/utils/excel/`
- **This Guide:** `src/services/forms/README.md`

---

## Need Help?

1. Check the solar-survey form as a working example
2. Review template files for AI-friendly comments
3. Use console.log() liberally during development
4. Test with real Kobo submissions early and often
