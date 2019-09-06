jest.unmock('..');

import { STOP_WORDS, getWordsArraySplitBySpaceWithoutStopWords } from '..';

describe('SearchQueryHighlightedContent Component', () => {
  const mockSearchQuery = 'Principles superconductive of devices circuits Tools';

  describe('getWordsArraySplitBySpaceWithoutStopWords function', () => {
    let result: string[];

    beforeEach(() => {
      result = getWordsArraySplitBySpaceWithoutStopWords(mockSearchQuery);
    });

    it('should return array of the words separated by space', () => {
      expect(typeof result).toEqual('object');
    });

    it('should not return element included in STOP_WORD', () => {
      expect(result.every(word => !STOP_WORDS.includes(word))).toBeTruthy();
    });
  });
});
co;
