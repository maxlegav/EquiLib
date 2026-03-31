# Implementation Plan: EquiLib iOS App

## Overview

This implementation plan breaks down the EquiLib iOS app into discrete, incremental coding tasks. The app is a voice-first mental health navigation tool built with Expo + React Native (TypeScript), featuring on-device speech recognition (Whisper.cpp), AI conversation (Mistral Large), French TTS (Moshi), and Doctolib integration.

The implementation follows a bottom-up approach: core infrastructure first, then audio processing, conversation engine, UI components, and finally integration and testing.

## Tasks

- [ ] 1. Project setup and core infrastructure
  - Initialize Expo TypeScript project with required dependencies
  - Configure TypeScript, ESLint, and Prettier
  - Set up folder structure: `/src/components`, `/src/screens`, `/src/services`, `/src/types`, `/src/utils`
  - Install core dependencies: expo-av, @react-native-community/netinfo, @react-native-async-storage/async-storage, expo-secure-store
  - Configure environment variables for API keys (Mistral API)
  - Set up navigation structure with React Navigation (bottom tabs + stack)
  - _Requirements: 17.1, 17.2, 7.1_

- [ ] 2. Type definitions and data models
  - [ ] 2.1 Create TypeScript interfaces for all data models
    - Define types in `/src/types/models.ts`: UserProfile, Location, UserPreferences, Conversation, Message, TriageResult, Practitioner, CrisisEvent
    - Define API types: MistralStreamRequest, MistralStreamChunk, TriageResponse
    - Define component prop types for all screens
    - _Requirements: 1.2, 2.7, 3.7, 5.4, 6.2_

- [ ] 3. Local storage and encryption layer
  - [ ] 3.1 Implement secure storage service
    - Create `/src/services/storage/SecureStorage.ts` with methods: saveUserProfile, getUserProfile, saveCrisisEvent
    - Use expo-secure-store for sensitive data encryption
    - _Requirements: 8.1, 8.2_
  
  - [ ] 3.2 Implement general storage service
    - Create `/src/services/storage/LocalStorage.ts` with methods: saveConversations, getConversations, cachePractitioners
    - Use AsyncStorage for non-sensitive data
    - _Requirements: 10.1, 11.5_
  
  - [ ] 3.3 Write property test for storage persistence
    - **Property 1: Preference Persistence Round-Trip**
    - **Property 24: Conversation Storage Completeness**
    - **Validates: Requirements 1.4, 1.5, 10.1**


- [ ] 4. Audio processing infrastructure
  - [ ] 4.1 Set up expo-av audio session configuration
    - Create `/src/services/audio/AudioSession.ts` to configure audio modes for recording and playback
    - Implement permission handling for microphone access
    - _Requirements: 15.2, 17.2_
  
  - [ ] 4.2 Integrate Whisper.rn for on-device STT
    - Install whisper.rn dependency
    - Download and bundle Whisper base model for French
    - Create `/src/services/audio/WhisperTranscriber.ts` with initialize and transcribe methods
    - _Requirements: 2.2, 2.5, 15.5, 15.6, 17.3, 17.4_
  
  - [ ] 4.3 Implement audio recording service
    - Create `/src/services/audio/AudioRecorder.ts` with startRecording, stopRecording, getWaveformData methods
    - Configure recording settings: 16kHz sample rate, mono channel, WAV format for iOS
    - Implement real-time waveform data extraction for visualization
    - _Requirements: 2.1, 2.3, 15.3, 15.4_
  
  - [ ] 4.4 Write unit tests for audio recording
    - Test recording start/stop flow
    - Test permission denial handling
    - Test waveform data extraction
    - _Requirements: 15.2, 15.3_
  
  - [ ] 4.5 Integrate Moshi TTS for French voice synthesis
    - Research and integrate Kyutai Moshi TTS library
    - Create `/src/services/audio/MoshiSynthesizer.ts` with synthesize and stream methods
    - Configure voice settings: professional tone, 1.0 speed, French language
    - _Requirements: 16.2, 16.3, 16.4, 17.8_
  
  - [ ] 4.6 Implement TTS playback service
    - Create `/src/services/audio/TTSPlayer.ts` with playTTS, stopPlayback, pause, resume methods
    - Use expo-av for audio playback
    - Implement playback status callbacks for waveform visualization
    - _Requirements: 16.1, 16.5, 16.6, 16.7_
  
  - [ ] 4.7 Write property test for transcription
    - **Property 40: Transcription Display**
    - **Validates: Requirements 15.5**

- [ ] 5. Checkpoint - Audio processing validation
  - Ensure all audio tests pass, verify on-device transcription works, ask the user if questions arise.


