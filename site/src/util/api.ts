import { ValidationError } from "express-validator";

export const mustGetEnvVar = (name: string) => {
  const environmentVariable = process.env[name];

  if (!environmentVariable) {
    throw new Error(`"${name}" environment variable is not defined`);
  }

  return environmentVariable;
};

export const formatErrors = (...errors: Partial<ValidationError>[]) => ({
  errors,
});
