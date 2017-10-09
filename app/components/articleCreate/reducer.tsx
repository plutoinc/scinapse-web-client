import { IReduxAction } from "../../typings/actionType";
import { ARTICLE_CREATE_INITIAL_STATE, IArticleCreateStateRecord, initialAuthorRecord } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = ARTICLE_CREATE_INITIAL_STATE, action: IReduxAction<any>): IArticleCreateStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_CREATE_CHANGE_CREATE_STEP: {
      return state.set("currentStep", action.payload.step);
    }

    case ACTION_TYPES.ARTICLE_CREATE_TOGGLE_ARTICLE_CATEGORY_DROPDOWN: {
      return state.set("isArticleCategoryDropDownOpen", !state.get("isArticleCategoryDropDownOpen"));
    }

    case ACTION_TYPES.ARTICLE_CREATE_SELECT_ARTICLE_CATEGORY: {
      return state.set("articleCategory", action.payload.category);
    }

    case ACTION_TYPES.ARTICLE_CREATE_PLUS_AUTHOR: {
      return state.set("authors", state.get("authors").push(initialAuthorRecord));
    }

    case ACTION_TYPES.ARTICLE_CREATE_MINUS_AUTHOR: {
      return state.set("authors", state.get("authors").pop());
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
      return state.setIn(["authors", action.payload.index, "organization"], action.payload.institution);
    }

    case ACTION_TYPES.ARTICLE_CREATE_CHANGE_ABSTRACT: {
      return state.set("abstract", action.payload.abstract);
    }

    case ACTION_TYPES.ARTICLE_CREATE_CHANGE_NOTE: {
      return state.set("note", action.payload.note);
    }

    case ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR: {
      return state.withMutations(currentState => {
        return currentState
          .set("errorType", action.payload.type)
          .set("errorContent", action.payload.content)
          .set("authorInputErrorIndex", null)
          .set("authorInputErrorType", null);
      });
    }

    case ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR: {
      return state.withMutations(currentState => {
        return currentState
          .set("errorType", "")
          .set("errorContent", "")
          .set("authorInputErrorIndex", null)
          .set("authorInputErrorType", null);
      });
    }

    case ACTION_TYPES.ARTICLE_CREATE_AUTHOR_INPUT_ERROR: {
      return state.withMutations(currentState => {
        return currentState
          .set("errorType", "authorInput")
          .set("errorContent", "")
          .set("authorInputErrorIndex", action.payload.index)
          .set("authorInputErrorType", action.payload.type);
      });
    }

    case ACTION_TYPES.ARTICLE_CREATE_SUCCEEDED_TO_VALIDATE_STEP: {
      return state.withMutations(currentState => {
        return currentState
          .setIn(["validEachStep", action.payload.step], true)
          .set("errorType", "")
          .set("errorContent", "")
          .set("authorInputErrorIndex", null)
          .set("authorInputErrorType", null);
      });
    }

    case ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP: {
      return state.setIn(["validEachStep", action.payload.step], false);
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return ARTICLE_CREATE_INITIAL_STATE;
    }

    default:
      return state;
  }
}