- [ ] 6. AI conversation engine and LLM integration
  - [ ] 6.1 Implement WebSocket client for Mistral Large streaming
    - Create `/src/services/ai/MistralWebSocket.ts` with connect, sendMessage, disconnect methods
    - Implement reconnection logic with exponential backoff
    - Handle message queue for offline scenarios
    - _Requirements: 2.6, 14.3, 17.5, 17.6_
  
  - [ ] 6.2 Create conversation engine service
    - Create `/src/services/ai/ConversationEngine.ts` with startConversation, sendMessage, endConversation methods
    - Maintain conversation context (message history)
    - Implement tone adaptation (supportive vs direct)
    - Stream AI responses via WebSocket
    - _Requirements: 2.4, 2.5, 2.6, 2.7_
  
  - [ ] 6.3 Write property tests for conversation engine
    - **Property 2: Conversation Length Constraint**
    - **Property 3: Tone Adaptation**
    - **Property 4: Chronological Message Ordering**
    - **Validates: Requirements 2.5, 2.6, 2.7**
  
  - [ ] 6.4 Implement triage analysis service
    - Create `/src/services/ai/TriageSystem.ts` with analyzeConversation, classifyDomain, assessSeverity, recommendSpecialist methods
    - Use Mistral Large REST API with JSON response format
    - Generate triage result with all required fields
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ] 6.5 Write property tests for triage system
    - **Property 5: Triage Generation Completeness**
    - **Property 6: Domain Classification Validity**
    - **Property 7: Severity Range Constraint**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.7**
  
  - [ ] 6.6 Implement crisis detection service
    - Create `/src/services/ai/CrisisDetector.ts` with analyzeMessage, detectSuicidalIdeation, detectSelfHarm, detectViolence methods
    - Define French crisis keyword patterns (regex)
    - Implement LLM-based nuanced crisis detection
    - _Requirements: 4.1_
  
  - [ ] 6.7 Write property tests for crisis detection
    - **Property 9: Crisis Detection Triggers Response**
    - **Property 11: Crisis Bypasses Standard Flow**
    - **Validates: Requirements 4.1, 4.4**

- [ ] 7. Practitioner recommendation system
  - [ ] 7.1 Create practitioner data models and mock data
    - Define Practitioner interface with all required fields
    - Create mock practitioner database in `/src/data/practitioners.ts` (at least 20 practitioners)
    - Include variety of specialties, locations, ratings, availability
    - _Requirements: 5.4_
  
  - [ ] 7.2 Implement practitioner recommender service
    - Create `/src/services/practitioners/PractitionerRecommender.ts` with findPractitioners, rankPractitioners methods
    - Implement filtering by specialist type, location, distance
    - Implement ranking algorithm (weighted: rating 40%, distance 40%, availability 20%)
    - Return top 3 practitioners
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 7.3 Write property tests for practitioner recommendation
    - **Property 13: Practitioner Recommendation Count**
    - **Property 14: Practitioner Ranking Order**
    - **Property 15: Specialist Type Filtering**
    - **Validates: Requirements 5.1, 5.2, 5.3**


- [ ] 8. Doctolib integration
  - [ ] 8.1 Implement Doctolib deep link generator
    - Create `/src/services/doctolib/DoctolibIntegration.ts` with generateDeepLink method
    - Build URL with query parameters: specialty, practitioner name, city, postal code
    - Implement fallback strategy: app deep link → web URL → contact info display
    - _Requirements: 6.4, 6.5_
  
  - [ ] 8.2 Write property test for Doctolib deep links
    - **Property 18: Doctolib Deep Link Parameters**
    - **Validates: Requirements 6.5**

