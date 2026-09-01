const crypto = require('crypto');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * Obtiene la clave de cifrado para el secreto TOTP desde las variables de entorno.
 * AES-256 requiere una clave de 32 bytes.
 */
const getEncryptionKey = () => {
  const key = process.env.OTP_ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      'Falta la variable de entorno OTP_ENCRYPTION_KEY. Definila antes de usar 2FA.'
    );
  }

  // AES-256 requiere una clave de 32 bytes.
  // Acepta 32 caracteres UTF-8 o 64 caracteres hex (32 bytes).
  if (/^[0-9a-fA-F]{64}$/.test(key)) {
    return Buffer.from(key, 'hex');
  }

  const buffer = Buffer.from(key, 'utf8');
  if (buffer.length !== 32) {
    throw new Error(
      'OTP_ENCRYPTION_KEY debe tener 32 caracteres (AES-256) o 64 caracteres hex.'
    );
  }

  return buffer;
};

/**
 * Encripta un secreto TOTP usando AES-256-GCM.
 * Devuelve una cadena "iv:tag:encrypted" en base64.
 */
const encryptSecret = (plainSecret) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(plainSecret, 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
};

/**
 * Desencripta un secreto TOTP almacenado con encryptSecret.
 */
const decryptSecret = (stored) => {
  const [ivB64, tagB64, encryptedB64] = stored.split(':');

  if (!ivB64 || !tagB64 || !encryptedB64) {
    throw new Error('Secreto TOTP almacenado en formato inválido.');
  }

  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const encrypted = Buffer.from(encryptedB64, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
};

/**
 * Genera un secreto TOTP seguro.
 */
const generateSecret = () => authenticator.generateSecret();

/**
 * Genera el data-URL del código QR para configurar la app autenticadora.
 */
const generateQrDataUrl = async (secret, nombreUsuario) => {
  const otpauth = authenticator.keyuri(nombreUsuario, 'EduConnect', secret);
  return qrcode.toDataURL(otpauth);
};

/**
 * Verifica un código TOTP contra el secreto, con una ventana de ±1 paso
 * para tolerar desfases de reloj.
 */
const verifyTotp = (secret, token) => {
  return authenticator.verify({ token, secret, window: 1 });
};

module.exports = {
  getEncryptionKey,
  encryptSecret,
  decryptSecret,
  generateSecret,
  generateQrDataUrl,
  verifyTotp,
};
