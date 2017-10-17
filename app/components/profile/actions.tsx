import { ACTION_TYPES } from "../../actions/actionTypes";
import alertToast from "../../helpers/makePlutoToastAction";

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
