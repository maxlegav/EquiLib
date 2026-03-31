# Requirements Document

## Introduction

EquiLib is an iOS mental health navigation app that bridges the gap between "I don't feel well" and "I'm sitting in the right doctor's office". The app provides AI-powered empathetic listening, intelligent triage (non-diagnostic), and direct connection to mental health practitioners via Doctolib. It serves employees aged 15-30 who struggle to navigate the French healthcare system and don't know which specialist they need.

## Glossary

- **EquiLib_App**: The iOS mobile application system built with Expo and React Native
- **AI_Conversation_Engine**: The Mistral Large-powered conversational interface that conducts empathetic dialogue via La Plateforme API
- **Triage_System**: The AI-powered analysis component that classifies user concerns by domain, severity, and specialist type
- **Practitioner_Recommender**: The component that suggests relevant healthcare practitioners
- **Crisis_Detector**: The component that identifies emergency situations requiring immediate intervention
- **User**: The person using the app to find mental health support
- **Practitioner**: A mental health professional (psychologist, psychiatrist, therapist, etc.)
- **Doctolib**: Third-party booking platform for healthcare appointments
- **Triage_Result**: The output containing domain classification, severity level (1-10), and recommended specialist type
- **Crisis_Situation**: Suicidal ideation, self-harm intent, or violence indicators
- **Conversation_Tone**: User preference for interaction style (Supportive or Direct)
- **Emergency_Hotline**: French crisis hotline number 3114
- **Whisper_Transcriber**: The on-device speech-to-text component using Whisper.cpp via whisper.rn
- **Moshi_Synthesizer**: The text-to-speech component using Moshi (Kyutai) for French voice synthesis
- **Voice_Wave_Visualizer**: The animated visual indicator displayed during voice recording and AI speech
- **Haptic_Feedback**: iOS haptic vibration feedback for user interactions

## Requirements

### Requirement 1: User Onboarding and Preferences

**User Story:** As a new user, I want to set up my location and conversation preferences, so that I receive personalized and geographically relevant recommendations.

#### Acceptance Criteria

1. WHEN the User launches the app for the first time, THE EquiLib_App SHALL display a welcome screen
2. THE EquiLib_App SHALL prompt the User to provide their location
### Requirement 2: Natural Language Conversation Interface

**User Story:** As a user experiencing mental health concerns, I want to describe my feelings using voice input, so that I can express myself naturally without typing.

#### Acceptance Criteria

1. THE EquiLib_App SHALL provide a voice-first interface as the primary input method
2. WHEN the User taps the microphone button, THE EquiLib_App SHALL activate the Whisper_Transcriber
3. WHEN the User speaks, THE Voice_Wave_Visualizer SHALL display an animated wave indicating active listening
4. WHEN the User speaks, THE EquiLib_App SHALL provide Haptic_Feedback at the start of recording
5. THE Whisper_Transcriber SHALL transcribe speech to text on-device without network latency
6. WHEN the User submits a message, THE AI_Conversation_Engine SHALL respond via streaming SSE within 3 seconds
7. THE AI_Conversation_Engine SHALL conduct an empathetic, non-clinical conversation
8. THE AI_Conversation_Engine SHALL ask between 3 and 5 adaptive follow-up questions
9. THE AI_Conversation_Engine SHALL adapt question phrasing based on the selected Conversation_Tone
10. THE EquiLib_App SHALL display conversation history in chronological order
11. THE EquiLib_App SHALL provide a text input option as a secondary input method within 3 seconds
4. THE AI_Conversation_Engine SHALL conduct an empathetic, non-clinical conversation
5. THE AI_Conversation_Engine SHALL ask between 3 and 5 adaptive follow-up questions
6. THE AI_Conversation_Engine SHALL adapt question phrasing based on the selected Conversation_Tone
7. THE EquiLib_App SHALL display conversation history in chronological order

### Requirement 3: AI-Powered Triage Analysis

**User Story:** As a user who has described my concerns, I want the app to analyze my situation and suggest which type of specialist I need, so that I can take concrete action.

#### Acceptance Criteria

