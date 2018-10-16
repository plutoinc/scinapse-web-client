import { ACTION_TYPES, Actions } from "../../actions/actionTypes";

export interface ProfileNewState extends Readonly<{}> {
  profileId: string;
}

export const PROFILE_NEW_STATE_INITIAL_STATE: ProfileNewState = {
  profileId: "",
};

export function reducer(state: ProfileNewState = PROFILE_NEW_STATE_INITIAL_STATE, action: Actions): ProfileNewState {
  switch (action.type) {
    case ACTION_TYPES.PROFILE_NEW_SUCCEEDED_TO_POST_PROFILE: {
      return {
        ...state,
        profileId: action.payload.profileId,
      };
    }

    default:
      return state;
  }
}
