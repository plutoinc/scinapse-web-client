import axios from "axios";
import { Dispatch } from "redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import alertToast from "../../helpers/makePlutoToastAction";
import ProfileAPI from "../../api/profile";
import { push } from "react-router-redux";
import { ICurrentUserRecord } from "../../model/currentUser";
import { IGetUserArticlesParams, IGetEvaluationsParams, IUpdateUserProfileParams } from "../../api/profile";
import { IMemberRecord } from "../../model/member";

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

export interface IUpdateCurrentUserProfileParams {
  currentUserRecord: ICurrentUserRecord;
  profileImage: string;
  institution: string;
  major: string;
}

export function updateCurrentUserProfile(params: IUpdateCurrentUserProfileParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.PROFILE_START_TO_UPDATE_USER_PROFILE,
    });

    try {
      const { currentUserRecord, profileImage, institution, major } = params;
      const updateUserProfileParams: IUpdateUserProfileParams = {
        email: currentUserRecord.email,
        name: currentUserRecord.name,
        profileImage,
        institution,
        major,
      };
      const userId: string = currentUserRecord.id.toString();
      const updatedMemberData: IMemberRecord = await ProfileAPI.updateUserProfile(userId, updateUserProfileParams);

      alertToast({
        type: "success",
        message: "Updated!",
      });

      dispatch({
        type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_UPDATE_USER_PROFILE,
        payload: {
          userProfile: updatedMemberData,
        },
      });
    } catch (err) {
      alertToast({
        type: "error",
        message: "Failed to update profile!",
      });

      dispatch({
        type: ACTION_TYPES.PROFILE_FAILED_TO_UPDATE_USER_PROFILE,
      });
    }
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

export function changeMajorInput(major: string) {
  return {
    type: ACTION_TYPES.PROFILE_CHANGE_MAJOR_INPUT,
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
        type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_FETCH_USER_ARTICLES,
        payload: {
          articles: articleData.articles,
          nextPage: articleData.number + 1,
          isEnd: articleData.last,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch({ type: ACTION_TYPES.PROFILE_FAILED_TO_FETCH_USER_ARTICLES });

        alertToast({
          type: "error",
          message: err.message || err,
        });
      }
    }
  };
}

export function clearArticlesToShow() {
  return {
    type: ACTION_TYPES.PROFILE_CLEAR_ARTICLES_TO_SHOW,
  };
}

export function clearEvaluationIdsToShow() {
  return {
    type: ACTION_TYPES.PROFILE_CLEAR_EVALUATIONS_TO_SHOW,
  };
}

export function fetchEvaluations(params: IGetEvaluationsParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.PROFILE_START_TO_FETCH_USER_EVALUATIONS,
    });

    try {
      const evaluationData = await ProfileAPI.getUserEvaluations(params);

      dispatch({
        type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_FETCH_USER_EVALUATIONS,
        payload: {
          evaluations: evaluationData.evaluations,
          nextPage: evaluationData.number + 1,
          isEnd: evaluationData.last,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.PROFILE_FAILED_TO_FETCH_USER_EVALUATIONS,
      });

      alertToast({
        type: "error",
        message: err.message || err,
      });
    }
  };
}
