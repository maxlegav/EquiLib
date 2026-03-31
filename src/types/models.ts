/**
 * Data Models and Type Definitions for EquiLib iOS App
 * 
 * This file contains all TypeScript interfaces and types for:
 * - User data models
 * - Conversation and messaging
 * - Triage and crisis detection
 * - Practitioner information
 * - API request/response types
 * - Component prop types
 */

// ============================================================================
// Core Data Models
// ============================================================================

/**
 * Geographic location information
 */
export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  postalCode: string;
}

/**
 * User preferences for app behavior
 */
export interface UserPreferences {
  voiceEnabled: boolean;
  ttsEnabled: boolean;
  darkMode: boolean;
  notificationsEnabled: boolean;
}

/**
 * User profile information
 */
export interface UserProfile {
  id: string;
  createdAt: Date;
  location: Location;
  conversationTone: 'supportive' | 'direct';
  preferences: UserPreferences;
}

/**
 * Physical address information
 */
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// ============================================================================
// Conversation and Messaging
// ============================================================================

/**
 * Individual message in a conversation
 */
export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string; // For voice messages
  transcription?: string; // For voice messages
}

/**
 * Complete conversation record
 */
export interface Conversation {
  id: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  tone: 'supportive' | 'direct';
  messages: Message[];
  triageResultId?: string;
  status: 'active' | 'completed' | 'abandoned' | 'crisis';
}

/**
 * LLM message format for API communication
 */
export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// ============================================================================
// Triage System
// ============================================================================

/**
 * Triage analysis result
 */
export interface TriageResult {
  id: string;
  conversationId: string;
  userId: string;
  timestamp: Date;
  
  // Classification
  primaryConcern: string;
  domain: 'psychological' | 'somatic' | 'professional';
  severityLevel: number; // 1-10
  
  // Recommendations
  recommendedSpecialist: string;
  summary: string;
  actionItems: string[];
  
  // Metadata
  confidence: number;
  requiresUrgentCare: boolean;
}

// ============================================================================
// Crisis Detection
// ============================================================================

/**
 * Crisis analysis result
 */
export interface CrisisAnalysis {
  isCrisis: boolean;
  confidence: number;
  indicators: string[];
  recommendedAction: 'emergency' | 'urgent' | 'standard';
}

/**
 * Crisis event record (encrypted at rest)
 */
export interface CrisisEvent {
  id: string;
  userId: string;
  conversationId: string;
  timestamp: Date;
  
  // Detection
  triggerMessage: string;
  indicators: string[];
  confidence: number;
  
  // Response
  emergencyDisplayed: boolean;
  userCalledHotline: boolean;
  
  // Privacy: Encrypted at rest
  encrypted: boolean;
}

// ============================================================================
// Practitioner Information
// ============================================================================

/**
 * Healthcare practitioner information
 */
export interface Practitioner {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  
  // Professional info
  specialty: string;
  specialties: string[];
  credentials: string[];
  languages: string[];
  
  // Contact
  phone: string;
  email: string;
  website?: string;
  doctolibUrl: string;
  
  // Location
  address: Address;
  location: Location;
  
  // Ratings
  rating: number;
  reviewCount: number;
  
  // Availability
  availabilityStatus: 'available' | 'limited' | 'unavailable';
  nextAvailableSlot?: Date;
  acceptsNewPatients: boolean;
  
  // Media
  photo: string;
  profileDescription: string;
}

/**
 * Practitioner filtering criteria
 */
export interface PractitionerFilters {
  specialty?: string[];
  maxDistance?: number;
  availabilityOnly: boolean;
}

/**
 * Practitioner ranking criteria
 */
export interface RankingCriteria {
  prioritizeRating: number; // 0-1 weight
  prioritizeDistance: number; // 0-1 weight
  prioritizeAvailability: number; // 0-1 weight
}

// ============================================================================
// API Types - Mistral Large Integration
// ============================================================================

/**
 * Request format for Mistral streaming API
 */
export interface MistralStreamRequest {
  model: 'mistral-large-latest';
  messages: LLMMessage[];
  temperature: number;
  max_tokens: number;
  stream: true;
}

/**
 * Streaming chunk from Mistral API
 */
export interface MistralStreamChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: [{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }];
}

/**
 * Triage analysis API response
 */
export interface TriageResponse {
  domain: 'psychological' | 'somatic' | 'professional';
  severity: number;
  specialist: string;
  summary: string;
  confidence: number;
}

// ============================================================================
// Audio Processing Types
// ============================================================================

/**
 * Audio recording reference
 */
export interface AudioRecording {
  uri: string;
  duration: number;
  size: number;
}

/**
 * Audio state for UI
 */
export interface AudioState {
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  waveformData: number[];
  currentTranscription: string;
}

/**
 * Waveform animation states
 */
export type WaveState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

/**
 * Moshi TTS configuration
 */
export interface MoshiTTSConfig {
  voice: 'professional' | 'warm' | 'calm';
  speed: number; // 0.8 - 1.2
  language: 'fr';
}

/**
 * Whisper configuration
 */
export interface WhisperConfig {
  model: 'tiny' | 'base' | 'small' | 'medium' | 'large';
  language: 'fr';
  translate: false;
}

