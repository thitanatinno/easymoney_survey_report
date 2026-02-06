# Setup Checklist

Use this checklist to get your Kobo Excel Report Generator up and running.

## ✅ Initial Setup

- [ ] **Node.js installed** (version 18 or higher)
  ```bash
  node --version
  ```

- [ ] **Navigate to project directory**
  ```bash
  cd kobo-excel
  ```

- [ ] **Install dependencies**
  ```bash
  npm install
  ```

- [ ] **Create .env file**
  ```bash
  cp .env.example .env
  ```

## ✅ Configuration

- [ ] **Get Kobo API Token**
  - Log in to KoboToolbox
  - Go to Account Settings → Security
  - Copy your API Token

- [ ] **Add token to .env file**
  ```env
  KOBO_API_TOKEN=your_actual_token_here
  ```

- [ ] **Verify other settings** (optional)
  ```env
  PORT=3000
  MAX_IMAGE_SIZE_MB=10
  IMAGE_TIMEOUT_MS=5000
  ```

## ✅ Testing

- [ ] **Start the server**
  ```bash
  npm run dev
  ```
  
  Should see: `🚀 Kobo Excel Report API running on port 3000`

- [ ] **Test health endpoint**
  ```bash
  curl http://localhost:3000/health
  ```
  
  Should return: `{"status":"ok","timestamp":"..."}`

- [ ] **Get your Asset UID**
  - Go to your form in KoboToolbox
  - Copy UID from URL or form settings

- [ ] **Get a Submission ID**
  - View your form data
  - Note the `_id` of a submission

- [ ] **Generate test report**
  ```bash
  curl http://localhost:3000/generate/YOUR_UID/YOUR_ID --output test_report.xlsx
  ```

- [ ] **Open the Excel file**
  ```bash
  open test_report.xlsx
  ```

## ✅ Verification

Check that the generated Excel file has:

- [ ] **5 sheets**
  - General & Building Data
  - Routeline Summary
  - Customer MDP-LP
  - Routeline Images
  - MDP Images

- [ ] **Sheet 1 contains:**
  - [ ] Site information
  - [ ] Building data
  - [ ] Checkboxes (☑/☐) display correctly

- [ ] **Sheet 2 contains:**
  - [ ] Table with route line items
  - [ ] Distances
  - [ ] Image indicators

- [ ] **Sheet 3 contains:**
  - [ ] MDP specifications
  - [ ] Measurements

- [ ] **Sheet 4 contains:**
  - [ ] Route line images in bordered blocks
  - [ ] Captions with distances
  - [ ] Images display properly

- [ ] **Sheet 5 contains:**
  - [ ] MDP documentation images
  - [ ] Bordered blocks
  - [ ] All images embedded

## ✅ Troubleshooting

If something doesn't work:

- [ ] **Check server logs**
  - Look at terminal output
  - Note any error messages

- [ ] **Verify .env configuration**
  ```bash
  cat .env
  ```

- [ ] **Test Kobo API directly**
  ```bash
  curl -H "Authorization: Token YOUR_TOKEN" \
    https://kf.kobotoolbox.org/api/v2/assets/
  ```

- [ ] **Check Node.js version**
  ```bash
  node --version  # Should be 18 or higher
  ```

- [ ] **Reinstall dependencies**
  ```bash
  rm -rf node_modules
  npm install
  ```

## ✅ Common Issues

### "KOBO_API_TOKEN is not configured"
- [ ] Ensure .env file exists
- [ ] Check token is set correctly
- [ ] No quotes needed around token value

### "Submission not found"
- [ ] Verify Asset UID is correct
- [ ] Verify Submission ID exists
- [ ] Check you have access to the form

### "Failed to download image"
- [ ] Check internet connection
- [ ] Verify token has download permissions
- [ ] Check image URLs in Kobo

### "Cannot find module"
- [ ] Run `npm install`
- [ ] Check Node.js version
- [ ] Verify package.json exists

## ✅ Next Steps

Once everything works:

- [ ] **Read documentation**
  - [ ] README.md for usage
  - [ ] ARCHITECTURE.md for technical details

- [ ] **Try with different submissions**
  - [ ] Test with various data
  - [ ] Check repeat groups
  - [ ] Verify image handling

- [ ] **Integrate into your workflow**
  - [ ] Add to your application
  - [ ] Set up automated reports
  - [ ] Configure for production

- [ ] **Consider enhancements**
  - [ ] Add custom fields
  - [ ] Modify styling
  - [ ] Add new sheets

## ✅ Production Deployment

When ready for production:

- [ ] **Set environment**
  ```env
  NODE_ENV=production
  ```

- [ ] **Use process manager**
  ```bash
  npm install -g pm2
  pm2 start src/app.js --name kobo-excel
  ```

- [ ] **Set up reverse proxy** (nginx/Apache)

- [ ] **Enable HTTPS**

- [ ] **Configure firewall**

- [ ] **Set up monitoring**

- [ ] **Regular backups**

## 📊 Quick Reference

### Start Server
```bash
npm run dev          # Development with auto-reload
npm start            # Production
./start.sh           # Quick start script
```

### Test Endpoints
```bash
# Health check
curl http://localhost:3000/health

# Generate report
curl http://localhost:3000/generate/UID/ID --output report.xlsx
```

### View Info
```bash
node info.js         # Display project information
```

### Project Structure
```bash
ls -R src/           # View all source files
```

## 🎉 Success!

When all items are checked, you're ready to generate Excel reports from KoboToolbox data!

For questions, refer to:
- **README.md** - User guide
- **ARCHITECTURE.md** - Technical documentation
- **PROJECT_SUMMARY.md** - Overview
- **test-examples.js** - Usage examples

---

**Happy Reporting! 📊✨**
