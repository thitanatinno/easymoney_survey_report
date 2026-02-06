const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Kobo API errors
  if (err.isKoboError) {
    return res.status(502).json({
      error: 'Bad Gateway',
      message: 'Failed to fetch data from KoboToolbox',
      details: err.message
    });
  }

  // Not found errors
  if (err.statusCode === 404) {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message || 'Submission not found'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message
    });
  }

  // Default server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred while generating the report'
  });
};

export default errorHandler;
