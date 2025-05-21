import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

/**
 * Encrypts a string using AES-256-GCM
 * @param text - The text to encrypt
 * @param secretKey - The secret key to use for encryption
 * @returns The encrypted text as a base64 string
 */
export function encrypt(text: string, secretKey: string): string {
  // Generate a random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Generate a random salt
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  // Derive key using PBKDF2
  const key = crypto.pbkdf2Sync(secretKey, salt, ITERATIONS, KEY_LENGTH, 'sha256');
  
  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  // Encrypt the text
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  
  // Get the auth tag
  const tag = cipher.getAuthTag();
  
  // Combine all components
  const result = Buffer.concat([salt, iv, tag, encrypted]);
  
  // Return as base64 string
  return result.toString('base64');
}

/**
 * Decrypts an encrypted string
 * @param encryptedText - The encrypted text (base64 string)
 * @param secretKey - The secret key used for encryption
 * @returns The decrypted text
 */
export function decrypt(encryptedText: string, secretKey: string): string {
  // Convert from base64
  const buffer = Buffer.from(encryptedText, 'base64');
  
  // Extract components
  const salt = buffer.subarray(0, SALT_LENGTH);
  const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  
  // Derive key using PBKDF2
  const key = crypto.pbkdf2Sync(secretKey, salt, ITERATIONS, KEY_LENGTH, 'sha256');
  
  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  // Decrypt
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  
  // Return as string
  return decrypted.toString('utf8');
} 