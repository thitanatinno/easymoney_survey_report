import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const renderDashboard = (req, res) => {
  const { uid } = req.params;
  
  try {
    // Read CSS and JS files
    const dashboardPath = path.join(__dirname, '../dashboard');
    const cssPath = path.join(dashboardPath, 'styles.css');
    const jsPath = path.join(dashboardPath, 'script.js');
    
    const css = fs.readFileSync(cssPath, 'utf-8');
    const js = fs.readFileSync(jsPath, 'utf-8');
    
    // Read the logo and convert to base64
    const logoPath = path.join(__dirname, '../../assets/inno-logo.png');
    let logoBase64 = '';
    
    try {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (error) {
      console.warn('Logo file not found, using placeholder');
    }
    
    // Render EJS template with data
    res.render('dashboard/index', {
      uid,
      logoBase64,
      css,
      js
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
};
