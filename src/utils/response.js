// src/utils/response.js


const successResponse = (data = null, message = 'Success') => ({
  success: true,
  data,
  message,
});


const errorResponse = (message = 'Something went wrong', details = null) => ({
  success: false,
  data: details,
  message,
});

module.exports = { successResponse, errorResponse };
