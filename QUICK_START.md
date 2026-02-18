# 🚀 Quick Start: Multi-Form System

## What Changed?

Your kobo-excel system now supports **multiple forms** with different field structures and Excel layouts. The **solar_survey form is preserved exactly as-is**.

---

## ⚡ Immediate Action Required

### Update the Solar Survey UID

**File:** [src/services/form.router.js](src/services/form.router.js)

**Line 13-18:** Replace `'YOUR_SOLAR_SURVEY_UID_HERE'` with your actual Kobo form UID:

```javascript
const FORM_REGISTRY = {
  'aYourActualSolarUID12345': {  // ← CHANGE THIS!
    name: 'Solar Survey',
    description: 'Installation inspection report for solar PV systems',
    handler: generateSolarSurveyReport
  }
};
```

**How to find your UID:**
- Check your current API calls (the `:uid` parameter)
- Or look in KoboToolbox URL when editing the form
- Format: usually starts with 'a' followed by random characters

---

## ✅ Test It Works

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Start server
npm start

# 3. Test solar survey (replace with your actual UID and submission ID)
curl http://localhost:3000/generate/YOUR_SOLAR_UID/SUBMISSION_ID

# ✅ Should download Excel file exactly like before
```

---

## 🎯 How It Works Now

**Before:**
```
API → Controller → report.service.js → Excel
```

**After:**
```
API → Controller → form.router.js → Detects UID
                        ↓
            Routes to correct form module
                        ↓
        solar-survey.report.service.js → Excel
```

---

## 📁 Where Everything Is

### Current Solar Form (Works As-Is)
- **Normalization:** `src/services/forms/solar-survey/solar-survey.normalize.js`
- **Report Service:** `src/services/forms/solar-survey/solar-survey.report.service.js`
- **Sheet Services:** Uses existing `src/services/excel/sheet1-6.service.js`

### Template for New Forms
- **Location:** `src/services/forms/template-form/`
- **Purpose:** Copy this to create new forms
- **AI-Ready:** Heavily commented for AI code generation

### Utilities (Shared by All Forms)
- **Report Workflow:** `src/utils/reportOrchestrator.js`
- **Field Extraction:** `src/utils/fieldExtractor.js`
- **Excel Rendering:** `src/utils/excel/sectionRenderer.js`, `imageRenderer.js`

### Documentation
- **Adding Forms:** `src/services/forms/README.md`
- **Implementation Details:** `MULTI_FORM_IMPLEMENTATION.md`

---

## 🆕 Adding a New Form (Quick)

### 1. Copy Template
```bash
cp -r src/services/forms/template-form src/services/forms/my-form
```

### 2. Edit Normalization
Edit `my-form/my-form.normalize.js` - replace group/field names

### 3. Create Sheet Services
Create files in `my-form/sheets/` - one per Excel sheet

### 4. Update Report Service
Edit `my-form/my-form.report.service.js` - list your sheets

### 5. Register Form
Edit `src/services/form.router.js`:

```javascript
import { generateReport as generateMyFormReport } from './forms/my-form/my-form.report.service.js';

const FORM_REGISTRY = {
  // ... existing forms ...
  
  'aMyFormUID123': {
    name: 'My Form',
    description: 'Description',
    handler: generateMyFormReport
  }
};
```

### 6. Test
```bash
curl http://localhost:3000/generate/aMyFormUID123/SUBMISSION_ID
```

**See `src/services/forms/README.md` for detailed guide.**

---

## 🤖 AI Code Generation

**Template files are designed for AI to generate new forms:**

1. Get your Kobo form structure (`asset_content.json`)
2. Describe your Excel layout
3. Ask AI to generate files based on template-form

**Example AI Prompt:**
```
Using the template in src/services/forms/template-form/, 
create a new form for this Kobo structure:
[paste asset_content.json]

Excel layout:
- Sheet 1: Basic info (fields X, Y, Z)
- Sheet 2: Table with items (fields A, B, C)
- Sheet 3: Images from repeat group

Use utilities from src/utils/excel/ for rendering.
```

---

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Solar Survey Form | ✅ Working | Zero changes to functionality |
| Form Router | ✅ Ready | Need to update UID |
| Utilities | ✅ Ready | Reusable across all forms |
| Template Form | ✅ Ready | For AI/new forms |
| Documentation | ✅ Complete | See README files |

---

## ⚠️ Important Notes

1. **No Breaking Changes** - Solar survey works exactly as before
2. **Only One Change Required** - Update UID in form.router.js
3. **Old Files Still There** - Can be removed after verification:
   - `src/services/report.service.js`
   - `src/utils/normalizeSubmission.js`
4. **Backward Compatible** - API endpoints unchanged

---

## 🆘 Troubleshooting

**Error: "Unknown form UID"**
- Check `FORM_REGISTRY` in `src/services/form.router.js`
- Verify UID matches exactly (case-sensitive)

**Excel file looks different**
- Solar form uses exact same sheet services
- Check console logs for any errors
- Verify normalization output

**Images not showing**
- Attachment resolution unchanged
- Check xPath strings match Kobo form
- Verify images uploaded in submission

---

## 📞 Need Help?

1. Check `src/services/forms/README.md` - Complete guide
2. Check `MULTI_FORM_IMPLEMENTATION.md` - Technical details
3. Review template files - Heavily commented
4. Look at solar-survey form - Working example

---

## 🎉 You're Ready!

1. ✅ Update UID in `form.router.js`
2. ✅ Test solar survey form
3. ✅ Add new forms when needed

**The system is backward compatible and ready to use!**