- [ ] 9. UI component library (Doctolib-style design system)
  - [ ] 9.1 Create design tokens
    - Create `/src/styles/tokens.ts` with Colors, Typography, Spacing, BorderRadius constants
    - Define Doctolib blue (#0596DE), deep night blue (#0A1628), electric blue (#2563EB)
    - Define typography scale (h1, h2, h3, body, caption, small)
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [ ] 9.2 Create reusable Card component
    - Create `/src/components/Card.tsx` with variants: default, elevated, outlined
    - Support custom padding and onPress handler
    - Apply Doctolib design aesthetic (subtle shadows, rounded corners)
    - _Requirements: 12.3_
  
  - [ ] 9.3 Create reusable Button component
    - Create `/src/components/Button.tsx` with variants: primary, secondary, outline, ghost, crisis
    - Support sizes: sm, md, lg
    - Include loading state and disabled state
    - Apply Doctolib blue for primary buttons
    - _Requirements: 12.5_
  
  - [ ] 9.4 Create WaveformVisualizer component
    - Create `/src/components/WaveformVisualizer.tsx` with animated wave bars
    - Use React Native Reanimated for 60fps animation
    - Support states: idle, listening, processing, speaking, error
    - Sync animation with audio input/output levels
    - _Requirements: 2.3, 15.4, 16.5_
  
  - [ ] 9.5 Write unit tests for UI components
    - Test Card rendering with different variants
    - Test Button states and interactions
    - Test WaveformVisualizer animation states
    - _Requirements: 12.1, 12.2, 12.3_

- [ ] 10. Checkpoint - Core services and UI components complete
  - Ensure all tests pass, verify design tokens match Doctolib aesthetic, ask the user if questions arise.


- [ ] 11. Onboarding screens
  - [ ] 11.1 Create welcome screen
    - Create `/src/screens/onboarding/WelcomeScreen.tsx`
    - Display app logo, name, and brief description
    - Include "Commencer" button to proceed
    - _Requirements: 1.1_
  
  - [ ] 11.2 Create location setup screen
    - Create `/src/screens/onboarding/LocationScreen.tsx`
    - Request location permission
    - Display map view with current location
    - Provide manual city/postal code input as fallback
    - _Requirements: 1.2_
  
  - [ ] 11.3 Create conversation tone selection screen
    - Create `/src/screens/onboarding/ToneSelectionScreen.tsx`
    - Display two options: "Soutien" (Supportive) and "Direct"
    - Show description and preview example for each
    - _Requirements: 1.3_
  
  - [ ] 11.4 Create legal consent screen
    - Create `/src/screens/onboarding/LegalScreen.tsx`
    - Display terms and conditions, privacy policy, medical disclaimer
    - Include "J'accepte" button
    - Store consent in secure storage
    - _Requirements: 8.3, 8.5_
  
  - [ ] 11.5 Write property test for onboarding preferences
    - **Property 1: Preference Persistence Round-Trip**
    - **Validates: Requirements 1.4, 1.5**

- [ ] 12. Voice conversation screen (primary interface)
  - [ ] 12.1 Create VoiceConversationScreen layout
    - Create `/src/screens/VoiceConversationScreen.tsx`
    - Display conversation history (scrollable message list)
    - Show WaveformVisualizer component
    - Include microphone button (primary) and text input button (secondary)
    - _Requirements: 2.1, 2.7, 2.8_
  
  - [ ] 12.2 Implement MessageBubble component
    - Create `/src/components/MessageBubble.tsx`
    - Display user and AI messages with different styling
    - Show timestamp for each message
    - Support text and audio message types
    - _Requirements: 2.7_
  
  - [ ] 12.3 Implement voice input flow
    - Connect microphone button to AudioRecorder service
    - Show WaveformVisualizer during recording
    - Provide haptic feedback on start/stop
    - Transcribe audio using WhisperTranscriber
    - Display transcribed text with edit capability
    - _Requirements: 2.2, 2.3, 2.4, 15.1, 15.2, 15.3, 15.4, 15.7, 15.8, 15.9_
  
  - [ ] 12.4 Write property tests for voice input
    - **Property 38: Microphone Permission Request**
    - **Property 39: Recording Visual Indicator**
    - **Property 41: Transcription Editability**
    - **Validates: Requirements 15.2, 15.3, 15.6**
  
  - [ ] 12.5 Implement AI response streaming
    - Connect to ConversationEngine service
    - Stream AI responses incrementally as chunks arrive
    - Display streaming text in real-time
    - Trigger TTS playback for AI responses
    - Show WaveformVisualizer during TTS playback
    - _Requirements: 2.6, 14.3, 14.4, 16.1, 16.5_
  
  - [ ] 12.6 Write property test for streaming responses
    - **Property 37: Streaming Response Incremental Display**
    - **Validates: Requirements 14.3, 14.4**


- [ ] 13. Crisis detection and emergency response UI
  - [ ] 13.1 Create CrisisAlert component
    - Create `/src/components/CrisisAlert.tsx` as modal overlay
    - Display emergency hotline number 3114 prominently
    - Include direct call button with tel: link
    - Show "Numéro National de Prévention du Suicide" label
    - Display "Continuer la conversation" option
    - _Requirements: 4.2, 4.3_
  
  - [ ] 13.2 Integrate crisis detection in conversation flow
    - Monitor each user message with CrisisDetector service
    - Trigger CrisisAlert immediately when crisis detected
    - Bypass standard triage flow when crisis detected
    - Log crisis events securely
    - _Requirements: 4.1, 4.4_
  
  - [ ] 13.3 Write property tests for crisis detection
    - **Property 9: Crisis Detection Triggers Response**
    - **Property 10: Crisis Response Completeness**
    - **Property 11: Crisis Bypasses Standard Flow**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [ ] 14. Triage result screen
  - [ ] 14.1 Create TriageResultScreen layout
    - Create `/src/screens/TriageResultScreen.tsx`
    - Display triage result in card format
    - Show primary concern, recommended specialist, severity level (visual indicator)
    - Display medical disclaimer prominently
    - Show emergency hotline number
    - Include "Voir les praticiens" and "Sauvegarder" buttons
    - _Requirements: 3.6, 3.7, 4.5_
  
  - [ ] 14.2 Write property tests for triage display
    - **Property 8: Triage Disclaimer Presence**
    - **Property 12: Crisis Resources on Triage Screens**
    - **Validates: Requirements 3.6, 4.5**

- [ ] 15. Practitioner list and detail screens
  - [ ] 15.1 Create PractitionerListScreen
    - Create `/src/screens/PractitionerListScreen.tsx`
    - Display practitioner cards (top 3 from recommender)
    - Show photo, name, specialty, rating, distance, availability status
    - Include filter controls: specialty, distance, availability
    - _Requirements: 5.4, 5.5_
  
  - [ ] 15.2 Create PractitionerCard component
    - Create `/src/components/PractitionerCard.tsx`
    - Display all required practitioner fields
    - Show next available slot if available
    - Include "Prendre RDV sur Doctolib" button
    - _Requirements: 5.4_
  
  - [ ] 15.3 Write property tests for practitioner display
    - **Property 16: Practitioner Display Completeness**
    - **Validates: Requirements 5.4, 6.2**
  
  - [ ] 15.4 Implement practitioner filtering
    - Add filter UI controls (dropdowns/toggles)
    - Update practitioner list when filters applied
    - Ensure update happens within 1 second
    - _Requirements: 5.5, 5.6_


- [ ] 16. Booking confirmation and Doctolib redirect
  - [ ] 16.1 Create BookingConfirmationScreen
    - Create `/src/screens/BookingConfirmationScreen.tsx`
    - Display selected practitioner details
    - Show next steps for booking
    - Display emergency hotline number
    - Include "Confirmer et réserver" button
    - _Requirements: 6.1, 6.2, 6.3, 6.6_
  
  - [ ] 16.2 Implement Doctolib redirect flow
    - Connect "Confirmer et réserver" button to DoctolibIntegration service
    - Generate deep link with pre-filled parameters
    - Open Doctolib app or website
    - Handle fallback scenarios
    - _Requirements: 6.4, 6.5_
  
  - [ ] 16.3 Write property tests for booking flow
    - **Property 17: Booking Confirmation Navigation**
    - **Property 18: Doctolib Deep Link Parameters**
    - **Validates: Requirements 6.1, 6.2, 6.5**

- [ ] 17. Navigation structure and bottom tabs
  - [ ] 17.1 Implement bottom tab navigation
    - Configure React Navigation bottom tabs
    - Create 4 tabs: Chat, Triage, Practitioners, Profile
    - Apply Doctolib design styling
    - Highlight active tab
    - _Requirements: 7.1, 7.3_
  
  - [ ] 17.2 Create Triage history screen
    - Create `/src/screens/TriageHistoryScreen.tsx`
    - Display list of past conversations and triage results
    - Sort by date (most recent first)
    - Allow selection to view full conversation
    - _Requirements: 10.2, 10.3, 10.4_
  
  - [ ] 17.3 Write property tests for navigation
    - **Property 19: Active Tab Highlighting**
    - **Property 20: Navigation State Persistence**
    - **Property 26: Conversation History Sort Order**
    - **Validates: Requirements 7.3, 7.4, 10.4**

- [ ] 18. Profile and account management screen
  - [ ] 18.1 Create ProfileScreen
    - Create `/src/screens/ProfileScreen.tsx`
    - Display user preferences (location, conversation tone)
    - Provide edit buttons for each preference
    - Include "Supprimer mon compte" button
    - Link to privacy policy
    - _Requirements: 8.5, 9.1, 9.2, 9.3, 9.5_
  
  - [ ] 18.2 Implement preference update flow
    - Allow user to update location
    - Allow user to change conversation tone
    - Apply changes immediately
    - Persist changes to secure storage
    - _Requirements: 9.2, 9.3, 9.6_
  
  - [ ] 18.3 Write property test for preference updates
    - **Property 23: Preference Update Immediacy**
    - **Validates: Requirements 9.2, 9.3, 9.6**
  
  - [ ] 18.4 Implement account deletion flow
    - Show confirmation dialog
    - Delete all user data from local storage (profile, conversations, triage results)
    - Clear secure storage
    - Navigate back to onboarding
    - _Requirements: 8.6, 9.5_
  
  - [ ] 18.5 Write property test for account deletion
    - **Property 22: Account Deletion Completeness**
    - **Validates: Requirements 8.6**


- [ ] 19. Conversation history management
  - [ ] 19.1 Implement conversation storage and retrieval
    - Store completed conversations with all messages
    - Retrieve conversation history sorted by date
    - Load individual conversation with full details
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ] 19.2 Write property tests for conversation history
    - **Property 24: Conversation Storage Completeness**
    - **Property 25: Past Conversation Retrieval**
    - **Property 26: Conversation History Sort Order**
    - **Validates: Requirements 10.1, 10.3, 10.4**
  
  - [ ] 19.3 Implement conversation deletion
    - Add delete button to conversation items
    - Show confirmation dialog
    - Remove conversation from storage
    - Update UI immediately
    - _Requirements: 10.5_
  
  - [ ] 19.4 Write property test for conversation deletion
    - **Property 27: Conversation Deletion**
    - **Validates: Requirements 10.5**

