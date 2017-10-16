import { ACTION_TYPES } from "../../../actions/actionTypes";

export function changeProfileImageInput(profileImage: string) {
  return {
    type: ACTION_TYPES.MY_PAGE_CHANGE_PROFILE_IMAGE_INPUT,
    payload: {
      profileImage,
    },
  };
}

export function changeInstitutionInput(institution: string) {
  return {
    type: ACTION_TYPES.MY_PAGE_CHANGE_INSTITUTION_INPUT,
    payload: {
      institution,
    },
  };
}

export function changeMajorInput(major: string) {
  return {
    type: ACTION_TYPES.MY_PAGE_CHANGE_MAJOR_INPUT,
    payload: {
      major,
    },
  };
}
