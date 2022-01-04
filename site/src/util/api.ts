import { ValidationError } from "express-validator";

export const formatErrors = (...errors: Partial<ValidationError>[]) => ({
  errors,
});
