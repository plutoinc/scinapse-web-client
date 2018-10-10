import { ACTION_TYPES, Actions } from "../../actions/actionTypes";

export interface ProfileShowState extends Readonly<{}> {
  profileId: string;
}

export const PROFILE_SHOW_STATE_INITIAL_STATE: ProfileShowState = {
  profileId: "",
};

export function reducer(state: ProfileShowState = PROFILE_SHOW_STATE_INITIAL_STATE, action: Actions): ProfileShowState {
  switch (action.type) {
    case ACTION_TYPES.PROFILE_SHOW_SUCCEEDED_TO_GET_PROFILE: {
      return {
        ...state,
        profileId: action.payload.profileId,
      };
    }

    default:
      return state;
  }
}
