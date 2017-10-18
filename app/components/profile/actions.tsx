import axios from "axios";
import { Dispatch } from "redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import alertToast from "../../helpers/makePlutoToastAction";
import ProfileAPI from "../../api/profile";
import { push } from "react-router-redux";
import { ICurrentUserRecord } from "../../model/currentUser";
import { IGetUserArticlesParams } from "../../api/profile";

export function syncCurrentUserWithProfileUser(currentUser: ICurrentUserRecord) {
  return {
    type: ACTION_TYPES.PROFILE_SYNC_CURRENT_USER_WITH_PROFILE_USER,
    payload: {
      currentUser,
    },
  };
}

export function getUserProfile(userId: string) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch({
        type: ACTION_TYPES.PROFILE_START_TO_GET_USER_PROFILE,
      });

      const userProfile = await ProfileAPI.getUserProfile(userId);

      dispatch({
        type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_GET_USER_PROFILE,
        payload: {
          userProfile,
        },
      });
    } catch (err) {
      alertToast({
        type: "warning",
        message: "This user you are looking for doesn't exist",
      });

      dispatch({
        type: ACTION_TYPES.PROFILE_FAILED_TO_GET_USER_PROFILE,
      });
      dispatch(push("/"));
    }
  };
}

export function syncSettingInputWithCurrentUser(profileImage: string, institution: string, major: string) {
  return {
    type: ACTION_TYPES.PROFILE_SYNC_SETTING_INPUT_WITH_CURRENT_USER,
    payload: {
      profileImage,
      institution,
      major,
    },
  };
}

export function changeProfileImageInput(profileImage: string) {
  return {
    type: ACTION_TYPES.PROFILE_CHANGE_PROFILE_IMAGE_INPUT,
    payload: {
      profileImage,
    },
  };
}

export function updateCurrentUserProfileImage(profileImage: string) {
  // TODO : API for update user Information
  alertToast({
    type: "success",
    message: "Updated!",
  });
  return {
    type: ACTION_TYPES.PROFILE_UPDATE_CURRENT_USER_PROFILE_IMAGE,
    payload: {
      profileImage,
    },
  };
}

export function changeInstitutionInput(institution: string) {
  return {
    type: ACTION_TYPES.PROFILE_CHANGE_INSTITUTION_INPUT,
    payload: {
      institution,
    },
  };
}

export function updateCurrentUserInstitution(institution: string) {
  // TODO : API for update user Information
  alertToast({
    type: "success",
    message: "Updated!",
  });
  return {
    type: ACTION_TYPES.PROFILE_UPDATE_CURRENT_USER_INSTITUTION,
    payload: {
      institution,
    },
  };
}

export function changeMajorInput(major: string) {
  return {
    type: ACTION_TYPES.PROFILE_CHANGE_MAJOR_INPUT,
    payload: {
      major,
    },
  };
}

export function updateCurrentUserMajor(major: string) {
  // TODO : API for update user Information
  alertToast({
    type: "success",
    message: "Updated!",
  });
  return {
    type: ACTION_TYPES.PROFILE_UPDATE_CURRENT_USER_MAJOR,
    payload: {
      major,
    },
  };
}

export function getUserArticles(params: IGetUserArticlesParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.PROFILE_START_TO_FETCH_USER_ARTICLES,
    });

    try {
      const articleData = await ProfileAPI.getUserArticles(params);
      dispatch({
        type: ACTION_TYPES.PROFILE_SUCCEEDED_FETCH_USER_ARTICLES,
        payload: {
          articles: articleData.articles,
          nextPage: articleData.number + 1,
          isEnd: articleData.last,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch({ type: ACTION_TYPES.PROFILE_FAILED_FETCH_USER_ARTICLES });

        alertToast({
          type: "error",
          message: err.message || err,
        });
      }
    }
  };
}