1. WHEN the AI_Conversation_Engine completes the conversation, THE Triage_System SHALL analyze the User responses
2. THE Triage_System SHALL classify the concern by domain: psychological, somatic, or professional
3. THE Triage_System SHALL assign a severity level between 1 and 10
4. THE Triage_System SHALL recommend a specific specialist type
5. THE Triage_System SHALL generate a Triage_Result within 2 seconds of conversation completion
6. THE EquiLib_App SHALL display the Triage_Result with a clear disclaimer stating this is orientation, not diagnosis
7. THE Triage_Result SHALL include: Primary Concern, Recommended Specialist, and Severity Level

### Requirement 4: Crisis Detection and Emergency Response

**User Story:** As a user in crisis, I want the app to immediately connect me with emergency services, so that I can get urgent help when I need it most.

#### Acceptance Criteria

1. WHILE the AI_Conversation_Engine processes User messages, THE Crisis_Detector SHALL monitor for Crisis_Situation indicators
2. IF the Crisis_Detector identifies a Crisis_Situation, THEN THE EquiLib_App SHALL immediately display the Emergency_Hotline number 3114
3. IF the Crisis_Detector identifies a Crisis_Situation, THEN THE EquiLib_App SHALL provide a direct call button to emergency services
4. IF the Crisis_Detector identifies a Crisis_Situation, THEN THE EquiLib_App SHALL bypass the standard triage flow
5. THE EquiLib_App SHALL display crisis resources prominently on all triage summary screens

### Requirement 5: Practitioner Recommendations

**User Story:** As a user who has received triage results, I want to see relevant practitioners near me, so that I can choose someone to book an appointment with.

#### Acceptance Criteria

1. WHEN the Triage_System generates a Triage_Result, THE Practitioner_Recommender SHALL suggest 3 Practitioners
2. THE Practitioner_Recommender SHALL prioritize Practitioners by: best rated, closest distance, and available appointment slots
3. THE Practitioner_Recommender SHALL filter Practitioners matching the recommended specialist type
4. THE EquiLib_App SHALL display each Practitioner with: photo, specialty, rating, distance, and availability status
5. THE EquiLib_App SHALL provide filter options for: Specialty, Distance, and Availability
6. WHEN the User applies a filter, THE EquiLib_App SHALL update the Practitioner list within 1 second

### Requirement 6: Doctolib Integration and Booking Redirect

**User Story:** As a user who has selected a practitioner, I want to be redirected to Doctolib with pre-filled search criteria, so that I can quickly book an appointment.

#### Acceptance Criteria

1. WHEN the User selects a Practitioner, THE EquiLib_App SHALL display a booking confirmation screen
2. THE EquiLib_App SHALL show the selected Practitioner details
3. THE EquiLib_App SHALL display next steps for booking
4. WHEN the User confirms booking intent, THE EquiLib_App SHALL redirect to Doctolib
5. THE EquiLib_App SHALL pre-filter the Doctolib search with: specialist type, location, and practitioner name
6. THE EquiLib_App SHALL display the Emergency_Hotline number on the booking confirmation screen

### Requirement 7: Navigation and App Structure

**User Story:** As a user, I want to easily navigate between different sections of the app, so that I can access conversations, triage results, and practitioner lists.

#### Acceptance Criteria

1. THE EquiLib_App SHALL provide a bottom navigation bar with 4 tabs: Chat, Triage, Practitioners, Profile
2. WHEN the User taps a navigation tab, THE EquiLib_App SHALL switch to the corresponding screen within 500 milliseconds
3. THE EquiLib_App SHALL highlight the currently active tab
4. THE EquiLib_App SHALL persist navigation state when the app is backgrounded and resumed

### Requirement 8: Data Privacy and Security

**User Story:** As a user sharing sensitive mental health information, I want my conversations to be encrypted and private, so that my employer and others cannot access my data.

#### Acceptance Criteria

1. THE EquiLib_App SHALL encrypt all conversation data at rest
2. THE EquiLib_App SHALL encrypt all conversation data in transit using TLS 1.3 or higher
3. THE EquiLib_App SHALL comply with RGPD requirements
4. THE EquiLib_App SHALL never share User conversation data with employers
5. THE EquiLib_App SHALL display a privacy policy accessible from the Profile tab
6. WHEN the User deletes their account, THE EquiLib_App SHALL permanently delete all associated conversation data within 30 days

### Requirement 9: User Account Management

**User Story:** As a user, I want to manage my account settings and preferences, so that I can control my app experience.

#### Acceptance Criteria

