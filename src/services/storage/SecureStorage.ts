/**
 * Secure Storage Service
 * 
 * Handles encrypted storage of sensitive user data using expo-secure-store.
 * This service is responsible for:
 * - User profile storage and retrieval
 * - Crisis event storage (encrypted)
 * - Secure data management with encryption at rest
 * 
 * Requirements: 8.1, 8.2
 */

import * as SecureStore from 'expo-secure-store';
import { UserProfile, CrisisEvent } from '../../types/models';

/**
 * Storage keys for secure data
 */
const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  CRISIS_EVENT_PREFIX: 'crisis_',
} as const;

/**
 * Error types for secure storage operations
 */
export class SecureStorageError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'SecureStorageError';
  }
}

/**
 * Secure Storage Service
 * 
 * Provides encrypted storage for sensitive user data.
 * All data is encrypted at rest using expo-secure-store.
 */
export class SecureStorage {
  /**
   * Save user profile to secure storage
   * 
   * @param profile - User profile to save
   * @throws {SecureStorageError} If save operation fails
   */
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const profileJson = JSON.stringify(profile);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_PROFILE, profileJson);
    } catch (error) {
      throw new SecureStorageError(
        'Failed to save user profile',
        'saveUserProfile',
        error as Error
      );
    }
  }

  /**
   * Retrieve user profile from secure storage
   * 
   * @returns User profile if found, null otherwise
   * @throws {SecureStorageError} If retrieval operation fails
   */
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profileJson = await SecureStore.getItemAsync(STORAGE_KEYS.USER_PROFILE);
      
      if (!profileJson) {
        return null;
      }

      const profile = JSON.parse(profileJson);
      
      // Convert date strings back to Date objects
      return {
        ...profile,
        createdAt: new Date(profile.createdAt),
      };
    } catch (error) {
      throw new SecureStorageError(
        'Failed to retrieve user profile',
        'getUserProfile',
        error as Error
      );
    }
  }

  /**
   * Delete user profile from secure storage
   * 
   * @throws {SecureStorageError} If delete operation fails
   */
  async deleteUserProfile(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_PROFILE);
    } catch (error) {
      throw new SecureStorageError(
        'Failed to delete user profile',
        'deleteUserProfile',
        error as Error
      );
    }
  }

  /**
   * Save crisis event to secure storage
   * 
   * Crisis events are stored with encryption and marked as encrypted.
   * Each event is stored with a unique key based on its ID.
   * 
   * @param event - Crisis event to save
   * @throws {SecureStorageError} If save operation fails
   */
  async saveCrisisEvent(event: CrisisEvent): Promise<void> {
    try {
      // Mark event as encrypted
      const encryptedEvent: CrisisEvent = {
        ...event,
        encrypted: true,
      };

      const eventJson = JSON.stringify(encryptedEvent);
      const storageKey = `${STORAGE_KEYS.CRISIS_EVENT_PREFIX}${event.id}`;
      
      await SecureStore.setItemAsync(storageKey, eventJson);
    } catch (error) {
      throw new SecureStorageError(
        `Failed to save crisis event ${event.id}`,
        'saveCrisisEvent',
        error as Error
      );
    }
  }

  /**
   * Retrieve crisis event from secure storage
   * 
   * @param eventId - ID of the crisis event to retrieve
   * @returns Crisis event if found, null otherwise
   * @throws {SecureStorageError} If retrieval operation fails
   */
  async getCrisisEvent(eventId: string): Promise<CrisisEvent | null> {
    try {
      const storageKey = `${STORAGE_KEYS.CRISIS_EVENT_PREFIX}${eventId}`;
      const eventJson = await SecureStore.getItemAsync(storageKey);
      
      if (!eventJson) {
        return null;
      }

      const event = JSON.parse(eventJson);
      
      // Convert date strings back to Date objects
      return {
        ...event,
        timestamp: new Date(event.timestamp),
      };
    } catch (error) {
      throw new SecureStorageError(
        `Failed to retrieve crisis event ${eventId}`,
        'getCrisisEvent',
        error as Error
      );
    }
  }

  /**
   * Delete crisis event from secure storage
   * 
   * @param eventId - ID of the crisis event to delete
   * @throws {SecureStorageError} If delete operation fails
   */
  async deleteCrisisEvent(eventId: string): Promise<void> {
    try {
      const storageKey = `${STORAGE_KEYS.CRISIS_EVENT_PREFIX}${eventId}`;
      await SecureStore.deleteItemAsync(storageKey);
    } catch (error) {
      throw new SecureStorageError(
        `Failed to delete crisis event ${eventId}`,
        'deleteCrisisEvent',
        error as Error
      );
    }
  }

  /**
   * Delete all crisis events from secure storage
   * 
   * Note: This is a best-effort operation. Since expo-secure-store doesn't
   * provide a way to list all keys, this method only deletes known crisis events.
   * In a production app, you would maintain an index of crisis event IDs.
   * 
   * @param eventIds - Array of crisis event IDs to delete
   * @throws {SecureStorageError} If any delete operation fails
   */
  async deleteAllCrisisEvents(eventIds: string[]): Promise<void> {
    try {
      const deletePromises = eventIds.map(id => this.deleteCrisisEvent(id));
      await Promise.all(deletePromises);
    } catch (error) {
      throw new SecureStorageError(
        'Failed to delete all crisis events',
        'deleteAllCrisisEvents',
        error as Error
      );
    }
  }

  /**
   * Clear all secure storage data
   * 
   * This method deletes all data stored by this service.
   * Use with caution - this operation cannot be undone.
   * 
   * @param crisisEventIds - Array of crisis event IDs to delete
   * @throws {SecureStorageError} If any delete operation fails
   */
  async clearAll(crisisEventIds: string[] = []): Promise<void> {
    try {
      await this.deleteUserProfile();
      await this.deleteAllCrisisEvents(crisisEventIds);
    } catch (error) {
      throw new SecureStorageError(
        'Failed to clear all secure storage',
        'clearAll',
        error as Error
      );
    }
  }
}

/**
 * Singleton instance of SecureStorage
 * 
 * Use this instance throughout the app for consistent storage access.
 */
export const secureStorage = new SecureStorage();
