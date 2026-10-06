import { sendError } from '../utils/responseUtils.js';

/**
 * Middleware factory that validates req.body against a Zod schema.
 * Passes cleaned (parsed) data as req.validatedData if valid.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    const firstErrorMessage = errors[0]?.message || 'Validation failed';
    return sendError(res, 400, firstErrorMessage, errors);
  }

  req.validatedData = result.data;
  next();
};
