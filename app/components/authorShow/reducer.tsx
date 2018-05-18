import { ACTION_TYPES, Actions } from "../../actions/actionTypes";
import { AUTHOR_PAPERS_SORT_TYPES } from "../../api/author/types";

export interface AuthorShowState
  extends Readonly<{
      paperIds: number[];
      authorId: number | null;
      coAuthorIds: number[];
      papersTotalPage: number;
      papersCurrentPage: number;
      papersSort: AUTHOR_PAPERS_SORT_TYPES;
    }> {}

export const AUTHOR_SHOW_INITIAL_STATE: AuthorShowState = {
  paperIds: [],
  authorId: null,
  coAuthorIds: [],
  papersTotalPage: 0,
  papersCurrentPage: 1,
  papersSort: "MOST_CITATIONS",
};

export function reducer(state: AuthorShowState = AUTHOR_SHOW_INITIAL_STATE, action: Actions): AuthorShowState {
  switch (action.type) {
    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR: {
      return {
        ...state,
        ...{
          authorId: action.payload.authorId,
        },
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS: {
      return {
        ...state,
        ...{
          coAuthorIds: action.payload.coAuthorIds,
        },
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_GET_PAPERS: {
      return {
        ...state,
        ...{
          paperIds: action.payload.paperIds,
        },
      };
    }

    default:
      return state;
  }
}
