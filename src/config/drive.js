/**
 * Google Drive configuration settings for the Audio Dashcam application
 */

export const DRIVE_CONFIG = {
  // API settings
  apiKey: process.env.GOOGLE_API_KEY || '',
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  
  // OAuth settings
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
  
  // Upload settings
  folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '', // Optional: specific folder
  maxFileSize: 100 * 1024 * 1024, // 100MB max file size
  chunkSize: 5 * 1024 * 1024, // 5MB chunks for large files
  
  // Retry settings
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds
  exponentialBackoff: true,
  
  // Queue settings
  maxQueueSize: 10,
  queueTimeout: 30000, // 30 seconds
  
  // File naming
  filePrefix: 'dashcam_',
  includeTimestamp: true,
  includeLocation: false, // Future feature
  
  // Metadata
  description: 'Audio recording from Audio Dashcam app',
  mimeType: 'audio/aac',
  
  // Offline support
  enableOfflineQueue: true,
  syncOnReconnect: true,
  
  // Security
  encryptFiles: false, // Future feature
  secureStorage: true,
  
  // Debug settings
  enableLogging: __DEV__,
  logLevel: 'info',
};

export const DRIVE_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
};

export const getUploadSettings = () => {
  return {
    ...DRIVE_CONFIG,
    // Add any runtime configuration here
  };
};

export const generateFileName = (timestamp, location = null) => {
  const date = new Date(timestamp);
  const dateStr = date.toISOString().replace(/[:.]/g, '-').split('T')[0];
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
  
  let fileName = `${DRIVE_CONFIG.filePrefix}${dateStr}_${timeStr}`;
  
  if (location) {
    fileName += `_${location.latitude.toFixed(4)}_${location.longitude.toFixed(4)}`;
  }
  
  return fileName;
};

export const getRetryDelay = (attempt, baseDelay = DRIVE_CONFIG.retryDelay) => {
  if (!DRIVE_CONFIG.exponentialBackoff) {
    return baseDelay;
  }
  
  return Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30 seconds
};

export const isRetryableError = (error) => {
  const retryableErrors = [
    DRIVE_ERROR_CODES.NETWORK_ERROR,
    DRIVE_ERROR_CODES.RATE_LIMIT_EXCEEDED,
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
  ];
  
  return retryableErrors.some(retryableError => 
    error.message?.includes(retryableError) || 
    error.code === retryableError
  );
};

export const validateDriveConfig = () => {
  const required = ['clientId', 'scopes'];
  const missing = required.filter(key => !DRIVE_CONFIG[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required Drive configuration: ${missing.join(', ')}`);
  }
  
  return true;
}; 