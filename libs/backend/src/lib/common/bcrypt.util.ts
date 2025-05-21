import * as bcrypt from 'bcrypt';

// Salt rounds for hashing
const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password.
 * @param password - The plain text password
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain text password with a hashed password.
 * @param password - The plain text password
 * @param hash - The hashed password
 * @returns Boolean indicating whether the passwords match
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
