# Storage Services

This directory contains storage services for the EquiLib iOS app.

## SecureStorage

The `SecureStorage` service provides encrypted storage for sensitive user data using `expo-secure-store`. All data is encrypted at rest.

### Features

- **User Profile Storage**: Save and retrieve user profiles with encryption
- **Crisis Event Storage**: Store crisis events with automatic encryption marking
- **Error Handling**: Comprehensive error handling with custom error types
- **Type Safety**: Full TypeScript support with proper type definitions

### Usage

```typescript
import { secureStorage } from './services/storage/SecureStorage';
import { UserProfile, CrisisEvent } from './types/models';

// Save user profile
const profile: UserProfile = {
  id: 'user-123',
  createdAt: new Date(),
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    city: 'Paris',
    postalCode: '75001',
  },
  conversationTone: 'supportive',
  preferences: {
    voiceEnabled: true,
    ttsEnabled: true,
    darkMode: false,
    notificationsEnabled: true,
  },
};

await secureStorage.saveUserProfile(profile);

// Retrieve user profile
const retrievedProfile = await secureStorage.getUserProfile();
if (retrievedProfile) {
  console.log('User profile:', retrievedProfile);
}

// Save crisis event
const crisisEvent: CrisisEvent = {
  id: 'crisis-456',
  userId: 'user-123',
  conversationId: 'conv-789',
  timestamp: new Date(),
  triggerMessage: 'je veux mourir',
  indicators: ['suicidal_ideation'],
  confidence: 0.95,
  emergencyDisplayed: true,
  userCalledHotline: false,
  encrypted: false, // Will be set to true automatically
};

await secureStorage.saveCrisisEvent(crisisEvent);

// Retrieve crisis event
const retrievedEvent = await secureStorage.getCrisisEvent('crisis-456');
if (retrievedEvent) {
  console.log('Crisis event:', retrievedEvent);
  console.log('Encrypted:', retrievedEvent.encrypted); // true
}

// Delete user data (RGPD compliance)
await secureStorage.deleteUserProfile();
await secureStorage.deleteCrisisEvent('crisis-456');

// Or clear all data at once
await secureStorage.clearAll(['crisis-456', 'crisis-789']);
```

### Error Handling

The service throws `SecureStorageError` for all operations that fail:

```typescript
import { SecureStorageError } from './services/storage/SecureStorage';

try {
  await secureStorage.saveUserProfile(profile);
} catch (error) {
  if (error instanceof SecureStorageError) {
    console.error('Operation:', error.operation);
    console.error('Message:', error.message);
    console.error('Original error:', error.originalError);
  }
}
```

### Requirements Satisfied

- **Requirement 8.1**: All conversation data is encrypted at rest using expo-secure-store
- **Requirement 8.2**: All conversation data is encrypted in transit (handled by HTTPS/TLS)
- **Requirement 8.6**: Account deletion removes all associated data

### Security Notes

1. All data stored via `SecureStorage` is encrypted using the device's secure enclave
2. Crisis events are automatically marked as encrypted
3. Date objects are properly serialized and deserialized
4. The service provides a singleton instance for consistent access across the app

### Testing

Unit tests are provided in `__tests__/SecureStorage.test.ts`. Run tests with:

```bash
npm test
```

### Future Enhancements

- Add support for listing all crisis event IDs (requires maintaining an index)
- Add data export functionality for RGPD compliance
- Add data migration utilities for schema changes