1. THE EquiLib_App SHALL provide a Profile screen accessible from the bottom navigation
2. THE EquiLib_App SHALL allow the User to update their location
3. THE EquiLib_App SHALL allow the User to change their Conversation_Tone preference
4. THE EquiLib_App SHALL allow the User to view their conversation history
5. THE EquiLib_App SHALL allow the User to delete their account
6. WHEN the User updates a preference, THE EquiLib_App SHALL apply the change immediately

### Requirement 10: Conversation History and Triage Tracking

**User Story:** As a user who has completed multiple triage sessions, I want to view my past conversations and results, so that I can track my mental health journey.

#### Acceptance Criteria

1. THE EquiLib_App SHALL store all completed conversations and Triage_Results
2. THE EquiLib_App SHALL display conversation history in the Triage tab
3. WHEN the User selects a past conversation, THE EquiLib_App SHALL display the full conversation and Triage_Result
4. THE EquiLib_App SHALL sort conversation history by date, most recent first
5. THE EquiLib_App SHALL allow the User to delete individual conversation records

### Requirement 11: Offline Capability and Error Handling

**User Story:** As a user who may lose internet connection, I want the app to handle network issues gracefully, so that I understand what's happening and can retry.

### Requirement 12: Visual Design and Accessibility

**User Story:** As a user with accessibility needs, I want the app to be usable with assistive technologies, so that I can access mental health support regardless of my abilities.

#### Acceptance Criteria

