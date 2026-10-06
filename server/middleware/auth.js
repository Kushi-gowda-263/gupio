import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responseUtils.js';

/**
 * JWT authentication middleware.
 * Verifies Authorization header bearer token and attaches decoded user to req.user.
 * Returns 401 Unauthorized if token is missing or invalid.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Authentication token required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_for_development'
    );
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expired. Please log in again.');
    }
    return sendError(res, 401, 'Invalid authentication token');
  }
};

/**
 * Role-based authorization middleware.
 * Usage: authorize('ADMIN') or authorize('ADMIN', 'STAFF')
 * Must be placed AFTER authenticate middleware.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. Role "${req.user.role}" does not have permission to perform this action.`
      );
    }

    next();
  };
};

/**
 * Optional authentication middleware.
 * Attaches user if valid token present, continues without blocking if absent.
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_for_development'
    );
    req.user = decoded;
  } catch {
    // Continue anonymously
  }

  next();
};
