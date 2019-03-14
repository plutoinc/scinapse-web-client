import { getWordsArraySplitBySpaceWithoutStopWords } from "../components/common/highLightedContent";
const store = require("store");

const RECENT_QUERY_LIST_KEY = "r_q_l";

export function getRecentQueries(searchText?: string): string[] {
  const recentQueries: string[] = store.get(RECENT_QUERY_LIST_KEY) || [];

  if (searchText) {
    const textToMatch = getWordsArraySplitBySpaceWithoutStopWords(searchText);
    const matchedQueries = recentQueries.filter(query => {
      return query
        .split(" ")
        .map(q => q.trim())
        .some(q => textToMatch.some(text => q.toLowerCase().startsWith(text.toLowerCase())));
    });
    return matchedQueries;
  }

  return recentQueries;
}

export function saveQueryToRecentHistory(searchText: string) {
  const oldQueries: string[] = store.get(RECENT_QUERY_LIST_KEY) || [];
  const querySet = new Set(oldQueries);
  querySet.add(searchText);
  const newQueries = Array.from(querySet);
  store.set(RECENT_QUERY_LIST_KEY, newQueries);
}

export function deleteQueryFromRecentList(query: string) {
  const oldQueries: string[] = store.get(RECENT_QUERY_LIST_KEY) || [];
  const i = oldQueries.findIndex(q => q === query);

  if (i > -1) {
    const newQueries = [...oldQueries.slice(0, i), ...oldQueries.slice(i + 1)];
    store.set(RECENT_QUERY_LIST_KEY, newQueries);
    return newQueries;
  } else {
    return oldQueries;
  }
}
