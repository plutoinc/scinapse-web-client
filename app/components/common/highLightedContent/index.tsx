export const STOP_WORDS = [
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'if',
  'in',
  'into',
  'is',
  'it',
  'no',
  'of',
  'on',
  'or',
  'such',
  'that',
  'the',
  'their',
  'then',
  'there',
  'these',
  'they',
  'this',
  'to',
  'was',
  'will',
  'with',
];

export function getWordsArraySplitBySpaceWithoutStopWords(text: string) {
  return text
    .trim()
    .split(' ')
    .filter(word => !STOP_WORDS.includes(word))
    .map(word => word.trim());
}

export function getHighlightedContent(content: string, highlightText: string) {
  const highlightWords = getWordsArraySplitBySpaceWithoutStopWords(highlightText);

  return content
    .split(' ')
    .map(word => word.trim())
    .map(contentWord => {
      const matchWord = highlightWords.find(highlightWord =>
        contentWord.toLowerCase().startsWith(highlightWord.toLowerCase())
      );
      if (matchWord) {
        return `<b>${contentWord.slice(0, matchWord.length)}</b>${contentWord.slice(matchWord.length) || ''}`;
      } else {
        return contentWord;
      }
    })
    .join(' ');
}
