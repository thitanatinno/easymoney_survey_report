import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Save Excel buffer to physical file
 * @param {Buffer} buffer - Excel file buffer
 * @param {string} filename - Name of the file to save
 * @param {string} outputDir - Output directory path (default: ./output)
 * @returns {Promise<Object>} - File save result with path and metadata
 */
export async function saveExcelFile(buffer, filename, outputDir = null) {
  try {
    // Determine output directory
    const outputPath = outputDir || path.join(process.cwd(), 'output');
    
    // Create output directory if it doesn't exist
    await fs.mkdir(outputPath, { recursive: true });
    
    // Full file path
    const filePath = path.join(outputPath, filename);
    
    // Write buffer to file
    await fs.writeFile(filePath, buffer);
    
    // Get file stats
    const stats = await fs.stat(filePath);
    
    return {
      success: true,
      filePath: filePath,
      filename: filename,
      size: stats.size,
      sizeFormatted: `${(stats.size / 1024).toFixed(2)} KB`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to save Excel file: ${error.message}`);
  }
}
