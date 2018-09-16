import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { ARTICLE_SEARCH_INITIAL_STATE, ArticleSearchState } from "../records";

function reduceState(action: any, state: ArticleSearchState = ARTICLE_SEARCH_INITIAL_STATE) {
  return reducer(state, action);
}

describe("ArticleSearch reducer", () => {
  let mockAction: any;
  let mockState: ArticleSearchState;
  let state: ArticleSearchState;

  describe("when receive ARTICLE_SEARCH_START_TO_GET_SUGGESTION_KEYWORD action", () => {
    beforeEach(() => {
      mockState = { ...ARTICLE_SEARCH_INITIAL_STATE, suggestionKeyword: "abc", highlightedSuggestionKeyword: "def" };
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_SUGGESTION_KEYWORD,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set suggestionKeyword state to empty string", () => {
      expect(state.suggestionKeyword).toEqual("");
    });

    it("should set highlightedSuggestionKeyword state to empty string", () => {
      expect(state.highlightedSuggestionKeyword).toEqual("");
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_GET_SUGGESTION_KEYWORD action", () => {
    const mockKeyword = "abc";

    beforeEach(() => {
      mockState = ARTICLE_SEARCH_INITIAL_STATE;
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_SUGGESTION_KEYWORD,
        payload: {
          keyword: {
            keyword: mockKeyword,
            suggestion: mockKeyword,
            highlighted: mockKeyword,
          },
        },
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set suggestionKeyword state to mockKeyword value", () => {
      expect(state.suggestionKeyword).toEqual(mockKeyword);
    });

    it("should set highlightedSuggestionKeyword state to mockKeyword value", () => {
      expect(state.highlightedSuggestionKeyword).toEqual(mockKeyword);
    });
  });
});
