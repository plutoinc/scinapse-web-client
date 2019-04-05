export interface RawSuggestion {
  highlighted: string;
  keyword: string;
  original_query: string;
  suggest_query: string;
  suggestion: string;
}

export interface Suggestion {
  highlighted: string;
  originalQuery: string;
  suggestQuery: string;
}
