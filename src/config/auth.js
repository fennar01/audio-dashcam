/**
 * Authentication configuration settings for the Audio Dashcam application
 */

export const AUTH_CONFIG = {
  // OAuth settings
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: 'com.audiodashcam://oauth2redirect',
  
  // Scopes
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
  
  // Token settings
  tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes before expiry
  autoRefresh: true,
  
  // Security settings
  secureStorage: true,
  encryptTokens: true,
  keychainAccessibility: 'kSecAttrAccessibleWhenUnlockedThisDeviceOnly',
  
  // Session settings
  rememberUser: true,
  autoSignIn: true,
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  
  // Error handling
  maxAuthRetries: 3,
  retryDelay: 2000,
  
  // Debug settings
  enableLogging: __DEV__,
  logLevel: 'info',
};

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  TOKEN_EXPIRY: 'auth_token_expiry',
  USER_INFO: 'auth_user_info',
  SESSION_DATA: 'auth_session_data',
};

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  NETWORK_ERROR: 'NETWORK_ERROR',
  USER_CANCELLED: 'USER_CANCELLED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  REFRESH_FAILED: 'REFRESH_FAILED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INVALID_SCOPE: 'INVALID_SCOPE',
};

export const getAuthSettings = () => {
  return {
    ...AUTH_CONFIG,
    // Add any runtime configuration here
  };
};

export const validateAuthConfig = () => {
  const required = ['clientId', 'scopes'];
  const missing = required.filter(key => !AUTH_CONFIG[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required auth configuration: ${missing.join(', ')}`);
  }
  
  return true;
};

export const isTokenExpired = (expiryTime) => {
  if (!expiryTime) return true;
  
  const now = Date.now();
  const buffer = AUTH_CONFIG.tokenExpiryBuffer;
  
  return now >= (expiryTime - buffer);
};

export const shouldRefreshToken = (expiryTime) => {
  if (!expiryTime) return true;
  
  const now = Date.now();
  const buffer = AUTH_CONFIG.tokenExpiryBuffer * 2; // Double buffer for refresh
  
  return now >= (expiryTime - buffer);
};

export const getAuthHeaders = (accessToken) => {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'User-Agent': 'AudioDashcam/1.0',
  };
};

export const sanitizeUserInfo = (userInfo) => {
  // Remove sensitive information before storage
  const {sub, ...safeInfo} = userInfo;
  return safeInfo;
}; 