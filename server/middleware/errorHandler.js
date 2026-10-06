import mongoose from 'mongoose';
import { sendError } from '../utils/responseUtils.js';

/**
 * Centralized error handling middleware.
 * Catches errors from all route handlers and returns consistent responses.
 * Must be registered LAST in Express middleware chain.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 400, 'Validation failed', messages);
  }

  // Mongoose duplicate key error (e.g., duplicate SKU)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 409, `A product with that ${field} already exists`);
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return sendError(res, 400, 'Invalid product ID format');
  }

  // Zod validation errors (forwarded from controllers)
  if (err.name === 'ZodError') {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    return sendError(res, 400, 'Validation failed', messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }

  // Generic server error — never expose internal details
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'An unexpected error occurred';
  return sendError(res, status, message);
};

export default errorHandler;