// ============================================================================
// Component Prop Types
// ============================================================================

/**
 * Props for VoiceConversationScreen
 */
export interface VoiceConversationScreenProps {
  conversationId?: string;
  onTriageComplete: (result: TriageResult) => void;
}

/**
 * Props for TriageResultScreen
 */
export interface TriageResultScreenProps {
  result: TriageResult;
  onViewPractitioners: () => void;
}

/**
 * Props for PractitionerListScreen
 */
export interface PractitionerListScreenProps {
  triageResult: TriageResult;
  userLocation: Location;
}

/**
 * Props for Card component
 */
export interface CardProps {
  children: React.ReactNode;
  variant: 'default' | 'elevated' | 'outlined';
  padding?: number;
  onPress?: () => void;
}

/**
 * Props for Button component
 */
export interface ButtonProps {
  title: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'crisis';
  size: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

/**
 * Props for WaveformVisualizer component
 */
export interface WaveformVisualizerProps {
  isActive: boolean;
  waveformData: number[];
  color: string;
  height: number;
}

/**
 * Props for MessageBubble component
 */
export interface MessageBubbleProps {
  message: Message;
}

/**
 * Props for CrisisAlert component
 */
export interface CrisisAlertProps {
  visible: boolean;
  onContinue: () => void;
  onCall: () => void;
}

/**
 * Props for PractitionerCard component
 */
export interface PractitionerCardProps {
  practitioner: Practitioner;
  onPress: () => void;
}

/**
 * Props for ErrorMessage component
 */
export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Props for OfflineIndicator component
 */
export interface OfflineIndicatorProps {
  isOffline: boolean;
}

// ============================================================================
// Navigation Types
// ============================================================================

/**
 * Root stack navigation parameters
 */
export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  TriageResult: { resultId: string };
  PractitionerDetail: { practitionerId: string };
  BookingConfirmation: { practitionerId: string };
  CrisisEmergency: undefined;
};

/**
 * Main tab navigation parameters
 */
export type MainTabParamList = {
  Chat: undefined;
  Triage: undefined;
  Practitioners: { triageResultId?: string };
  Profile: undefined;
};

// ============================================================================
// State Management Types
// ============================================================================

/**
 * Global application state
 */
export interface AppState {
  user: UserProfile | null;
  currentConversation: Conversation | null;
  conversations: Conversation[];
  triageResults: TriageResult[];
  practitioners: Practitioner[];
  isOnline: boolean;
  audioState: AudioState;
}

/**
 * App state actions
 */
export type AppAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'START_CONVERSATION'; payload: Conversation }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_TRIAGE_RESULT'; payload: TriageResult }
  | { type: 'UPDATE_AUDIO_STATE'; payload: Partial<AudioState> }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_PRACTITIONERS'; payload: Practitioner[] }
  | { type: 'END_CONVERSATION'; payload: { conversationId: string; status: Conversation['status'] } }
  | { type: 'DELETE_CONVERSATION'; payload: string }
  | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<UserPreferences> };

/**
 * Conversation state for VoiceConversationScreen
 */
export interface ConversationState {
  messages: Message[];
  isRecording: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  waveformData: number[];
  conversationTone: 'supportive' | 'direct';
}

// ============================================================================
// Error Handling Types
// ============================================================================

/**
 * Error response structure
 */
export interface ErrorResponse {
  userMessage: string;
  action: string;
  retryable: boolean;
  fallback?: string;
  retryAfter?: number;
  critical?: boolean;
}

/**
 * Network error types
 */
export type NetworkErrorType = 
  | 'NO_CONNECTION'
  | 'TIMEOUT'
  | 'WEBSOCKET_DISCONNECT'
  | 'RATE_LIMIT'
  | 'SERVER_ERROR';

/**
 * Audio error types
 */
export type AudioErrorType =
  | 'PERMISSION_DENIED'
  | 'RECORDING_FAILED'
  | 'TRANSCRIPTION_FAILED'
  | 'TTS_FAILED'
  | 'PLAYBACK_FAILED';

/**
 * LLM error types
 */
export type LLMErrorType =
  | 'API_FAILURE'
  | 'INVALID_RESPONSE'
  | 'CONTEXT_TOO_LONG'
  | 'CONTENT_BLOCKED';

/**
 * Storage error types
 */
export type StorageErrorType =
  | 'QUOTA_EXCEEDED'
  | 'ENCRYPTION_FAILED'
  | 'DATA_CORRUPTED'
  | 'READ_WRITE_FAILED';

/**
 * Crisis error types
 */
export type CrisisErrorType =
  | 'DETECTOR_FAILED'
  | 'FALSE_POSITIVE';

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Emergency hotline information
 */
export interface EmergencyHotline {
  number: string;
  displayName: string;
  available: string;
}

/**
 * RGPD consent record
 */
export interface RGPDConsent {
  userId: string;
  consentDate: Date;
  dataProcessing: boolean;
  dataStorage: boolean;
  analytics: boolean;
}

/**
 * Error log entry
 */
export interface ErrorLog {
  timestamp: Date;
  errorType: string;
  errorMessage: string;
  context: string;
  userId?: string;
  stackTrace?: string;
  deviceInfo: {
    platform: string;
    osVersion: string;
    appVersion: string;
  };
}