- [ ] 20. Checkpoint - All screens and navigation complete
  - Ensure all tests pass, verify navigation flows work end-to-end, ask the user if questions arise.

- [ ] 21. Network error handling and offline support
  - [ ] 21.1 Implement network status monitoring
    - Create `/src/services/network/NetworkMonitor.ts` using @react-native-community/netinfo
    - Provide useNetworkStatus hook
    - Update global state with online/offline status
    - _Requirements: 11.1_
  
  - [ ] 21.2 Create offline indicator UI
    - Create `/src/components/OfflineIndicator.tsx`
    - Display banner when offline
    - Show in all screens
    - _Requirements: 11.1_
  
  - [ ] 21.3 Implement offline conversation prevention
    - Disable conversation start when offline
    - Show explanation message
    - _Requirements: 11.2_
  
  - [ ] 21.4 Write property tests for offline handling
    - **Property 28: Offline State Detection and Messaging**
    - **Property 29: Offline Conversation Prevention**
    - **Validates: Requirements 11.1, 11.2**
  
  - [ ] 21.5 Implement request timeout handling
    - Add timeout configuration to all API calls (30 seconds)
    - Show timeout error message with retry button
    - _Requirements: 11.3_
  
  - [ ] 21.6 Implement retry mechanism
    - Create retry button component
    - Resend last message on retry
    - Use exponential backoff for automatic retries
    - _Requirements: 11.3, 11.4_
  
  - [ ] 21.7 Write property tests for retry mechanism
    - **Property 30: Timeout Handling with Retry**
    - **Property 31: Retry Resends Last Message**
    - **Validates: Requirements 11.3, 11.4**
  
  - [ ] 21.8 Implement practitioner list caching
    - Cache practitioner list when loaded online
    - Serve cached data when offline
    - Show "cached data" indicator when offline
    - _Requirements: 11.5_
  
  - [ ] 21.9 Write property test for caching
    - **Property 32: Practitioner List Caching**
    - **Validates: Requirements 11.5**