1. THE EquiLib_App SHALL use a professional medical interface design with Doctolib blue (#0596DE) as primary color, white and light grays as secondary colors, and soft teal for accent highlights
2. THE EquiLib_App SHALL use clean white backgrounds with subtle gray section separators
3. THE EquiLib_App SHALL display Practitioner information in card-based layouts with subtle shadows and moderate rounded corners
4. THE EquiLib_App SHALL use clean sans-serif typography with clear hierarchy and medical-professional spacing
5. THE EquiLib_App SHALL style call-to-action buttons in Doctolib blue
6. THE EquiLib_App SHALL use professional medical-themed icons throughout the interface
7. THE EquiLib_App SHALL display the voice wave animation with a professional medical aesthetic
8. THE EquiLib_App SHALL provide haptic feedback for key interactions
9. THE EquiLib_App SHALL support iOS VoiceOver screen reader
10. THE EquiLib_App SHALL support Dynamic Type for text scaling
11. THE EquiLib_App SHALL maintain minimum contrast ratio of 4.5:1 for all text
12. THE EquiLib_App SHALL provide alternative text for all images and icons
13. THE EquiLib_App SHALL support iOS Dark Mode with appropriate color adaptationsn all interactive elements
7. THE EquiLib_App SHALL use light shadows for depth
8. THE EquiLib_App SHALL display the Voice_Wave_Visualizer with soft animation when the AI listens or speaks
9. THE EquiLib_App SHALL provide subtle Haptic_Feedback on screen transitions
10. THE EquiLib_App SHALL provide a dimmed dark mode option
11. THE EquiLib_App SHALL not include mascots or gamification elements
12. THE EquiLib_App SHALL support iOS VoiceOver screen reader
13. THE EquiLib_App SHALL support Dynamic Type for text scaling
14. THE EquiLib_App SHALL maintain minimum contrast ratio of 4.5:1 for all text
15. THE EquiLib_App SHALL provide alternative text for all images and icons
#### Acceptance Criteria

1. THE EquiLib_App SHALL use the color scheme: deep night blue (#0A1628), electric blue (#2563EB), and white
2. THE EquiLib_App SHALL support iOS VoiceOver screen reader
### Requirement 14: Performance and Responsiveness

**User Story:** As a user in distress, I want the app to respond quickly with on-device processing, so that I don't experience frustrating delays when seeking help.

#### Acceptance Criteria

1. THE EquiLib_App SHALL launch and display the home screen within 2 seconds on iPhone 12 or newer
2. THE EquiLib_App SHALL render chat messages within 100 milliseconds of receipt
3. THE AI_Conversation_Engine SHALL stream responses from Mistral Large using Server-Sent Events (SSE)
4. THE EquiLib_App SHALL display streaming text as it arrives from the AI_Conversation_Engine
5. THE EquiLib_App SHALL maintain smooth scrolling at 60 frames per second in the chat interface
6. THE Whisper_Transcriber SHALL transcribe speech on-device with zero network latency
### Requirement 15: Voice Input Processing

**User Story:** As a user who prefers speaking to typing, I want to use voice input as the primary way to describe my concerns, so that I can communicate naturally and expressively.

#### Acceptance Criteria

1. THE EquiLib_App SHALL provide a prominent microphone button as the primary input method
2. WHEN the User taps the microphone button, THE EquiLib_App SHALL request microphone permission if not already granted
3. WHEN the User taps the microphone button, THE EquiLib_App SHALL provide Haptic_Feedback
4. WHEN the User speaks, THE Voice_Wave_Visualizer SHALL display an animated wave synchronized with audio input
5. WHEN the User speaks, THE Whisper_Transcriber SHALL process audio on-device using Whisper.cpp
6. THE Whisper_Transcriber SHALL transcribe French speech with high accuracy
7. WHEN the User finishes speaking, THE EquiLib_App SHALL display the transcribed text immediately
8. THE EquiLib_App SHALL allow the User to edit transcribed text before sending
9. WHEN the User stops speaking, THE EquiLib_App SHALL provide Haptic_Feedback
10. THE EquiLib_App SHALL use expo-av for audio capture and playback
**User Story:** As a user in distress, I want the app to respond quickly, so that I don't experience frustrating delays when seeking help.

#### Acceptance Criteria

1. THE EquiLib_App SHALL launch and display the home screen within 2 seconds on iPhone 12 or newer
2. THE EquiLib_App SHALL render chat messages within 100 milliseconds of receipt
3. THE AI_Conversation_Engine SHALL stream responses using Server-Sent Events (SSE)
4. THE EquiLib_App SHALL display streaming text as it arrives from the AI_Conversation_Engine
5. THE EquiLib_App SHALL maintain smooth scrolling at 60 frames per second in the chat interface

### Requirement 15: Voice Input Processing

**User Story:** As a user who prefers speaking to typing, I want to use voice input to describe my concerns, so that I can communicate more naturally.

#### Acceptance Criteria

1. THE EquiLib_App SHALL provide a microphone button in the chat interface
2. WHEN the User taps the microphone button, THE EquiLib_App SHALL request microphone permission if not already granted
3. WHEN the User speaks, THE EquiLib_App SHALL display a visual indicator that recording is active
4. WHEN the User finishes speaking, THE EquiLib_App SHALL transcribe the audio to text within 2 seconds
5. THE EquiLib_App SHALL display the transcribed text in the chat interface
6. THE EquiLib_App SHALL allow the User to edit transcribed text before sending



### Requirement 16: Text-to-Speech Output

**User Story:** As a user who wants to listen to AI responses, I want the app to speak responses in natural French, so that I can have a conversational experience.

#### Acceptance Criteria

1. THE EquiLib_App SHALL provide an option to enable voice output for AI responses
2. WHEN voice output is enabled, THE Moshi_Synthesizer SHALL convert AI text responses to speech
3. THE Moshi_Synthesizer SHALL use Kyutai's Moshi model for French voice synthesis
4. THE Moshi_Synthesizer SHALL produce natural-sounding French speech
5. WHEN the Moshi_Synthesizer speaks, THE Voice_Wave_Visualizer SHALL display an animated wave synchronized with audio output
6. THE EquiLib_App SHALL allow the User to pause, resume, or stop speech playback
7. THE EquiLib_App SHALL use expo-av for audio playback

### Requirement 17: Technical Architecture and Stack

**User Story:** As a developer, I want the app to use a modern, maintainable technical stack with French sovereign components, so that the app is performant, secure, and compliant with data sovereignty requirements.

#### Acceptance Criteria

1. THE EquiLib_App SHALL be built using Expo and React Native
2. THE EquiLib_App SHALL use expo-av for all audio capture and playback operations
3. THE Whisper_Transcriber SHALL use Whisper.cpp via the whisper.rn React Native wrapper
4. THE Whisper_Transcriber SHALL run entirely on-device without network requests
5. THE AI_Conversation_Engine SHALL connect to Mistral Large via La Plateforme API
6. THE AI_Conversation_Engine SHALL use WebSocket connections for streaming responses
7. THE AI_Conversation_Engine SHALL handle Server-Sent Events (SSE) for real-time message streaming
8. THE Moshi_Synthesizer SHALL integrate Kyutai's Moshi model for French TTS
9. THE EquiLib_App SHALL minimize network dependencies by processing speech recognition on-device
10. THE EquiLib_App SHALL comply with French data sovereignty requirements by using French AI services
