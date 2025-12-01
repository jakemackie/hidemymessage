/**
 * Client-side encryption utilities using Web Crypto API
 * Messages are encrypted with AES-GCM and the key is stored in the URL fragment
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits recommended for AES-GCM

/**
 * Generate a random encryption key
 */
async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Convert a key to base64 URL-safe string
 */
async function keyToString(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64Url(exported);
}

/**
 * Convert a base64 URL-safe string back to a key
 */
async function stringToKey(keyString: string): Promise<CryptoKey> {
  const keyBuffer = base64UrlToArrayBuffer(keyString);
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Convert ArrayBuffer to base64 URL-safe string
 */
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Convert base64 URL-safe string to ArrayBuffer
 */
function base64UrlToArrayBuffer(base64: string): ArrayBuffer {
  // Add padding if needed
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64Padded = base64
    .replace(/-/g, '+')
    .replace(/_/g, '/') + padding;
  
  const binary = atob(base64Padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Encrypt a message and return encrypted data + key
 */
export async function encryptMessage(message: string): Promise<{ encrypted: string; key: string }> {
  const key = await generateKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  const encoder = new TextEncoder();
  const messageBuffer = encoder.encode(message);
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    key,
    messageBuffer
  );
  
  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);
  
  const encryptedString = arrayBufferToBase64Url(combined.buffer);
  const keyString = await keyToString(key);
  
  return {
    encrypted: encryptedString,
    key: keyString,
  };
}

/**
 * Decrypt a message using the provided key
 */
export async function decryptMessage(encryptedData: string, keyString: string): Promise<string> {
  const key = await stringToKey(keyString);
  const combinedBuffer = base64UrlToArrayBuffer(encryptedData);
  const combined = new Uint8Array(combinedBuffer);
  
  // Extract IV and encrypted data
  const iv = combined.slice(0, IV_LENGTH);
  const encryptedMessage = combined.slice(IV_LENGTH);
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    key,
    encryptedMessage
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Create a shareable URL with encrypted message
 * Format: /message#encrypted=...&key=...
 */
export function createShareableUrl(encrypted: string, key: string, baseUrl: string = window.location.origin): string {
  return `${baseUrl}/message#encrypted=${encrypted}&key=${key}`;
}

/**
 * Parse encrypted data and key from URL fragment
 */
export function parseUrlFragment(hash: string): { encrypted: string; key: string } | null {
  if (!hash || !hash.startsWith('#')) {
    return null;
  }
  
  const params = new URLSearchParams(hash.substring(1));
  const encrypted = params.get('encrypted');
  const key = params.get('key');
  
  if (!encrypted || !key) {
    return null;
  }
  
  return { encrypted, key };
}
