import { IReduxAction } from "../../typings/actionType";
import { ARTICLE_CREATE_INITIAL_STATE, IArticleCreateStateRecord } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { initialAuthor } from "../../model/author";

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

    case ACTION_TYPES.ARTICLE_CREATE_ADD_AUTHOR: {
      return state.set("authors", state.get("authors").push(initialAuthor));
    }

    case ACTION_TYPES.ARTICLE_CREATE_MINUS_AUTHOR: {
      return state.set("authors", state.get("authors").pop());
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return ARTICLE_CREATE_INITIAL_STATE;
    }

    default:
      return state;
  }
}
