export const getENV = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`process.env.${key} is not set`);
  }
  return value;
};
