import { IReduxAction } from "../../typings/actionType";
import { IProfileStateRecord, PROFILE_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = PROFILE_INITIAL_STATE, action: IReduxAction<any>): IProfileStateRecord {
  switch (action.type) {
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

    default:
      return state;
  }
}
