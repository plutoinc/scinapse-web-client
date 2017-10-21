import { List } from "immutable";
import { IReduxAction } from "../../typings/actionType";
import { IProfileStateRecord, PROFILE_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { recordifyCurrentUser } from "../../model/currentUser";

export function reducer(state = PROFILE_INITIAL_STATE, action: IReduxAction<any>): IProfileStateRecord {
  switch (action.type) {
    case ACTION_TYPES.PROFILE_START_TO_FETCH_USER_ARTICLES: {
      return state.withMutations(currentState => {
        return currentState.set("fetchingArticleLoading", true).set("fetchingArticleError", false);
      });
    }

    case ACTION_TYPES.PROFILE_SUCCEEDED_TO_FETCH_USER_ARTICLES: {
      return state.withMutations(currentState => {
        currentState
          .set("isEnd", action.payload.isEnd)
          .set("page", action.payload.nextPage)
          .set("articlesToShow", currentState.articlesToShow.concat(action.payload.articles))
          .set("fetchingArticleLoading", false)
          .set("fetchingArticleError", false);
      });
    }

    case ACTION_TYPES.PROFILE_FAILED_TO_FETCH_USER_ARTICLES: {
      return state.withMutations(currentState => {
        currentState.set("fetchingArticleLoading", false).set("fetchingArticleError", true);
      });
    }

    case ACTION_TYPES.PROFILE_CLEAR_ARTICLES_TO_SHOW: {
      return state.withMutations(currentState => {
        return currentState
          .set("isEnd", false)
          .set("page", 0)
          .set("articlesToShow", List());
      });
    }

    case ACTION_TYPES.PROFILE_START_TO_GET_USER_PROFILE: {
      return state.set("isLoading", true);
    }

    case ACTION_TYPES.PROFILE_SUCCEEDED_TO_GET_USER_PROFILE: {
      return state.withMutations(currentState => {
        currentState.set("isLoading", false).set("userProfile", action.payload.userProfile);
      });
    }

    case ACTION_TYPES.PROFILE_FAILED_TO_GET_USER_PROFILE: {
      return state.withMutations(currentState => {
        currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.PROFILE_SYNC_CURRENT_USER_WITH_PROFILE_USER: {
      return state.set("userProfile", action.payload.currentUser);
    }

    case ACTION_TYPES.PROFILE_SYNC_SETTING_INPUT_WITH_CURRENT_USER: {
      return state.withMutations(currentState => {
        currentState
          .set("profileImageInput", action.payload.profileImage)
          .set("institutionInput", action.payload.institution)
          .set("majorInput", action.payload.major);
      });
    }

    case ACTION_TYPES.PROFILE_CHANGE_PROFILE_IMAGE_INPUT: {
      return state.set("profileImageInput", action.payload.profileImage);
    }

    case ACTION_TYPES.PROFILE_CHANGE_INSTITUTION_INPUT: {
      return state.set("institutionInput", action.payload.institution);
    }

    case ACTION_TYPES.PROFILE_CHANGE_MAJOR_INPUT: {
      return state.set("majorInput", action.payload.major);
    }

    case ACTION_TYPES.PROFILE_START_TO_UPDATE_USER_PROFILE: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.PROFILE_SUCCEEDED_TO_UPDATE_USER_PROFILE: {
      const updatedUserProfile = recordifyCurrentUser(action.payload.userProfile).set("isLoggedIn", true);

      return state.withMutations(currentState => {
        currentState.set("isLoading", false).set("userProfile", updatedUserProfile);
      });
    }

    case ACTION_TYPES.PROFILE_FAILED_TO_UPDATE_USER_PROFILE: {
      return state.withMutations(currentState => {
        currentState.set("isLoading", false).set("hasError", true);
      });
    }

    default:
      return state;
  }
}
