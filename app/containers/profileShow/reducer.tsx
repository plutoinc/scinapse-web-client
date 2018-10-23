import { ACTION_TYPES, Actions } from "../../actions/actionTypes";

export interface ProfileShowState extends Readonly<{}> {
  profileId: string;
  paperIds: number[];
  page: number;
  numberOfPapers: number;
  totalPaperPage: number;
  loadingPapers: boolean;
}

export const PROFILE_SHOW_STATE_INITIAL_STATE: ProfileShowState = {
  profileId: "",
  paperIds: [],
  page: 1,
  numberOfPapers: 0,
  totalPaperPage: 0,
  loadingPapers: false,
};

export function reducer(state: ProfileShowState = PROFILE_SHOW_STATE_INITIAL_STATE, action: Actions): ProfileShowState {
  switch (action.type) {
    case ACTION_TYPES.PROFILE_COMMON_SUCCEEDED_TO_GET_PROFILE: {
      return {
        ...state,
        profileId: action.payload.profileId,
      };
    }

    case ACTION_TYPES.PROFILE_COMMON_START_TO_GET_PROFILE_PUBLICATIONS: {
      return {
        ...state,
        loadingPapers: true,
      };
    }

    case ACTION_TYPES.PROFILE_COMMON_FAILED_TO_GET_PROFILE_PUBLICATIONS: {
      return {
        ...state,
        loadingPapers: false,
      };
    }

    case ACTION_TYPES.PROFILE_COMMON_SUCCEEDED_TO_GET_PROFILE_PUBLICATIONS: {
      return {
        ...state,
        paperIds: action.payload.paperIds,
        page: action.payload.page,
        numberOfPapers: action.payload.numberOfPapers,
        totalPaperPage: action.payload.totalPages,
        loadingPapers: false,
      };
    }

    default:
      return state;
  }
}
