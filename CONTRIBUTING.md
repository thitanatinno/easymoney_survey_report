# Contributing Guide

## Project Overview

This is a Node.js Express API that generates Excel reports from KoboToolbox submissions. The architecture follows clean MVC + Service Layer patterns with ES Modules.

## Development Setup

```bash
# Clone/navigate to project
cd kobo-excel

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your KOBO_API_TOKEN

# Start development server
npm run dev
```

## Code Structure

```
Routes → Controllers → Services → Utilities
```

- **Routes**: Define API endpoints
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic (Kobo API, Excel generation)
- **Utilities**: Reusable functions (Excel helpers, data parsing)

## Adding New Features

### Adding a New Excel Sheet

1. Create service file:
```javascript
// src/services/excel/sheet6.service.js
export function renderSheet6(worksheet, data) {
  // Your rendering logic
  setColumnWidths(worksheet, [20, 30]);
  let currentRow = 1;
  // ... add content
  return currentRow;
}
```

2. Import in report service:
```javascript
// src/services/report.service.js
import { renderSheet6 } from './excel/sheet6.service.js';

// In generateExcelReport():
const sheet6 = workbook.addWorksheet('New Sheet');
renderSheet6(sheet6, normalizedData);
```

### Adding New Data Fields

1. Extract in normalizer:
```javascript
// src/utils/normalizeSubmission.js
export function normalizeSubmission(submission) {
  const newField = submission.group_xyz?.field_abc || '';
  return { ...existing, newField };
}
```

2. Use in sheet renderer:
```javascript
// src/services/excel/sheetX.service.js
writeRow(worksheet, currentRow, ['New Field', data.newField]);
```

### Adding Custom Styles

1. Define in styles:
```javascript
// src/utils/excel/styles.js
export function customStyle() {
  return {
    font: { size: 12, bold: true, color: { argb: 'FFFF0000' } },
    border: BORDERS.thick,
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }
  };
}
```

2. Apply to cells:
```javascript
Object.assign(cell, customStyle());
```

## Excel Utility Functions

### Merge and Write
```javascript
import { mergeAndWrite } from '../utils/excel/helpers.js';

mergeAndWrite(worksheet, startRow, startCol, endRow, endCol, 'Value', style);
```

### Draw Bordered Box
```javascript
import { drawBox } from '../utils/excel/helpers.js';

drawBox(worksheet, startRow, startCol, endRow, endCol, 'thick');
```

### Add Checkboxes
```javascript
import { setYesNoCheckbox, setCheckboxForValue } from '../utils/excel/checkbox.js';

setYesNoCheckbox(cell, value); // ☑ Yes ☐ No
setCheckboxForValue(cell, actualValue, 'PEA', 'PEA'); // ☑ PEA
```

### Embed Images
```javascript
import { addImageBlock } from '../utils/excel/images.js';

currentRow = addImageBlock(worksheet, workbook, imageBuffer, 
  currentRow, 1, 6, 'Caption', 'jpeg');
```

## Data Flow

```
1. Client → GET /generate/:uid/:id
2. Controller validates params
3. kobo.service.fetchSubmission(uid, id)
4. normalizeSubmission(rawData)
5. buildAttachmentMaps(attachments)
6. report.service generates Excel
   ├─ renderSheet1(general, building)
   ├─ renderSheet2(routeline)
   ├─ renderSheet3(customerMDP)
   ├─ renderSheet4(routeline images) [async]
   └─ renderSheet5(MDP images) [async]
7. Return Excel buffer to client
```

## Testing

### Manual Testing
```bash
# Health check
curl http://localhost:3000/health

# Generate report
curl http://localhost:3000/generate/YOUR_UID/YOUR_ID --output test.xlsx

# Open file
open test.xlsx
```

### Test with Different Data
- Small submission (no images)
- Large submission (many images)
- Repeat groups (multiple items)
- Missing fields (verify defaults)

## Common Tasks

### Modify Field Mappings

Edit [src/utils/normalizeSubmission.js](src/utils/normalizeSubmission.js):
```javascript
// Map new Kobo field to normalized structure
const general = {
  siteName: submission.group_hh1ii99?.text_pl66z95 || '',
  newField: submission.group_xyz?.field_abc || 'default'
};
```

### Change Image Sizing

Edit [src/utils/excel/images.js](src/utils/excel/images.js):
```javascript
export function calculateImageDimensions(imageBuffer, maxWidth = 1000, rowHeightPx = 25) {
  // Adjust maxWidth and rowHeightPx as needed
}
```

### Customize Colors/Fonts

Edit [src/utils/excel/styles.js](src/utils/excel/styles.js):
```javascript
export const THEME = {
  colors: {
    headerBg: 'FFD9E1F2',  // Change to your color
    // ...
  }
};
```

### Add API Endpoint

1. Create route:
```javascript
// src/routes/report.routes.js
router.get('/custom/:id', customController);
```

2. Create controller:
```javascript
// src/controllers/report.controller.js
export async function customController(req, res, next) {
  // Your logic
}
```

## Error Handling

All errors flow through [src/middleware/errorHandler.js](src/middleware/errorHandler.js).

To throw custom errors:
```javascript
const error = new Error('Custom error message');
error.statusCode = 400;
error.isKoboError = true; // Optional flag
throw error;
```

## Performance Tips

- Images downloaded sequentially (not parallel) to avoid memory issues
- Keep submissions < 100MB for optimal performance
- Consider implementing caching for repeated requests
- Use streaming for very large reports (future enhancement)

## Debugging

### Enable Verbose Logging
```javascript
// Add to any service
console.log('Debug:', JSON.stringify(data, null, 2));
```

### Check Kobo Response
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  https://kf.kobotoolbox.org/api/v2/assets/UID/data/ID/?format=json
```

### Inspect Excel Structure
Use ExcelJS reader to verify generated file:
```javascript
import ExcelJS from 'exceljs';
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile('report.xlsx');
console.log(workbook.worksheets.map(ws => ws.name));
```

## Code Style

- Use ES Modules (`import/export`)
- Async/await for promises
- JSDoc comments for functions
- Descriptive variable names
- Single responsibility principle

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add: new feature description"

# Push and create PR
git push origin feature/new-feature
```

## Useful Resources

- **ExcelJS Docs**: https://github.com/exceljs/exceljs
- **Kobo API**: https://support.kobotoolbox.org/api.html
- **Express Guide**: https://expressjs.com/en/guide/routing.html
- **Project Docs**: See [README.md](README.md), [ARCHITECTURE.md](ARCHITECTURE.md)

## Questions?

- Check existing documentation files
- Review code comments
- Test with `node info.js`
- Examine [test-examples.js](test-examples.js)

## Future Enhancements Ideas

- [ ] Add unit tests (Jest/Mocha)
- [ ] Implement caching layer (Redis)
- [ ] Add batch report generation
- [ ] Support PDF export
- [ ] Add progress tracking
- [ ] Implement streaming for large files
- [ ] Add queue system (Bull)
- [ ] Create admin dashboard
- [ ] Add report templates
- [ ] Implement webhooks

Happy coding! 🚀