- [ ] 22. Accessibility implementation
  - [ ] 22.1 Add accessibility labels to all interactive elements
    - Add accessibilityLabel to all buttons, inputs, links
    - Add accessibilityHint for complex interactions
    - Add accessibilityRole for semantic meaning
    - _Requirements: 12.9_
  
  - [ ] 22.2 Write property test for accessibility labels
    - **Property 33: Accessibility Label Completeness**
    - **Validates: Requirements 12.9**
  
  - [ ] 22.3 Implement Dynamic Type support
    - Use scalable font sizes based on iOS text size settings
    - Test with different text size settings
    - Ensure layout adapts to larger text
    - _Requirements: 12.10_
  
  - [ ] 22.4 Write property test for Dynamic Type
    - **Property 34: Dynamic Type Support**
    - **Validates: Requirements 12.10**
  
  - [ ] 22.5 Ensure text contrast ratios
    - Verify all text meets 4.5:1 contrast ratio
    - Adjust colors if needed
    - Test with contrast checker tool
    - _Requirements: 12.11_
  
  - [ ] 22.6 Write property test for contrast ratios
    - **Property 35: Text Contrast Ratio**
    - **Validates: Requirements 12.11**
  
  - [ ] 22.7 Implement Dark Mode support
    - Create dark theme color palette
    - Use iOS appearance API to detect dark mode
    - Apply dark theme styling to all screens
    - _Requirements: 12.13_
  
  - [ ] 22.8 Write property test for Dark Mode
    - **Property 36: Dark Mode Support**
    - **Validates: Requirements 12.13**
  
  - [ ] 22.9 Test VoiceOver compatibility
    - Test all screens with VoiceOver enabled
    - Ensure logical navigation order
    - Verify all content is accessible
    - _Requirements: 12.9_

- [ ] 23. Performance optimization
  - [ ] 23.1 Optimize app launch time
    - Lazy load heavy components
    - Preload Whisper model on app start
    - Minimize initial bundle size
    - _Requirements: 14.1_
  
  - [ ] 23.2 Optimize chat message rendering
    - Memoize MessageBubble components
    - Use FlatList with virtualization for message list
    - Ensure render time under 100ms
    - _Requirements: 14.2_
  
  - [ ] 23.3 Optimize waveform animation
    - Use React Native Reanimated for 60fps animation
    - Minimize re-renders during animation
    - Test on iPhone 12 and newer
    - _Requirements: 14.5_
  
  - [ ] 23.4 Optimize image loading
    - Use expo-image for practitioner photos
    - Implement lazy loading and caching
    - Add placeholder images
    - _Requirements: 5.4_


