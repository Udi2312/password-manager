// Authentication utilities for JWT token management
import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

/**
 * Creates a JWT token for authenticated user
 * @param {Object} payload - User data to encode in token
 * @returns {Promise<string>} - JWT token
 */
export async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(secret)
}

/**
 * Verifies and decodes a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Promise<Object>} - Decoded token payload
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

/**
 * Extracts user from request cookies
 * @param {Request} request - Next.js request object
 * @returns {Promise<Object|null>} - User object or null
 */
export async function getUserFromRequest(request) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}
