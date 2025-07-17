# 🎤 Voice Features Implementation

## Overview

This implementation adds comprehensive voice capabilities to the backoffice chat system, allowing users to:
- **Speak to AI**: Use speech-to-text for voice input
- **Listen to AI**: Get text-to-speech audio responses
- **Visual Feedback**: Beautiful UI with recording animations and audio controls

## 🚀 Features Implemented

### 1. **Speech-to-Text (STT)**
- **OpenAI Whisper API** integration
- Real-time voice recording with visual feedback
- Automatic transcription and message sending
- Multi-language support (auto-detection)
- Error handling and user feedback

### 2. **Text-to-Speech (TTS)**
- **OpenAI TTS API** integration
- High-quality voice synthesis
- Multiple voice options (Nova, Alloy, Echo, Fable, Onyx, Shimmer)
- Adjustable speech speed
- Audio playback controls

### 3. **Beautiful UI Components**
- **VoiceRecorder**: Animated recording button with level indicators
- **VoicePlayer**: Audio controls with progress bar and playback
- **Voice Toggle**: Easy enable/disable switch in chat header
- **Visual Feedback**: Recording animations, status badges, and progress indicators

## 🏗️ Architecture

### Frontend Components

```
src/
├── components/ui/
│   ├── voice-recorder.tsx     # Recording interface with animations
│   ├── voice-player.tsx       # Audio playback controls
│   └── progress.tsx           # Progress bar component
├── api/services/
│   ├── voice-service.ts       # Core voice functionality
│   └── ai-service.ts          # Enhanced with voice methods
└── features/chats/components/
    └── ConversationPanel.tsx  # Updated with voice integration
```

### Backend Endpoints

```
backend/src/routes/aiRoutes.js
├── POST /api/ai/speech-to-text    # Convert audio to text
├── POST /api/ai/text-to-speech    # Convert text to audio
└── GET  /api/ai/health           # Service health check
```

## 🔧 Setup Instructions

### 1. **Environment Variables**

Add to your `.env` file:

```bash
# OpenAI API Key (required for voice features)
OPENAI_API_KEY=your_openai_api_key_here

# AI Service URL (optional, defaults to localhost:5001)
AI_SERVICE_URL=http://localhost:5001
```

### 2. **Install Dependencies**

Backend dependencies:
```bash
cd backend
npm install multer form-data
```

Frontend dependencies are already included in the existing setup.

### 3. **Browser Permissions**

Voice features require:
- **Microphone permission** for speech input
- **HTTPS connection** for production (required by Web Audio API)
- **Modern browser** with MediaRecorder support

## 🎯 Usage Guide

### For Users

1. **Enable Voice Mode**
   - Toggle the "Voice" switch in the chat header
   - Grant microphone permission when prompted

2. **Voice Input**
   - Click the microphone button to start recording
   - Speak your message clearly
   - Click stop or the button again to finish
   - Message will be transcribed and sent automatically

3. **Audio Responses**
   - AI responses will have audio controls when voice mode is enabled
   - Click the speaker icon to generate audio
   - Use play/pause/stop controls to manage playback

### For Developers

#### Voice Service API

```typescript
import { voiceService } from '@/api/services/voice-service'

// Check browser support
const isSupported = voiceService.isVoiceSupported()

// Request microphone permission
const hasPermission = await voiceService.requestMicrophonePermission()

// Start recording
const started = await voiceService.startRecording()

// Stop recording and get audio blob
const audioBlob = await voiceService.stopRecording()

// Convert speech to text
const transcription = await voiceService.speechToText(audioBlob)

// Convert text to speech
const audioResponse = await voiceService.textToSpeech("Hello world")
```

#### AI Service Integration

```typescript
import { aiService } from '@/api/services/ai-service'

// Send message with voice enabled
const response = await aiService.sendChatMessage("Hello", true)

// Voice-specific methods
const isSupported = aiService.isVoiceSupported()
const transcription = await aiService.speechToText(audioBlob)
const audioUrl = await aiService.textToSpeech("Response text")
```

## 🎨 UI Components

### VoiceRecorder Component

```tsx
<VoiceRecorder
  onStartRecording={handleStartRecording}
  onStopRecording={handleStopRecording}
  onTranscriptionComplete={handleTranscriptionComplete}
  onError={handleVoiceError}
  isProcessing={isProcessingVoice}
  disabled={isLoading}
/>
```

