import { ACTION_TYPES } from '../../actions/actionTypes';
import { ARTICLE_SEARCH_INITIAL_STATE, ArticleSearchState } from './records';
import { SearchResult } from '../../api/search';
import { AddPaperToCollectionParams, RemovePapersFromCollectionParams } from '../../api/collection';
import { Paper } from '../../model/paper';

export function reducer(
  state: ArticleSearchState = ARTICLE_SEARCH_INITIAL_STATE,
  action: ReduxAction<any>
): ArticleSearchState {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT: {
      return { ...state, searchInput: action.payload.searchInput };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS: {
      return {
        ...state,
        isContentLoading: true,
        pageErrorCode: null,
        searchFromSuggestion: false,
        searchInput: action.payload.query,
        sort: action.payload.sort,
        suggestionKeyword: '',
        highlightedSuggestionKeyword: '',
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS: {
      const payload: SearchResult = action.payload;

      if (!payload.data.page) return state;

      return {
        ...state,
        isContentLoading: false,
        pageErrorCode: null,
        isEnd: payload.data.page.last,
        doi: payload.data.doi,
        doiPatternMatched: payload.data.doiPatternMatched,
        page: payload.data.page.page,
        totalElements: payload.data.page.totalElements,
        totalPages: payload.data.page.totalPages,
        searchItemsToShow: payload.data.content,
        suggestionKeyword: payload.data.suggestion ? payload.data.suggestion.suggestQuery : '',
        highlightedSuggestionKeyword: payload.data.suggestion ? payload.data.suggestion.highlighted : '',
        searchFromSuggestion: payload.data.resultModified,
        matchAuthors: payload.data.matchedAuthor,
        detectedYear: payload.data.detectedYear,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS: {
      return { ...state, isContentLoading: false, pageErrorCode: action.payload.statusCode };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS:
    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS: {
      return { ...state, isContentLoading: true, pageErrorCode: null };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS:
    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS: {
      return {
        ...state,
        isEnd: action.payload.isEnd,
        page: action.payload.nextPage,
        searchItemsToShow: action.payload.papers,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        isContentLoading: false,
        pageErrorCode: null,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS:
    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS: {
      return { ...state, isContentLoading: false };
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_ADD_PAPER_TO_COLLECTION: {
      const payload: AddPaperToCollectionParams = action.payload;

      const newSavedInCollection = payload.collection;
      const paperId = payload.paperId;

      const newSearchItemsToShow: Paper[] = state.searchItemsToShow.map(paper => {
        if (paper.id === paperId) {
          const newPaper = {
            ...paper,
            relation: {
              savedInCollections:
                !!paper.relation && paper.relation.savedInCollections.length >= 1
                  ? [newSavedInCollection, ...paper.relation.savedInCollections]
                  : [newSavedInCollection],
            },
          };
          return newPaper;
        } else {
          return paper;
        }
      });

      return { ...state, searchItemsToShow: newSearchItemsToShow };
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_REMOVE_PAPER_FROM_COLLECTION: {
      const payload: RemovePapersFromCollectionParams = action.payload;

      const removedSavedInCollection = payload.collection;
      const paperId = payload.paperIds[0];

      const newSearchItemsToShow: Paper[] = state.searchItemsToShow.map(paper => {
        if (paper.id === paperId) {
          const savedInCollection = paper.relation.savedInCollections;

          const removedIndex: number = savedInCollection
            .map(data => {
              return data.id;
            })
            .indexOf(removedSavedInCollection.id);

          const newPaper = {
            ...paper,
            relation: {
              savedInCollections: [
                ...savedInCollection.slice(0, removedIndex),
                ...savedInCollection.slice(removedIndex + 1, savedInCollection.length),
              ],
            },
          };

          return newPaper;
        } else {
          return paper;
        }
      });

      return { ...state, searchItemsToShow: newSearchItemsToShow };
    }

    default: {
      return state;
    }
  }
}
