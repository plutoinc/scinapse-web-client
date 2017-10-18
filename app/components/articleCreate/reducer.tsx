import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import {
  ARTICLE_CREATE_INITIAL_STATE,
  IArticleCreateStateRecord,
  initialAuthorRecord,
  initialAuthorInputError,
} from "./records";

export function reducer(state = ARTICLE_CREATE_INITIAL_STATE, action: IReduxAction<any>): IArticleCreateStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_CREATE_CHANGE_CREATE_STEP: {
      return state.set("currentStep", action.payload.step);
    }

    case ACTION_TYPES.ARTICLE_CREATE_TOGGLE_ARTICLE_CATEGORY_DROPDOWN: {
      return state.set("isArticleCategoryDropDownOpen", !state.isArticleCategoryDropDownOpen);
    }

    case ACTION_TYPES.ARTICLE_CREATE_SELECT_ARTICLE_CATEGORY: {
      return state.set("articleCategory", action.payload.category);
    }

    case ACTION_TYPES.ARTICLE_CREATE_PLUS_AUTHOR: {
      return state.withMutations(currentState => {
        currentState
          .set("authors", currentState.authors.push(initialAuthorRecord))
          .setIn(["hasErrorCheck", "authors"], currentState.hasErrorCheck.authors.push(initialAuthorInputError));
      });
    }

    case ACTION_TYPES.ARTICLE_CREATE_MINUS_AUTHOR: {
      return state.withMutations(currentState => {
        currentState
          .set("authors", currentState.authors.pop())
          .setIn(["hasErrorCheck", "authors"], currentState.hasErrorCheck.authors.pop());
      });
    }

    case ACTION_TYPES.ARTICLE_CREATE_CHANGE_ARTICLE_LINK: {
      return state.set("articleLink", action.payload.articleLink);
    }

    case ACTION_TYPES.ARTICLE_CREATE_CHANGE_ARTICLE_TITLE: {
      return state.set("articleTitle", action.payload.articleTitle);
    }

    case ACTION_TYPES.ARTICLE_CREATE_CHANGE_AUTHOR_NAME: {
      return state.setIn(["authors", action.payload.index, "name"], action.payload.name);
    }

    case ACTION_TYPES.ARTICLE_CREATE_CHANGE_AUTHOR_INSTITUTION: {
      return state.setIn(["authors", action.payload.index, "institution"], action.payload.institution);
    }

    case ACTION_TYPES.ARTICLE_CREATE_CHANGE_SUMMARY: {
      return state.set("summary", action.payload.summary);
    }

    case ACTION_TYPES.ARTICLE_CREATE_CHANGE_NOTE: {
      return state.set("note", action.payload.note);
    }

    case ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR: {
      if (action.payload.index === undefined) {
        return state.setIn(["hasErrorCheck", action.payload.type], true);
      } else {
        return state.setIn(["hasErrorCheck", "authors", action.payload.index, action.payload.type], true);
      }
    }

    case ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR: {
      if (action.payload.index === undefined) {
        return state.setIn(["hasErrorCheck", action.payload.type], false);
      } else {
        return state.setIn(["hasErrorCheck", "authors", action.payload.index, action.payload.type], false);
      }
    }

    case ACTION_TYPES.ARTICLE_CREATE_START_TO_CREATE_ARTICLE: {
      return state.set("isLoading", true);
    }

    case ACTION_TYPES.ARTICLE_CREATE_SUCCEEDED_TO_CREATE_ARTICLE: {
      return state.set("isLoading", false);
    }

    case ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_CREATE_ARTICLE: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return ARTICLE_CREATE_INITIAL_STATE;
    }

    default:
      return state;
  }
}
