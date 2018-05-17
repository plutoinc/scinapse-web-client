import { ACTION_TYPES, Actions } from "../../actions/actionTypes";
import { Paper } from "../../model/paper";
import { Author } from "../../model/author/author";
import { AUTHOR_PAPERS_SORT_TYPES } from "../../api/author";

export interface AuthorShowState
  extends Readonly<{
      papers: Paper[];
      author: Author | null;
      coAuthors: Author[];
      papersTotalPage: number;
      papersCurrentPage: number;
      papersSort: AUTHOR_PAPERS_SORT_TYPES;
    }> {}

export const AUTHOR_SHOW_INITIAL_STATE: AuthorShowState = {
  papers: [],
  author: null,
  coAuthors: [],
  papersTotalPage: 0,
  papersCurrentPage: 1,
  papersSort: "MOST_CITATION",
};

export function reducer(state: AuthorShowState = AUTHOR_SHOW_INITIAL_STATE, action: Actions): AuthorShowState {
  switch (action.type) {
    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR: {
      return {
        ...state,
        ...{
          author: action.payload.author,
        },
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS: {
      return {
        ...state,
        ...{
          coAuthors: action.payload.coAuthors,
        },
      };
    }

    default:
      return state;
  }
}
