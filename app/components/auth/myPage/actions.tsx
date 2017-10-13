import { ACTION_TYPES } from "../../../actions/actionTypes";
import { MY_PAGE_CATEGORY_TYPE } from "./records";

export function changeCategory(category: MY_PAGE_CATEGORY_TYPE) {
  return {
    type: ACTION_TYPES.MY_PAGE_CHANGE_CATEGORY,
    payload: {
      category,
    },
  };
}

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
