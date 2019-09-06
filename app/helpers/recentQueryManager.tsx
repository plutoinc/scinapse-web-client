import { getWordsArraySplitBySpaceWithoutStopWords } from './highlightContent';
import { SuggestionItem } from '../components/common/InputWithSuggestionList';
const store = require('store');

const RECENT_QUERY_LIST_KEY = 'r_q_l';

export function getRecentQueries(searchText: string): SuggestionItem[] {
  const recentQueries: string[] = store.get(RECENT_QUERY_LIST_KEY) || [];
  const textToMatch = getWordsArraySplitBySpaceWithoutStopWords(searchText);
  const matchedQueries = recentQueries.filter(query => {
    return query
      .split(' ')
      .map(q => q.trim())
      .some(q => textToMatch.some(text => q.toLowerCase().startsWith(text.toLowerCase())));
  });

  return matchedQueries.map(q => ({ text: q, removable: true }));
}

export function saveQueryToRecentHistory(searchText: string) {
  const oldQueries: string[] = store.get(RECENT_QUERY_LIST_KEY) || [];

  const i = oldQueries.findIndex(q => q === searchText);
  let newQueries;
  if (i > -1) {
    newQueries = [searchText, ...oldQueries.slice(0, i), ...oldQueries.slice(i + 1)];
  } else {
    newQueries = [searchText, ...oldQueries];
  }

  store.set(RECENT_QUERY_LIST_KEY, newQueries);
}

export function deleteQueryFromRecentList(query: string) {
  const oldQueries: string[] = store.get(RECENT_QUERY_LIST_KEY) || [];
  const i = oldQueries.findIndex(q => q === query);

  if (i > -1) {
    const newQueries = [...oldQueries.slice(0, i), ...oldQueries.slice(i + 1)];
    store.set(RECENT_QUERY_LIST_KEY, newQueries);
  }
}
