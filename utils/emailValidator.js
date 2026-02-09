// A simple email validator function that checks if the input is a valid email format.
export const emailValidator = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
};

export default emailValidator;