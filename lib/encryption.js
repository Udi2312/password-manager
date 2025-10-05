// Client-side encryption utilities using Web Crypto API
// All vault data is encrypted before sending to server

/**
 * Derives a cryptographic key from the user's master password
 * @param {string} password - User's master password
 * @param {string} salt - Salt for key derivation (user's email)
 * @returns {Promise<CryptoKey>} - Derived encryption key
 */
export async function deriveKey(password, salt) {
  const encoder = new TextEncoder()

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ])

  // Derive AES-GCM key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  )
}

/**
 * Encrypts data using AES-GCM
 * @param {string} data - Data to encrypt
 * @param {CryptoKey} key - Encryption key
 * @returns {Promise<string>} - Base64 encoded encrypted data with IV
 */
export async function encryptData(data, key) {
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV for AES-GCM

  const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(data))

  // Combine IV and encrypted data, then encode as base64
  const combined = new Uint8Array(iv.length + encryptedData.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encryptedData), iv.length)

  return btoa(String.fromCharCode(...combined))
}

/**
 * Decrypts data using AES-GCM
 * @param {string} encryptedData - Base64 encoded encrypted data with IV
 * @param {CryptoKey} key - Decryption key
 * @returns {Promise<string>} - Decrypted data
 */
export async function decryptData(encryptedData, key) {
  const decoder = new TextDecoder()

  // Decode base64 and extract IV and encrypted data
  const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))
  const iv = combined.slice(0, 12)
  const data = combined.slice(12)

  const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data)

  return decoder.decode(decryptedData)
}

/**
 * Creates a verification token to validate master password
 * @param {CryptoKey} key - Encryption key derived from master password
 * @returns {Promise<string>} - Encrypted verification token
 */
export async function createVerificationToken(key) {
  const verificationString = "VAULT_PASSWORD_VERIFICATION_TOKEN"
  return encryptData(verificationString, key)
}

/**
 * Verifies if the master password is correct by attempting to decrypt the verification token
 * @param {string} verificationToken - Stored encrypted verification token
 * @param {CryptoKey} key - Encryption key derived from entered password
 * @returns {Promise<boolean>} - True if password is correct, false otherwise
 */
export async function verifyMasterPassword(verificationToken, key) {
  try {
    const decrypted = await decryptData(verificationToken, key)
    return decrypted === "VAULT_PASSWORD_VERIFICATION_TOKEN"
  } catch (error) {
    // Decryption failed - wrong password
    return false
  }
}
