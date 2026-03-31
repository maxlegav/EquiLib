/**
 * Unit tests for LocalStorage service
 * 
 * Tests non-sensitive data storage operations using AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorage, LocalStorageError } from '../LocalStorage';
import { Conversation, Practitioner, TriageResult } from '../../../types/models';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('LocalStorage', () => {
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage();
    jest.clearAllMocks();
  });

  describe('saveConversations', () => {
    it('should save conversations to AsyncStorage', async () => {
      const conversations: Conversation[] = [
        {
          id: 'conv-1',
          userId: 'user-1',
          startedAt: new Date('2024-01-01T10:00:00Z'),
          completedAt: new Date('2024-01-01T10:15:00Z'),
          tone: 'supportive',
          messages: [
            {
              id: 'msg-1',
              conversationId: 'conv-1',
              role: 'user',
              content: 'Hello',
              timestamp: new Date('2024-01-01T10:00:00Z'),
            },
          ],
          status: 'completed',
        },
      ];

      await storage.saveConversations(conversations);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'conversations',
        JSON.stringify(conversations)
      );
    });

    it('should throw LocalStorageError on failure', async () => {
      const error = new Error('Storage full');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(storage.saveConversations([])).rejects.toThrow(LocalStorageError);
    });
  });

  describe('getConversations', () => {
    it('should retrieve and parse conversations from AsyncStorage', async () => {
      const conversations = [
        {
          id: 'conv-1',
          userId: 'user-1',
          startedAt: '2024-01-01T10:00:00Z',
          completedAt: '2024-01-01T10:15:00Z',
          tone: 'supportive',
          messages: [
            {
              id: 'msg-1',
              conversationId: 'conv-1',
              role: 'user',
              content: 'Hello',
              timestamp: '2024-01-01T10:00:00Z',
            },
          ],
          status: 'completed',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(conversations)
      );

      const result = await storage.getConversations();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('conversations');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('conv-1');
      expect(result[0].startedAt).toBeInstanceOf(Date);
      expect(result[0].completedAt).toBeInstanceOf(Date);
      expect(result[0].messages[0].timestamp).toBeInstanceOf(Date);
    });

    it('should return empty array when no conversations exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await storage.getConversations();

      expect(result).toEqual([]);
    });

    it('should throw LocalStorageError on failure', async () => {
      const error = new Error('Read failed');
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(storage.getConversations()).rejects.toThrow(LocalStorageError);
    });
  });

  describe('cachePractitioners', () => {
    it('should cache practitioners to AsyncStorage', async () => {
      const practitioners: Practitioner[] = [
        {
          id: 'prac-1',
          name: 'Dr. Smith',
          firstName: 'John',
          lastName: 'Smith',
          specialty: 'Psychologist',
          specialties: ['Psychologist'],
          credentials: ['PhD'],
          languages: ['French', 'English'],
          phone: '+33123456789',
          email: 'dr.smith@example.com',
          doctolibUrl: 'https://doctolib.fr/dr-smith',
          address: {
            street: '123 Main St',
            city: 'Paris',
            postalCode: '75001',
            country: 'France',
          },
          location: {
            latitude: 48.8566,
            longitude: 2.3522,
            city: 'Paris',
            postalCode: '75001',
          },
          rating: 4.5,
          reviewCount: 100,
          availabilityStatus: 'available',
          acceptsNewPatients: true,
          photo: 'https://example.com/photo.jpg',
          profileDescription: 'Experienced psychologist',
        },
      ];

      await storage.cachePractitioners(practitioners);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'practitioners_cache',
        JSON.stringify(practitioners)
      );
    });

    it('should throw LocalStorageError on failure', async () => {
      const error = new Error('Storage full');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(storage.cachePractitioners([])).rejects.toThrow(LocalStorageError);
    });
  });

  describe('getCachedPractitioners', () => {
    it('should retrieve and parse cached practitioners', async () => {
      const practitioners = [
        {
          id: 'prac-1',
          name: 'Dr. Smith',
          firstName: 'John',
          lastName: 'Smith',
          specialty: 'Psychologist',
          specialties: ['Psychologist'],
          credentials: ['PhD'],
          languages: ['French', 'English'],
          phone: '+33123456789',
          email: 'dr.smith@example.com',
          doctolibUrl: 'https://doctolib.fr/dr-smith',
          address: {
            street: '123 Main St',
            city: 'Paris',
            postalCode: '75001',
            country: 'France',
          },
          location: {
            latitude: 48.8566,
            longitude: 2.3522,
            city: 'Paris',
            postalCode: '75001',
          },
          rating: 4.5,
          reviewCount: 100,
          availabilityStatus: 'available',
          nextAvailableSlot: '2024-01-15T14:00:00Z',
          acceptsNewPatients: true,
          photo: 'https://example.com/photo.jpg',
          profileDescription: 'Experienced psychologist',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(practitioners)
      );

      const result = await storage.getCachedPractitioners();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('practitioners_cache');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('prac-1');
      expect(result[0].nextAvailableSlot).toBeInstanceOf(Date);
    });

    it('should return empty array when no practitioners cached', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await storage.getCachedPractitioners();

      expect(result).toEqual([]);
    });

    it('should throw LocalStorageError on failure', async () => {
      const error = new Error('Read failed');
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(storage.getCachedPractitioners()).rejects.toThrow(LocalStorageError);
    });
  });

  describe('saveTriageResults', () => {
    it('should save triage results to AsyncStorage', async () => {
      const triageResults: TriageResult[] = [
        {
          id: 'triage-1',
          conversationId: 'conv-1',
          userId: 'user-1',
          timestamp: new Date('2024-01-01T10:15:00Z'),
          primaryConcern: 'Anxiety',
          domain: 'psychological',
          severityLevel: 6,
          recommendedSpecialist: 'Psychologist',
          summary: 'Moderate anxiety symptoms',
          actionItems: ['Schedule appointment', 'Practice relaxation'],
          confidence: 0.85,
          requiresUrgentCare: false,
        },
      ];

      await storage.saveTriageResults(triageResults);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'triage_results',
        JSON.stringify(triageResults)
      );
    });
  });

  describe('getTriageResults', () => {
    it('should retrieve and parse triage results', async () => {
      const triageResults = [
        {
          id: 'triage-1',
          conversationId: 'conv-1',
          userId: 'user-1',
          timestamp: '2024-01-01T10:15:00Z',
          primaryConcern: 'Anxiety',
          domain: 'psychological',
          severityLevel: 6,
          recommendedSpecialist: 'Psychologist',
          summary: 'Moderate anxiety symptoms',
          actionItems: ['Schedule appointment'],
          confidence: 0.85,
          requiresUrgentCare: false,
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(triageResults)
      );

      const result = await storage.getTriageResults();

      expect(result).toHaveLength(1);
      expect(result[0].timestamp).toBeInstanceOf(Date);
    });

    it('should return empty array when no triage results exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await storage.getTriageResults();

      expect(result).toEqual([]);
    });
  });

  describe('deleteConversation', () => {
    it('should delete a specific conversation by ID', async () => {
      const conversations = [
        {
          id: 'conv-1',
          userId: 'user-1',
          startedAt: '2024-01-01T10:00:00Z',
          tone: 'supportive',
          messages: [],
          status: 'completed',
        },
        {
          id: 'conv-2',
          userId: 'user-1',
          startedAt: '2024-01-02T10:00:00Z',
          tone: 'direct',
          messages: [],
          status: 'completed',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(conversations)
      );

      await storage.deleteConversation('conv-1');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'conversations',
        expect.stringContaining('conv-2')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'conversations',
        expect.not.stringContaining('conv-1')
      );
    });
  });

  describe('clearAll', () => {
    it('should remove all storage keys', async () => {
      await storage.clearAll();

      expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(4);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('conversations');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('practitioners_cache');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('triage_results');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('offline_queue');
    });

    it('should throw LocalStorageError on failure', async () => {
      const error = new Error('Clear failed');
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(error);

      await expect(storage.clearAll()).rejects.toThrow(LocalStorageError);
    });
  });

  describe('getStorageStats', () => {
    it('should return storage statistics', async () => {
      const conversations = [
        {
          id: 'conv-1',
          userId: 'user-1',
          startedAt: '2024-01-01T10:00:00Z',
          tone: 'supportive',
          messages: [],
          status: 'completed',
        },
      ];
      const practitioners = [
        {
          id: 'prac-1',
          name: 'Dr. Smith',
        },
        {
          id: 'prac-2',
          name: 'Dr. Jones',
        },
      ];
      const triageResults = [
        {
          id: 'triage-1',
          timestamp: '2024-01-01T10:15:00Z',
        },
        {
          id: 'triage-2',
          timestamp: '2024-01-02T10:15:00Z',
        },
        {
          id: 'triage-3',
          timestamp: '2024-01-03T10:15:00Z',
        },
      ];

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(conversations))
        .mockResolvedValueOnce(JSON.stringify(practitioners))
        .mockResolvedValueOnce(JSON.stringify(triageResults));

      const stats = await storage.getStorageStats();

      expect(stats).toEqual({
        conversationCount: 1,
        practitionerCount: 2,
        triageResultCount: 3,
      });
    });
  });
});