**Features:**
- Animated recording button with pulsing effect
- Real-time audio level visualization
- Recording timer and status indicators
- Error handling with user feedback

### VoicePlayer Component

```tsx
<VoicePlayer
  audioUrl={audioUrl}
  text={responseText}
  onGenerateAudio={handleGenerateAudio}
  isGenerating={isGeneratingAudio}
  autoPlay={false}
  showText={true}
/>
```

**Features:**
- Play/pause/stop controls
- Progress bar with time display
- Volume control and mute
- Generate audio button for text without audio
- Visual status indicators

## 🔊 Voice Configuration

### Available Voices

- **Nova** (default): Balanced, natural voice
- **Alloy**: Neutral, versatile voice
- **Echo**: Friendly, conversational voice
- **Fable**: Expressive, storytelling voice
- **Onyx**: Deep, authoritative voice
- **Shimmer**: Bright, energetic voice

### Customization

```typescript
// Update voice configuration
voiceService.updateConfig({
  voice: 'nova',  // Voice selection
  speed: 1.0      // Speech speed (0.25 - 4.0)
})
```

## 🔒 Security & Privacy

### Data Handling
- **Audio data** is processed in real-time and not stored
- **Transcriptions** are handled securely through OpenAI API
- **User permissions** are requested before accessing microphone
- **HTTPS required** for production deployment

### API Security
- OpenAI API key is stored securely in environment variables
- File upload limits prevent abuse (25MB max)
- Request timeouts prevent hanging connections
- Error handling prevents information leakage

## 🐛 Troubleshooting

### Common Issues

1. **Microphone Permission Denied**
   - Check browser settings
   - Ensure HTTPS in production
   - Try refreshing the page

2. **Audio Not Playing**
   - Check browser audio permissions
   - Verify OpenAI API key is configured
   - Check network connectivity

3. **Transcription Errors**
   - Speak clearly and reduce background noise
   - Check microphone quality
   - Ensure stable internet connection

4. **Voice Not Supported**
   - Use a modern browser (Chrome, Firefox, Safari, Edge)
   - Check if running on HTTPS
   - Verify MediaRecorder API support

### Debug Information

Enable debug logging:
```typescript
// In browser console
localStorage.setItem('voice-debug', 'true')
```

## 📊 Performance Considerations

### Optimization
- **Audio compression** reduces file size for faster uploads
- **Streaming support** for real-time processing
- **Caching** for generated audio responses
- **Lazy loading** of voice components

### Limits
- **Audio file size**: 25MB maximum
- **Text length**: 4096 characters for TTS
- **Request timeout**: 30 seconds
- **Concurrent requests**: Limited by OpenAI API quotas

## 🔮 Future Enhancements

### Planned Features
1. **Voice Commands**: Specific commands for actions
2. **Voice Profiles**: User-specific voice preferences
3. **Offline Support**: Local speech recognition fallback
4. **Voice Analytics**: Usage statistics and insights
5. **Custom Voices**: User-trained voice models

### Integration Ideas
1. **Meeting Transcription**: Record and transcribe meetings
2. **Voice Notes**: Audio note-taking functionality
3. **Accessibility**: Enhanced screen reader support
4. **Multi-language**: Automatic language detection and switching

## 📈 Monitoring & Analytics

### Key Metrics
- Voice feature adoption rate
- Speech recognition accuracy
- Audio generation success rate
- User satisfaction with voice quality
- Performance metrics (latency, errors)

### Health Checks
- OpenAI API connectivity
- Microphone permission status
- Browser compatibility
- Audio playback functionality

## 🤝 Contributing

### Adding New Voice Features

1. **Create feature branch**: `git checkout -b feature/voice-enhancement`
2. **Update voice service**: Add new functionality to `voice-service.ts`
3. **Add UI components**: Create reusable components in `components/ui/`
4. **Update backend**: Add necessary API endpoints
5. **Test thoroughly**: Ensure cross-browser compatibility
6. **Update documentation**: Add to this README

### Code Style
- Use TypeScript for type safety
- Follow existing component patterns
- Add proper error handling
- Include accessibility features
- Write comprehensive tests

## 📞 Support

For issues or questions about voice features:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify API key configuration
4. Test with different browsers/devices
5. Create detailed bug reports with steps to reproduce

---

**🎉 Enjoy the enhanced voice-powered chat experience!** 
 
 