- [ ] 24. Error handling implementation
  - [ ] 24.1 Create error handler services
    - Create `/src/services/errors/NetworkErrorHandler.ts`
    - Create `/src/services/errors/AudioErrorHandler.ts`
    - Create `/src/services/errors/LLMErrorHandler.ts`
    - Create `/src/services/errors/StorageErrorHandler.ts`
    - Create `/src/services/errors/CrisisErrorHandler.ts`
    - Implement user-friendly error messages in French
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [ ] 24.2 Create error UI components
    - Create `/src/components/ErrorMessage.tsx` for inline errors
    - Create `/src/components/ErrorDialog.tsx` for modal errors
    - Include retry buttons where applicable
    - _Requirements: 11.3_
  
  - [ ] 24.3 Implement graceful degradation
    - Fall back to text input when voice fails
    - Show cached data when network fails
    - Display helpful error messages
    - _Requirements: 11.2, 11.5_
  
  - [ ] 24.4 Write unit tests for error handlers
    - Test each error type and corresponding user message
    - Test retry logic
    - Test fallback mechanisms
    - _Requirements: 11.1, 11.2, 11.3_

- [ ] 25. Data encryption and security
  - [ ] 25.1 Implement data encryption utilities
    - Create `/src/utils/encryption.ts` with encryptData and decryptData functions
    - Use expo-crypto for encryption
    - Apply encryption to all conversation data
    - _Requirements: 8.1, 8.2_
  
  - [ ] 25.2 Write property test for encryption
    - **Property 21: Conversation Data Encryption at Rest**
    - **Validates: Requirements 8.1**
  
  - [ ] 25.3 Implement API key management
    - Store API keys in environment variables
    - Never log API keys
    - Sanitize logs to remove sensitive data
    - _Requirements: 8.2_
  
  - [ ] 25.4 Implement RGPD compliance utilities
    - Create `/src/services/rgpd/RGPDManager.ts` with recordConsent, deleteUserData, exportUserData methods
    - Store consent records
    - Implement data export functionality
    - _Requirements: 8.3, 8.4, 8.6_

- [ ] 26. Checkpoint - Error handling, security, and performance complete
  - Ensure all tests pass, verify error scenarios work correctly, ask the user if questions arise.


- [ ] 27. State management implementation
  - [ ] 27.1 Create global app state context
    - Create `/src/context/AppContext.tsx` with AppState interface
    - Define state: user, currentConversation, conversations, triageResults, practitioners, isOnline, audioState
    - Implement reducer with all action types
    - _Requirements: 2.7, 10.1_
  
  - [ ] 27.2 Create custom hooks for state access
    - Create `/src/hooks/useAppState.ts`
    - Create `/src/hooks/useConversation.ts`
    - Create `/src/hooks/useAudioState.ts`
    - Create `/src/hooks/useNetworkStatus.ts`
    - _Requirements: 2.7, 11.1_
  
  - [ ] 27.3 Write unit tests for state management
    - Test reducer actions
    - Test state updates
    - Test hook behavior
    - _Requirements: 2.7, 10.1_

- [ ] 28. Integration and wiring
  - [ ] 28.1 Wire audio services to VoiceConversationScreen
    - Connect AudioRecorder to microphone button
    - Connect WhisperTranscriber to transcription flow
    - Connect TTSPlayer to AI response playback
    - Connect WaveformVisualizer to audio state
    - _Requirements: 2.1, 2.2, 2.3, 15.1, 16.1_
  
  - [ ] 28.2 Wire ConversationEngine to VoiceConversationScreen
    - Connect message sending to ConversationEngine
    - Stream AI responses to message list
    - Handle conversation completion
    - _Requirements: 2.4, 2.5, 2.6, 14.3_
  
  - [ ] 28.3 Wire CrisisDetector to conversation flow
    - Monitor each message for crisis indicators
    - Trigger CrisisAlert when detected
    - Bypass triage when crisis detected
    - _Requirements: 4.1, 4.2, 4.4_
  
  - [ ] 28.4 Wire TriageSystem to conversation completion
    - Trigger triage analysis when conversation ends
    - Navigate to TriageResultScreen with result
    - Store triage result in state and local storage
    - _Requirements: 3.1, 3.5_
  
  - [ ] 28.5 Wire PractitionerRecommender to TriageResultScreen
    - Load practitioners based on triage result
    - Navigate to PractitionerListScreen
    - Pass triage context to practitioner screen
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 28.6 Wire DoctolibIntegration to BookingConfirmationScreen
    - Generate deep link on confirmation
    - Open Doctolib app or website
    - Handle errors and fallbacks
    - _Requirements: 6.4, 6.5_
  
  - [ ] 28.7 Wire storage services to all screens
    - Save conversations after completion
    - Load conversation history in TriageHistoryScreen
    - Save and load user preferences in ProfileScreen
    - _Requirements: 8.1, 10.1, 10.2_


