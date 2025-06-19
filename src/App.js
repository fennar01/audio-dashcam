import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {AudioRecorderService} from './services/AudioRecorderService';
import {NotificationService} from './services/NotificationService';
import {PermissionService} from './services/PermissionService';
import {MainScreen} from './components/MainScreen';
import {LoadingScreen} from './components/LoadingScreen';

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing Audio Dashcam...');
      
      // Check and request permissions
      const permissionsGranted = await PermissionService.requestPermissions();
      setHasPermissions(permissionsGranted);
      
      if (!permissionsGranted) {
        setError('Required permissions not granted');
        setIsInitialized(true);
        return;
      }

      // Initialize services
      await NotificationService.initialize();
      await AudioRecorderService.initialize();
      
      setIsInitialized(true);
      console.log('Audio Dashcam initialized successfully');
    } catch (err) {
      console.error('Failed to initialize app:', err);
      setError(err.message);
      setIsInitialized(true);
    }
  };

  const startRecording = async () => {
    try {
      await AudioRecorderService.startRecording();
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      await AudioRecorderService.stopRecording();
      setIsRecording(false);
      console.log('Recording stopped');
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const saveLast30Minutes = async () => {
    try {
      const savedFile = await AudioRecorderService.saveLast30Minutes();
      Alert.alert('Success', `Audio saved: ${savedFile}`);
    } catch (err) {
      console.error('Failed to save audio:', err);
      Alert.alert('Error', 'Failed to save audio');
    }
  };

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Initialization Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.errorHint}>
            Please check your permissions and try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <MainScreen
        isRecording={isRecording}
        hasPermissions={hasPermissions}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onSaveLast30Minutes={saveLast30Minutes}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorHint: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
});

export default App; 