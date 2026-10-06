/**
 * Centralized error response utility.
 * Ensures consistent JSON error shape across all endpoints.
 */
export const sendError = (res, statusCode, message, errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * Centralized success response utility.
 */
export const sendSuccess = (res, statusCode, data, message = 'Success', meta = null) => {
  const response = { success: true, message, data };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};