- [ ] 29. Comprehensive property-based testing
  - [ ] 29.1 Write remaining property tests for conversation flow
    - **Property 2: Conversation Length Constraint**
    - **Property 3: Tone Adaptation**
    - **Property 4: Chronological Message Ordering**
    - **Validates: Requirements 2.5, 2.6, 2.7**
  
  - [ ] 29.2 Write remaining property tests for triage
    - **Property 5: Triage Generation Completeness**
    - **Property 6: Domain Classification Validity**
    - **Property 7: Severity Range Constraint**
    - **Property 8: Triage Disclaimer Presence**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.6, 3.7**
  
  - [ ] 29.3 Write remaining property tests for crisis detection
    - **Property 9: Crisis Detection Triggers Response**
    - **Property 10: Crisis Response Completeness**
    - **Property 11: Crisis Bypasses Standard Flow**
    - **Property 12: Crisis Resources on Triage Screens**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**
  
  - [ ] 29.4 Write remaining property tests for practitioners
    - **Property 13: Practitioner Recommendation Count**
    - **Property 14: Practitioner Ranking Order**
    - **Property 15: Specialist Type Filtering**
    - **Property 16: Practitioner Display Completeness**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
  
  - [ ] 29.5 Write remaining property tests for booking flow
    - **Property 17: Booking Confirmation Navigation**
    - **Property 18: Doctolib Deep Link Parameters**
    - **Validates: Requirements 6.1, 6.2, 6.5**
  
  - [ ] 29.6 Write remaining property tests for navigation
    - **Property 19: Active Tab Highlighting**
    - **Property 20: Navigation State Persistence**
    - **Validates: Requirements 7.3, 7.4**
  
  - [ ] 29.7 Write remaining property tests for data management
    - **Property 21: Conversation Data Encryption at Rest**
    - **Property 22: Account Deletion Completeness**
    - **Property 23: Preference Update Immediacy**
    - **Property 24: Conversation Storage Completeness**
    - **Property 25: Past Conversation Retrieval**
    - **Property 26: Conversation History Sort Order**
    - **Property 27: Conversation Deletion**
    - **Validates: Requirements 8.1, 8.6, 9.2, 9.3, 9.6, 10.1, 10.3, 10.4, 10.5**
  
  - [ ] 29.8 Write remaining property tests for offline and error handling
    - **Property 28: Offline State Detection and Messaging**
    - **Property 29: Offline Conversation Prevention**
    - **Property 30: Timeout Handling with Retry**
    - **Property 31: Retry Resends Last Message**
    - **Property 32: Practitioner List Caching**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**
  
  - [ ] 29.9 Write remaining property tests for accessibility
    - **Property 33: Accessibility Label Completeness**
    - **Property 34: Dynamic Type Support**
    - **Property 35: Text Contrast Ratio**
    - **Property 36: Dark Mode Support**
    - **Validates: Requirements 12.9, 12.10, 12.11, 12.13**
  
  - [ ] 29.10 Write remaining property tests for performance
    - **Property 37: Streaming Response Incremental Display**
    - **Validates: Requirements 14.3, 14.4**
  
  - [ ] 29.11 Write remaining property tests for voice input
    - **Property 38: Microphone Permission Request**
    - **Property 39: Recording Visual Indicator**
    - **Property 40: Transcription Display**
    - **Property 41: Transcription Editability**
    - **Validates: Requirements 15.2, 15.3, 15.5, 15.6**


- [ ] 30. Unit testing for all components and services
  - [ ] 30.1 Write unit tests for storage services
    - Test SecureStorage save/retrieve operations
    - Test LocalStorage save/retrieve operations
    - Test encryption/decryption
    - _Requirements: 8.1, 10.1_
  
  - [ ] 30.2 Write unit tests for audio services
    - Test AudioRecorder start/stop flow
    - Test WhisperTranscriber transcription
    - Test TTSPlayer playback
    - Test permission handling
    - _Requirements: 2.2, 15.2, 16.1_
  
  - [ ] 30.3 Write unit tests for AI services
    - Test ConversationEngine message flow
    - Test TriageSystem analysis
    - Test CrisisDetector pattern matching
    - _Requirements: 2.4, 3.1, 4.1_
  
  - [ ] 30.4 Write unit tests for practitioner services
    - Test PractitionerRecommender filtering
    - Test ranking algorithm
    - Test DoctolibIntegration URL generation
    - _Requirements: 5.1, 5.2, 6.5_
  
  - [ ] 30.5 Write unit tests for UI components
    - Test Card component rendering
    - Test Button component states
    - Test WaveformVisualizer animation
    - Test MessageBubble display
    - Test CrisisAlert modal
    - _Requirements: 12.1, 12.2, 12.3_
  
  - [ ] 30.6 Write unit tests for screens
    - Test VoiceConversationScreen interactions
    - Test TriageResultScreen display
    - Test PractitionerListScreen filtering
    - Test ProfileScreen preference updates
    - _Requirements: 2.1, 3.6, 5.5, 9.2_
  
  - [ ] 30.7 Write unit tests for error handlers
    - Test NetworkErrorHandler messages
    - Test AudioErrorHandler fallbacks
    - Test LLMErrorHandler retry logic
    - _Requirements: 11.1, 11.2, 11.3_

