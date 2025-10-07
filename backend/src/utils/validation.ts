// @ts-ignore - Temporary fix for Joi typing issues
import * as Joi from 'joi';
import { AppError, ValidationError } from '@/types';

export const validateRequest = (schema: any, data: any): any => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const validationErrors: ValidationError[] = error.details.map((detail: any) => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value,
    }));

    const errorMessage = validationErrors.map(err => `${err.field}: ${err.message}`).join(', ');
    throw new AppError(`Validation failed: ${errorMessage}`, 400);
  }

  return value;
};

export const validateQuery = (schema: any, query: any): any => {
  const { error, value } = schema.validate(query, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const validationErrors: ValidationError[] = error.details.map((detail: any) => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value,
    }));

    const errorMessage = validationErrors.map(err => `${err.field}: ${err.message}`).join(', ');
    throw new AppError(`Query validation failed: ${errorMessage}`, 400);
  }

  return value;
};
