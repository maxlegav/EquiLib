/**
 * Local Storage Service
 * 
 * Handles non-sensitive data storage using AsyncStorage.
 * This service is responsible for:
 * - Conversation history storage and retrieval
 * - Practitioner data caching for offline access
 * - Triage results storage
 * 
 * Requirements: 10.1, 11.5
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Practitioner, TriageResult } from '../../types/models';

/**
 * Storage keys for local data
 */
const STORAGE_KEYS = {
  CONVERSATIONS: 'conversations',
  PRACTITIONERS_CACHE: 'practitioners_cache',
  TRIAGE_RESULTS: 'triage_results',
  OFFLINE_QUEUE: 'offline_queue',
} as const;

/**
 * Error types for local storage operations
 */
export class LocalStorageError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'LocalStorageError';
  }
}

/**
 * Local Storage Service
 * 
 * Provides non-encrypted storage for general app data.
 * Uses AsyncStorage for persistent local storage.
 */
export class LocalStorage {
  /**
   * Save conversations to local storage
   * 
   * Stores conversation history for offline access and history viewing.
   * Conversations are stored as JSON array.
   * 
   * @param conversations - Array of conversations to save
   * @throws {LocalStorageError} If save operation fails
   */
  async saveConversations(conversations: Conversation[]): Promise<void> {
    try {
      const conversationsJson = JSON.stringify(conversations);
      await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, conversationsJson);
    } catch (error) {
      throw new LocalStorageError(
        'Failed to save conversations',
        'saveConversations',
        error as Error
      );
    }
  }

  /**
   * Retrieve conversations from local storage
   * 
   * Returns all stored conversations with date objects properly reconstructed.
   * 
   * @returns Array of conversations, empty array if none found
   * @throws {LocalStorageError} If retrieval operation fails
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      const conversationsJson = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      
      if (!conversationsJson) {
        return [];
      }

      const conversations = JSON.parse(conversationsJson);
      
      // Convert date strings back to Date objects
      return conversations.map((conversation: any) => ({
        ...conversation,
        startedAt: new Date(conversation.startedAt),
        completedAt: conversation.completedAt ? new Date(conversation.completedAt) : undefined,
        messages: conversation.messages.map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        })),
      }));
    } catch (error) {
      throw new LocalStorageError(
        'Failed to retrieve conversations',
        'getConversations',
        error as Error
      );
    }
  }

  /**
   * Cache practitioners for offline access
   * 
   * Stores practitioner data locally to enable offline browsing
   * and reduce network requests.
   * 
   * @param practitioners - Array of practitioners to cache
   * @throws {LocalStorageError} If cache operation fails
   */
  async cachePractitioners(practitioners: Practitioner[]): Promise<void> {
    try {
      const practitionersJson = JSON.stringify(practitioners);
      await AsyncStorage.setItem(STORAGE_KEYS.PRACTITIONERS_CACHE, practitionersJson);
    } catch (error) {
      throw new LocalStorageError(
        'Failed to cache practitioners',
        'cachePractitioners',
        error as Error
      );
    }
  }

  /**
   * Retrieve cached practitioners
   * 
   * Returns cached practitioner data for offline access.
   * 
   * @returns Array of practitioners, empty array if none cached
   * @throws {LocalStorageError} If retrieval operation fails
   */
  async getCachedPractitioners(): Promise<Practitioner[]> {
    try {
      const practitionersJson = await AsyncStorage.getItem(STORAGE_KEYS.PRACTITIONERS_CACHE);
      
      if (!practitionersJson) {
        return [];
      }

      const practitioners = JSON.parse(practitionersJson);
      
      // Convert date strings back to Date objects
      return practitioners.map((practitioner: any) => ({
        ...practitioner,
        nextAvailableSlot: practitioner.nextAvailableSlot 
          ? new Date(practitioner.nextAvailableSlot) 
          : undefined,
      }));
    } catch (error) {
      throw new LocalStorageError(
        'Failed to retrieve cached practitioners',
        'getCachedPractitioners',
        error as Error
      );
    }
  }

  /**
   * Save triage results to local storage
   * 
   * Stores triage results for history viewing and tracking.
   * 
   * @param triageResults - Array of triage results to save
   * @throws {LocalStorageError} If save operation fails
   */
  async saveTriageResults(triageResults: TriageResult[]): Promise<void> {
    try {
      const triageResultsJson = JSON.stringify(triageResults);
      await AsyncStorage.setItem(STORAGE_KEYS.TRIAGE_RESULTS, triageResultsJson);
    } catch (error) {
      throw new LocalStorageError(
        'Failed to save triage results',
        'saveTriageResults',
        error as Error
      );
    }
  }

  /**
   * Retrieve triage results from local storage
   * 
   * Returns all stored triage results with date objects properly reconstructed.
   * 
   * @returns Array of triage results, empty array if none found
   * @throws {LocalStorageError} If retrieval operation fails
   */
  async getTriageResults(): Promise<TriageResult[]> {
    try {
      const triageResultsJson = await AsyncStorage.getItem(STORAGE_KEYS.TRIAGE_RESULTS);
      
      if (!triageResultsJson) {
        return [];
      }

      const triageResults = JSON.parse(triageResultsJson);
      
      // Convert date strings back to Date objects
      return triageResults.map((result: any) => ({
        ...result,
        timestamp: new Date(result.timestamp),
      }));
    } catch (error) {
      throw new LocalStorageError(
        'Failed to retrieve triage results',
        'getTriageResults',
        error as Error
      );
    }
  }

  /**
   * Delete a specific conversation
   * 
   * Removes a conversation from storage by ID.
   * 
   * @param conversationId - ID of the conversation to delete
   * @throws {LocalStorageError} If delete operation fails
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const conversations = await this.getConversations();
      const filteredConversations = conversations.filter(
        (conv) => conv.id !== conversationId
      );
      await this.saveConversations(filteredConversations);
    } catch (error) {
      throw new LocalStorageError(
        `Failed to delete conversation ${conversationId}`,
        'deleteConversation',
        error as Error
      );
    }
  }

  /**
   * Clear all local storage data
   * 
   * Removes all data stored by this service.
   * Use with caution - this operation cannot be undone.
   * 
   * @throws {LocalStorageError} If clear operation fails
   */
  async clearAll(): Promise<void> {
    try {
      const keys = [
        STORAGE_KEYS.CONVERSATIONS,
        STORAGE_KEYS.PRACTITIONERS_CACHE,
        STORAGE_KEYS.TRIAGE_RESULTS,
        STORAGE_KEYS.OFFLINE_QUEUE,
      ];
      
      await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
    } catch (error) {
      throw new LocalStorageError(
        'Failed to clear all local storage',
        'clearAll',
        error as Error
      );
    }
  }

  /**
   * Get storage usage statistics
   * 
   * Returns information about storage usage for monitoring and debugging.
   * 
   * @returns Object with storage statistics
   */
  async getStorageStats(): Promise<{
    conversationCount: number;
    practitionerCount: number;
    triageResultCount: number;
  }> {
    try {
      const conversations = await this.getConversations();
      const practitioners = await this.getCachedPractitioners();
      const triageResults = await this.getTriageResults();

      return {
        conversationCount: conversations.length,
        practitionerCount: practitioners.length,
        triageResultCount: triageResults.length,
      };
    } catch (error) {
      throw new LocalStorageError(
        'Failed to get storage statistics',
        'getStorageStats',
        error as Error
      );
    }
  }
}

/**
 * Singleton instance of LocalStorage
 * 
 * Use this instance throughout the app for consistent storage access.
 */
export const localStorage = new LocalStorage();
