import { ACTION_TYPES, Actions } from "../../actions/actionTypes";

export interface PaperShowActionBarState
  extends Readonly<{
      isCollectionDropdownOpen: boolean;
    }> {}

export const PAPER_SHOW_ACTION_BAR_INITIAL_STATE: PaperShowActionBarState = {
  isCollectionDropdownOpen: false,
};

export function reducer(
  state: PaperShowActionBarState = PAPER_SHOW_ACTION_BAR_INITIAL_STATE,
  action: Actions
): PaperShowActionBarState {
  switch (action.type) {
    case ACTION_TYPES.PAPER_SHOW_ACTION_BAR_OPEN_COLLECTION_DROPDOWN: {
      return { ...state, isCollectionDropdownOpen: true };
    }

    case ACTION_TYPES.PAPER_SHOW_ACTION_BAR_CLOSE_COLLECTION_DROPDOWN: {
      return { ...state, isCollectionDropdownOpen: false };
    }

    default:
      return state;
  }
}
