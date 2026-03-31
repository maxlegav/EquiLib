/**
 * Unit tests for SecureStorage service
 * 
 * Tests the secure storage functionality for user profiles and crisis events.
 */

import * as SecureStore from 'expo-secure-store';
import { SecureStorage, SecureStorageError } from '../SecureStorage';
import { UserProfile, CrisisEvent } from '../../../types/models';

// Mock expo-secure-store
jest.mock('expo-secure-store');

describe('SecureStorage', () => {
  let secureStorage: SecureStorage;

  beforeEach(() => {
    secureStorage = new SecureStorage();
    jest.clearAllMocks();
  });

  describe('User Profile Operations', () => {
    const mockProfile: UserProfile = {
      id: 'user-123',
      createdAt: new Date('2024-01-15T10:00:00Z'),
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

    it('should save user profile successfully', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.saveUserProfile(mockProfile);

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'user_profile',
        JSON.stringify(mockProfile)
      );
    });

    it('should retrieve user profile successfully', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify(mockProfile)
      );

      const result = await secureStorage.getUserProfile();

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('user_profile');
      expect(result).toEqual(mockProfile);
      expect(result?.createdAt).toBeInstanceOf(Date);
    });

    it('should return null when user profile does not exist', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await secureStorage.getUserProfile();

      expect(result).toBeNull();
    });

    it('should delete user profile successfully', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.deleteUserProfile();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_profile');
    });

    it('should throw SecureStorageError when save fails', async () => {
      const error = new Error('Storage full');
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(error);

      await expect(secureStorage.saveUserProfile(mockProfile)).rejects.toThrow(
        SecureStorageError
      );
    });

    it('should throw SecureStorageError when retrieval fails', async () => {
      const error = new Error('Read error');
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(error);

      await expect(secureStorage.getUserProfile()).rejects.toThrow(
        SecureStorageError
      );
    });
  });

  describe('Crisis Event Operations', () => {
    const mockCrisisEvent: CrisisEvent = {
      id: 'crisis-456',
      userId: 'user-123',
      conversationId: 'conv-789',
      timestamp: new Date('2024-01-15T14:30:00Z'),
      triggerMessage: 'je veux mourir',
      indicators: ['suicidal_ideation'],
      confidence: 0.95,
      emergencyDisplayed: true,
      userCalledHotline: false,
      encrypted: false,
    };

    it('should save crisis event with encryption flag', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.saveCrisisEvent(mockCrisisEvent);

      const expectedEvent = { ...mockCrisisEvent, encrypted: true };
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'crisis_crisis-456',
        JSON.stringify(expectedEvent)
      );
    });

    it('should retrieve crisis event successfully', async () => {
      const storedEvent = { ...mockCrisisEvent, encrypted: true };
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify(storedEvent)
      );

      const result = await secureStorage.getCrisisEvent('crisis-456');

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('crisis_crisis-456');
      expect(result).toEqual(storedEvent);
      expect(result?.timestamp).toBeInstanceOf(Date);
      expect(result?.encrypted).toBe(true);
    });

    it('should return null when crisis event does not exist', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await secureStorage.getCrisisEvent('crisis-456');

      expect(result).toBeNull();
    });

    it('should delete crisis event successfully', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.deleteCrisisEvent('crisis-456');

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('crisis_crisis-456');
    });

    it('should delete all crisis events', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

      const eventIds = ['crisis-1', 'crisis-2', 'crisis-3'];
      await secureStorage.deleteAllCrisisEvents(eventIds);

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(3);
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('crisis_crisis-1');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('crisis_crisis-2');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('crisis_crisis-3');
    });

    it('should throw SecureStorageError when save fails', async () => {
      const error = new Error('Encryption failed');
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(error);

      await expect(secureStorage.saveCrisisEvent(mockCrisisEvent)).rejects.toThrow(
        SecureStorageError
      );
    });
  });

  describe('Clear All Operations', () => {
    it('should clear all data including user profile and crisis events', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

      const crisisEventIds = ['crisis-1', 'crisis-2'];
      await secureStorage.clearAll(crisisEventIds);

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_profile');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('crisis_crisis-1');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('crisis_crisis-2');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(3);
    });

    it('should clear user profile even when no crisis events provided', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.clearAll();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_profile');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(1);
    });

    it('should throw SecureStorageError when clear fails', async () => {
      const error = new Error('Delete failed');
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(error);

      await expect(secureStorage.clearAll()).rejects.toThrow(SecureStorageError);
    });
  });

  describe('Error Handling', () => {
    it('should include operation name in error', async () => {
      const error = new Error('Storage error');
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(error);

      const mockProfile: UserProfile = {
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

      try {
        await secureStorage.saveUserProfile(mockProfile);
      } catch (e) {
        expect(e).toBeInstanceOf(SecureStorageError);
        expect((e as SecureStorageError).operation).toBe('saveUserProfile');
        expect((e as SecureStorageError).originalError).toBe(error);
      }
    });
  });
});
