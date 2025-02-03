import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleTags } from './operations';
import { upsertComponentInternalTag } from './actions';

// Mock the actions module
vi.mock('./actions', () => ({
  upsertComponentInternalTag: vi.fn(),
}));

// Mock the spinner
vi.mock('@topcli/spinner', () => ({
  Spinner: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    succeed: vi.fn(),
    failed: vi.fn(),
    elapsedTime: 100,
  })),
}));

describe('operations', () => {
  const mockSpace = 'test-space';
  const mockPassword = 'test-password';
  const mockRegion = 'eu' as const;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleTags', () => {
    it('should successfully process tags', async () => {
      const mockTags = [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ];

      // Mock successful upsert
      vi.mocked(upsertComponentInternalTag).mockResolvedValue(undefined);

      const result = await handleTags(mockSpace, mockPassword, mockRegion, mockTags);

      expect(upsertComponentInternalTag).toHaveBeenCalledTimes(2);
      expect(upsertComponentInternalTag).toHaveBeenCalledWith(mockSpace, mockTags[0], mockPassword, mockRegion);
      expect(upsertComponentInternalTag).toHaveBeenCalledWith(mockSpace, mockTags[1], mockPassword, mockRegion);
      expect(result.failed).toHaveLength(0);
    });

    it('should handle failed tag processing', async () => {
      const mockTags = [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ];

      // Mock first tag succeeding and second failing
      vi.mocked(upsertComponentInternalTag)
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('API Error'));

      const result = await handleTags(mockSpace, mockPassword, mockRegion, mockTags);

      expect(upsertComponentInternalTag).toHaveBeenCalledTimes(2);
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0]).toEqual({
        name: 'tag2',
        error: new Error('API Error'),
      });
    });
  });
});
