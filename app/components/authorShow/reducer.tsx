import { AUTHOR_SHOW_INITIAL_STATE, AuthorShowState } from "./records";
import { ACTION_TYPES, Actions } from "../../actions/actionTypes";

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
