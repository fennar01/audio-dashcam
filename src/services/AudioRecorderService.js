import {NativeModules, NativeEventEmitter, Platform} from 'react-native';
import {AUDIO_CONFIG, getAudioSettings, calculateBufferSize} from '../config/audio';
import {Logger} from '../utils/Logger';

const {AudioRecorderModule} = NativeModules;
const audioRecorderEmitter = new NativeEventEmitter(AudioRecorderModule);

class AudioRecorderService {
  constructor() {
    this.isInitialized = false;
    this.isRecording = false;
    this.buffer = [];
    this.bufferSize = 0;
    this.maxBufferSize = 0;
    this.recordingStartTime = null;
    this.currentFile = null;
    this.listeners = [];
    
    this.logger = new Logger('AudioRecorderService');
  }

  async initialize() {
    try {
      this.logger.info('Initializing AudioRecorderService...');
      
      // Calculate buffer size based on configuration
      const settings = getAudioSettings();
      this.maxBufferSize = calculateBufferSize(
        settings.bufferDuration,
        settings.sampleRate,
        settings.channels,
        settings.bitDepth
      );
      
      this.logger.info(`Buffer size calculated: ${this.maxBufferSize} bytes`);
      
      // Initialize native module
      if (Platform.OS === 'android') {
        await AudioRecorderModule.initialize({
          sampleRate: settings.sampleRate,
          channels: settings.channels,
          bitDepth: settings.bitDepth,
          audioFormat: settings.audioFormat,
          bufferDuration: settings.bufferDuration,
          maxBufferSize: this.maxBufferSize,
        });
      }
      
      // Set up event listeners
      this.setupEventListeners();
      
      this.isInitialized = true;
      this.logger.info('AudioRecorderService initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize AudioRecorderService:', error);
      throw error;
    }
  }

  setupEventListeners() {
    // Audio data received
    this.listeners.push(
      audioRecorderEmitter.addListener('audioDataReceived', (data) => {
        this.handleAudioData(data);
      })
    );

    // Recording state changes
    this.listeners.push(
      audioRecorderEmitter.addListener('recordingStateChanged', (state) => {
        this.handleRecordingStateChange(state);
      })
    );

    // Error events
    this.listeners.push(
      audioRecorderEmitter.addListener('recordingError', (error) => {
        this.handleRecordingError(error);
      })
    );
  }

  handleAudioData(data) {
    try {
      // Add new audio data to buffer
      this.buffer.push({
        data: data.audioData,
        timestamp: data.timestamp,
        size: data.size,
      });
      
      this.bufferSize += data.size;
      
      // Maintain circular buffer
      this.maintainCircularBuffer();
      
      this.logger.debug(`Audio data received: ${data.size} bytes, buffer size: ${this.bufferSize}`);
    } catch (error) {
      this.logger.error('Error handling audio data:', error);
    }
  }

  maintainCircularBuffer() {
    // Remove oldest data if buffer exceeds maximum size
    while (this.bufferSize > this.maxBufferSize && this.buffer.length > 0) {
      const oldestData = this.buffer.shift();
      this.bufferSize -= oldestData.size;
    }
  }

  handleRecordingStateChange(state) {
    this.isRecording = state.isRecording;
    this.recordingStartTime = state.startTime;
    
    this.logger.info(`Recording state changed: ${state.isRecording ? 'started' : 'stopped'}`);
  }

  handleRecordingError(error) {
    this.logger.error('Recording error:', error);
    this.isRecording = false;
  }

  async startRecording() {
    try {
      if (!this.isInitialized) {
        throw new Error('AudioRecorderService not initialized');
      }
      
      if (this.isRecording) {
        this.logger.warn('Recording already in progress');
        return;
      }
      
      this.logger.info('Starting audio recording...');
      
      if (Platform.OS === 'android') {
        await AudioRecorderModule.startRecording();
      }
      
      this.isRecording = true;
      this.recordingStartTime = Date.now();
      
      this.logger.info('Audio recording started successfully');
    } catch (error) {
      this.logger.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording() {
    try {
      if (!this.isRecording) {
        this.logger.warn('No recording in progress');
        return;
      }
      
      this.logger.info('Stopping audio recording...');
      
      if (Platform.OS === 'android') {
        await AudioRecorderModule.stopRecording();
      }
      
      this.isRecording = false;
      
      this.logger.info('Audio recording stopped successfully');
    } catch (error) {
      this.logger.error('Failed to stop recording:', error);
      throw error;
    }
  }

  async saveLast30Minutes() {
    try {
      this.logger.info('Saving last 30 minutes of audio...');
      
      if (this.buffer.length === 0) {
        throw new Error('No audio data available to save');
      }
      
      // Create output file
      const fileName = this.generateFileName();
      const outputPath = await this.createOutputFile(fileName);
      
      // Combine all buffer data
      const combinedData = this.combineBufferData();
      
      // Write to file
      await this.writeAudioFile(outputPath, combinedData);
      
      this.logger.info(`Audio saved successfully: ${outputPath}`);
      return outputPath;
    } catch (error) {
      this.logger.error('Failed to save audio:', error);
      throw error;
    }
  }

  generateFileName() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    return `${AUDIO_CONFIG.filePrefix}${timestamp}${AUDIO_CONFIG.fileExtension}`;
  }

  async createOutputFile(fileName) {
    // This would integrate with react-native-fs to create the file
    // For now, return a placeholder path
    return `/storage/emulated/0/Download/${fileName}`;
  }

  combineBufferData() {
    // Combine all audio data from buffer
    let combinedData = Buffer.alloc(0);
    
    for (const bufferItem of this.buffer) {
      combinedData = Buffer.concat([combinedData, bufferItem.data]);
    }
    
    return combinedData;
  }

  async writeAudioFile(filePath, audioData) {
    // This would integrate with react-native-fs to write the file
    // For now, just log the operation
    this.logger.info(`Writing ${audioData.length} bytes to ${filePath}`);
  }

  getBufferInfo() {
    return {
      bufferSize: this.bufferSize,
      maxBufferSize: this.maxBufferSize,
      bufferLength: this.buffer.length,
      recordingDuration: this.isRecording ? Date.now() - this.recordingStartTime : 0,
      isRecording: this.isRecording,
    };
  }

  clearBuffer() {
    this.buffer = [];
    this.bufferSize = 0;
    this.logger.info('Audio buffer cleared');
  }

  cleanup() {
    // Remove event listeners
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
    
    // Stop recording if active
    if (this.isRecording) {
      this.stopRecording();
    }
    
    // Clear buffer
    this.clearBuffer();
    
    this.logger.info('AudioRecorderService cleaned up');
  }
}

// Export singleton instance
export const audioRecorderService = new AudioRecorderService(); 