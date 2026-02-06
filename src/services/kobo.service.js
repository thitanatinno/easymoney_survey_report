import axios from 'axios';
import config from '../config/kobo.config.js';

/**
 * Fetches a specific submission from KoboToolbox API
 * @param {string} uid - Asset UID
 * @param {string} id - Submission ID
 * @returns {Promise<Object>} - Submission data
 */
export async function fetchSubmission(uid, id) {
  if (!config.apiToken) {
    throw new Error('KOBO_API_TOKEN is not configured');
  }

  const url = `${config.apiUrl}/assets/${uid}/data/${id}/?format=json`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Token ${config.apiToken}`
      },
      timeout: config.timeout
    });

    // Single submission endpoint returns the object directly, not in a results array
    console.log('\n📥 RAW KOBO API RESPONSE:');
    console.log('Response type:', typeof response.data);
    console.log('Has _id:', !!response.data._id);
    console.log('\n📋 FULL JSON RESPONSE:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (!response.data || !response.data._id) {
      const error = new Error('Submission not found');
      error.statusCode = 404;
      throw error;
    }

    const submission = response.data;
    console.log('\n✅ Submission retrieved successfully with ID:', submission._id);
    
    return submission;
  } catch (error) {
    if (error.response) {
      // Kobo API returned an error
      const koboError = new Error(`Kobo API error: ${error.response.status} - ${error.response.statusText}`);
      koboError.isKoboError = true;
      koboError.statusCode = error.response.status;
      throw koboError;
    } else if (error.request) {
      // Request made but no response
      const networkError = new Error('No response from KoboToolbox API');
      networkError.isKoboError = true;
      throw networkError;
    } else {
      // Pass through other errors (like 404 we threw)
      throw error;
    }
  }
}

/**
 * Fetches all submissions from KoboToolbox API
 * @param {string} uid - Asset UID
 * @returns {Promise<Object>} - API response with results array
 */
export async function fetchAllSubmissions(uid) {
  if (!config.apiToken) {
    throw new Error('KOBO_API_TOKEN is not configured');
  }

  const url = `${config.apiUrl}/assets/${uid}/data/?format=json`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Token ${config.apiToken}`
      },
      timeout: config.timeout
    });

    console.log('\n📥 ALL SUBMISSIONS RESPONSE:');
    console.log('Response type:', typeof response.data);
    console.log('Count:', response.data.count);
    console.log('Results length:', response.data.results?.length);
    
    if (!response.data || !response.data.results) {
      const error = new Error('Invalid response format');
      error.statusCode = 500;
      throw error;
    }

    console.log('\n✅ Retrieved', response.data.results.length, 'submissions');
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // Kobo API returned an error
      const koboError = new Error(`Kobo API error: ${error.response.status} - ${error.response.statusText}`);
      koboError.isKoboError = true;
      koboError.statusCode = error.response.status;
      throw koboError;
    } else if (error.request) {
      // Request made but no response
      const networkError = new Error('No response from KoboToolbox API');
      networkError.isKoboError = true;
      throw networkError;
    } else {
      // Pass through other errors
      throw error;
    }
  }
}

/**
 * Downloads image from attachment URL
 * @param {string} url - Download URL from attachment
 * @returns {Promise<Buffer>} - Image buffer
 */
export async function downloadImage(url) {
  if (!url) {
    throw new Error('Image URL is required');
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Token ${config.apiToken}`
      },
      responseType: 'arraybuffer',
      timeout: config.imageTimeout,
      maxContentLength: config.maxImageSize
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error.message);
    throw new Error(`Failed to download image: ${error.message}`);
  }
}
