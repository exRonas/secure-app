const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12; // Industry standard in 2024 (balance between security and performance)

const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (plain, hash) => {
  return await bcrypt.compare(plain, hash);
};

// Password policy check
const validatePassword = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  return null; // Valid
};

module.exports = { hashPassword, comparePassword, validatePassword };
