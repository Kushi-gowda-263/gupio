import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseUtils.js';

/**
 * Generate a signed JWT token for a user.
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'fallback_secret_for_development',
    { expiresIn: '7d' }
  );
};

/**
 * POST /api/auth/register
 * Creates a new user account. Defaults to STAFF role.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.validatedData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, 'An account with this email address already exists');
    }

    // Default to STAFF unless specifically requested (ADMIN registration can be seeded or selected)
    const userRole = role === 'ADMIN' ? 'ADMIN' : 'STAFF';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    const token = generateToken(user);
    const userObj = user.toObject();

    return sendSuccess(
      res,
      201,
      { user: userObj, token },
      'Registration successful'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Validates credentials and returns JWT token and user info.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;

    // Retrieve user including the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const token = generateToken(user);
    const userObj = user.toObject();

    return sendSuccess(
      res,
      200,
      { user: userObj, token },
      'Login successful'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Retrieves current authenticated user details.
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 404, 'User account not found');
    }

    return sendSuccess(res, 200, user, 'User profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};
