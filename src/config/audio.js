/**
 * Audio configuration settings for the Audio Dashcam application
 */

export const AUDIO_CONFIG = {
  // Buffer settings
  bufferDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
  maxBufferSize: 50 * 1024 * 1024, // 50MB max buffer size
  
  // Recording settings
  sampleRate: 44100,
  channels: 1, // Mono recording
  bitDepth: 16,
  audioFormat: 'aac', // AAC format for better compression
  
  // File settings
  outputDirectory: 'AudioDashcam',
  filePrefix: 'dashcam_',
  fileExtension: '.aac',
  
  // Quality settings
  quality: 'high', // 'low', 'medium', 'high'
  bitrate: 128000, // 128 kbps
  
  // Background settings
  backgroundMode: true,
  keepAwake: true,
  
  // Notification settings
  showNotification: true,
  notificationTitle: 'Audio Dashcam',
  notificationText: 'Recording in background',
  
  // Error handling
  maxRetries: 3,
  retryDelay: 1000,
  
  // Debug settings
  enableLogging: __DEV__,
  logLevel: 'info', // 'error', 'warn', 'info', 'debug'
};

export const AUDIO_QUALITY_PRESETS = {
  low: {
    sampleRate: 22050,
    bitrate: 64000,
    channels: 1,
  },
  medium: {
    sampleRate: 44100,
    bitrate: 128000,
    channels: 1,
  },
  high: {
    sampleRate: 48000,
    bitrate: 192000,
    channels: 1,
  },
};

export const getAudioSettings = (quality = AUDIO_CONFIG.quality) => {
  const preset = AUDIO_QUALITY_PRESETS[quality] || AUDIO_QUALITY_PRESETS.medium;
  
  return {
    ...AUDIO_CONFIG,
    ...preset,
  };
};

export const calculateBufferSize = (duration, sampleRate, channels, bitDepth) => {
  const bytesPerSample = bitDepth / 8;
  const bytesPerSecond = sampleRate * channels * bytesPerSample;
  return Math.ceil((duration / 1000) * bytesPerSecond);
};

export const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}; 