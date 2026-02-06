export default {
  apiUrl: process.env.KOBO_API_URL || 'https://kf.kobotoolbox.org/api/v2',
  apiToken: process.env.KOBO_API_TOKEN || 'b0df9ba98ae8fdbe9f498daa14b99bdab7ac6319',
  timeout: 30000, // 30 seconds
  maxImageSize: (process.env.MAX_IMAGE_SIZE_MB || 10) * 1024 * 1024,
  imageTimeout: parseInt(process.env.IMAGE_TIMEOUT_MS || 5000),
  maxImageWidth: parseInt(process.env.MAX_IMAGE_WIDTH_PX || 800),
  maxImageHeight: parseInt(process.env.MAX_IMAGE_HEIGHT_PX || 600)
};
