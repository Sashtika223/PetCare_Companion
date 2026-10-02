import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Unhandled Error:', err);

  if (err instanceof ZodError) {
    const issue = err.issues[0];
    res.status(400).json({
      success: false,
      message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Validation error',
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