- [ ] 31. Integration testing
  - [ ] 31.1 Write integration test for full conversation flow
    - Test onboarding → conversation → triage → practitioners → booking
    - Verify data flows correctly between services
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 6.1_
  
  - [ ] 31.2 Write integration test for crisis flow
    - Test crisis detection → emergency alert → bypass triage
    - Verify crisis event logging
    - _Requirements: 4.1, 4.2, 4.4_
  
  - [ ] 31.3 Write integration test for offline scenarios
    - Test offline detection → cached data → retry on reconnect
    - _Requirements: 11.1, 11.2, 11.5_

- [ ] 32. Final checkpoint - All tests passing
  - Run full test suite (unit + property + integration)
  - Verify 80%+ code coverage
  - Ensure all 41 property tests pass
  - Ask the user if questions arise.


- [ ] 33. End-to-end testing with Detox
  - [ ] 33.1 Set up Detox testing framework
    - Install Detox and configure for iOS
    - Create test configuration
    - Set up test environment
    - _Requirements: 14.1_
  
  - [ ] 33.2 Write E2E test for happy path
    - Test complete user journey: onboarding → conversation → triage → practitioner selection → booking
    - Verify all screens render correctly
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 6.1_
  
  - [ ] 33.3 Write E2E test for crisis scenario
    - Test crisis keyword input → emergency alert display → call button
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ] 33.4 Write E2E test for offline scenario
    - Test offline indicator → cached data display → retry on reconnect
    - _Requirements: 11.1, 11.5_
  
  - [ ] 33.5 Write E2E test for accessibility
    - Test VoiceOver navigation through all screens
    - Verify all interactive elements are accessible
    - _Requirements: 12.9_

- [ ] 34. Polish and refinement
  - [ ] 34.1 Refine UI animations and transitions
    - Smooth screen transitions
    - Polish waveform animation
    - Add loading states
    - _Requirements: 12.7, 14.5_
  
  - [ ] 34.2 Optimize French language content
    - Review all UI text for natural French phrasing
    - Ensure medical terminology is appropriate
    - Verify error messages are clear and helpful
    - _Requirements: 2.4, 3.6, 11.1_
  
  - [ ] 34.3 Add haptic feedback to key interactions
    - Recording start/stop
    - Button presses
    - Crisis alert display
    - Navigation transitions
    - _Requirements: 2.4, 12.8_
  
  - [ ] 34.4 Final UI/UX review
    - Verify Doctolib design aesthetic throughout
    - Check spacing, colors, typography consistency
    - Test on different iPhone screen sizes
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 35. Documentation and deployment preparation
  - [ ] 35.1 Create README with setup instructions
    - Document environment setup
    - List all dependencies
    - Provide API key configuration instructions
    - Include build and run commands
  
  - [ ] 35.2 Document API integrations
    - Mistral Large API usage
    - Whisper.rn setup
    - Moshi TTS integration
    - Doctolib deep linking
  
  - [ ] 35.3 Create deployment checklist
    - iOS app store requirements
    - Privacy policy and terms
    - App store screenshots and description
    - TestFlight beta testing plan
  
  - [ ] 35.4 Set up error logging and monitoring
    - Configure Sentry or similar service
    - Set up crash reporting
    - Configure analytics (privacy-compliant)

- [ ] 36. Final validation and user acceptance
  - Run complete test suite one final time
  - Verify all 41 property tests pass
  - Test on physical iOS device
  - Conduct user acceptance testing with sample users
  - Address any final feedback
  - Ensure all requirements are met


## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, edge cases, and error conditions
- All 41 correctness properties from the design document are covered
- Implementation uses TypeScript for type safety and better developer experience
- Focus on voice-first interaction with text as fallback
- Prioritize crisis detection and user safety throughout
- Maintain Doctolib-style professional medical UI aesthetic
- Ensure RGPD compliance and data privacy at every step

## Testing Strategy

The testing approach combines:
1. **Property-Based Tests**: Verify universal properties hold across all inputs (41 properties total)
2. **Unit Tests**: Test specific components, services, and edge cases
3. **Integration Tests**: Verify data flows correctly between services
4. **E2E Tests**: Validate complete user journeys on real devices

Minimum test coverage goal: 80% code coverage with all 41 property tests passing.

## Implementation Order Rationale

The task order follows a bottom-up approach:
1. **Foundation**: Project setup, types, storage (tasks 1-3)
2. **Core Services**: Audio processing, AI integration, practitioner system (tasks 4-8)
3. **UI Components**: Design system, reusable components (task 9)
4. **Screens**: Onboarding, conversation, triage, practitioners, profile (tasks 11-18)
5. **Cross-Cutting Concerns**: Navigation, history, offline, accessibility, security (tasks 17-25)
6. **Integration**: Wire all components together (task 28)
7. **Testing**: Comprehensive property, unit, integration, E2E tests (tasks 29-33)
8. **Polish**: Refinement, documentation, deployment (tasks 34-36)

This order ensures each task builds on previous work with minimal dependencies and allows for early validation of core functionality.
