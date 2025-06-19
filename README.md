# Audio Dashcam

A React Native application that continuously records audio in the background using a circular buffer, allowing users to save the last 30 minutes of audio to Google Drive with a single tap.

## Features

- **Continuous Background Recording**: Maintains a 30-minute circular audio buffer
- **Persistent Notification**: Shows recording status with "Save Last 30 Minutes" button
- **Google Drive Integration**: Seamless upload to user's Google Drive
- **Offline Support**: Queues uploads when offline, retries when connection restored
- **Battery Optimization**: Excludes app from Doze mode and background restrictions
- **Comprehensive Testing**: Full test suite with emulator-based integration tests

## Prerequisites

- **Node.js** (v16 or higher)
- **React Native CLI** (`npm install -g react-native-cli`)
- **Android Studio** with Android SDK (API level 21+)
- **Android Emulator** or physical Android device
- **Google Cloud Project** with Drive API enabled
- **OAuth 2.0 credentials** for Google Drive API

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/audio-dashcam.git
   cd audio-dashcam
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Android setup**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

4. **Configure Google API credentials**
   - Create a `google-services.json` file in `android/app/`
   - Add your OAuth 2.0 client ID and secret
   - Enable Google Drive API in Google Cloud Console

5. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your Google API credentials
   ```

## Usage

### Running on Emulator

1. **Start Android emulator**
   ```bash
   # Via Android Studio or command line
   emulator -avd Pixel_4_API_30
   ```

2. **Run the application**
   ```bash
   npx react-native run-android
   ```

3. **Grant permissions**
   - Allow microphone access when prompted
   - Grant notification permissions
   - Allow background app refresh

4. **Test core functionality**
   - Verify persistent notification appears
   - Test "Save Last 30 Minutes" button
   - Confirm Google Drive upload

### Building Release APK

```bash
cd android
./gradlew assembleRelease
```

The signed APK will be available at `android/app/build/outputs/apk/release/app-release.apk`

## Configuration

### Buffer Settings
```javascript
// src/config/audio.js
export const AUDIO_CONFIG = {
  bufferDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
  sampleRate: 44100,
  channels: 1,
  bitDepth: 16
};
```

### Google Drive Settings
```javascript
// src/config/drive.js
export const DRIVE_CONFIG = {
  folderId: 'your-drive-folder-id', // Optional: specific folder
  maxRetries: 3,
  retryDelay: 5000
};
```

### OAuth Settings
```javascript
// src/config/auth.js
export const OAUTH_CONFIG = {
  clientId: 'your-oauth-client-id',
  scopes: ['https://www.googleapis.com/auth/drive.file']
};
```

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests (Emulator)
```bash
# Start emulator first
npm run test:emulator
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## Project Structure

```
audio-dashcam/
├── android/                 # Android native code
├── ios/                    # iOS native code (future)
├── src/
│   ├── components/         # React components
│   ├── services/          # Core services (audio, drive, auth)
│   ├── modules/           # Feature modules
│   ├── config/            # Configuration files
│   ├── utils/             # Utility functions
│   └── App.js             # Main app component
├── test/
│   ├── emulator/          # Integration tests for emulator
│   └── unit/              # Unit tests
├── docs/                  # Documentation
├── scripts/               # Build and deployment scripts
├── README.md
└── CHANGELOG.md
```

## Roadmap

### Phase 1: Core Recording Service ✅
- [x] React Native project scaffold
- [x] Circular audio buffer implementation
- [x] Basic emulator integration tests

### Phase 2: Persistent Notification 🔄
- [ ] Foreground notification with save button
- [ ] Notification action handling
- [ ] Emulator notification tests

### Phase 3: Google Drive Integration 📋
- [ ] OAuth2 authentication flow
- [ ] Drive API integration
- [ ] Upload functionality with retry logic

### Phase 4: Robustness & Caching 📋
- [ ] Runtime permissions management
- [ ] Battery optimization whitelisting
- [ ] Offline queue and retry mechanisms

### Phase 5: Testing & Deployment 📋
- [ ] Comprehensive test coverage
- [ ] CI/CD pipeline setup
- [ ] Play Store preparation

## Development

### Key Dependencies

- **React Native**: Core framework
- **react-native-audio**: Audio recording and playback
- **@react-native-google-signin/google-signin**: Google OAuth
- **googleapis**: Google Drive API integration
- **@react-native-async-storage/async-storage**: Local storage
- **react-native-background-task**: Background processing
- **@react-native-community/push-notification**: Notifications

### Best Practices

- **Background Audio**: Uses `androidx.media` for reliable background recording
- **Secure Storage**: OAuth tokens stored in Android Keystore
- **Battery Optimization**: Implements `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`
- **Permission Handling**: Runtime permission requests with user guidance
- **Error Handling**: Comprehensive error boundaries and retry logic

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install development dependencies
npm install --save-dev @testing-library/react-native jest

# Run linter
npm run lint

# Run type checking
npm run type-check
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/audio-dashcam/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/audio-dashcam/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/audio-dashcam/discussions)

## Acknowledgments

- React Native community for the excellent framework
- Google Drive API team for comprehensive documentation
- Android developer community for background audio insights 