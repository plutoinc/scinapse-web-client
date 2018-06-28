import { ACTION_TYPES, Actions } from "../../actions/actionTypes";

export enum GLOBAL_DIALOG_TYPE {
  SIGN_IN,
  SIGN_UP,
  WALLET,
  VERIFICATION_NEEDED,
  RESET_PASSWORD,
  COLLECTION
}

export interface DialogState
  extends Readonly<{
      isLoading: boolean;
      hasError: boolean;
      isOpen: boolean;
      type: GLOBAL_DIALOG_TYPE | null;
      isLoadingMyCollections: boolean;
      hasErrorToCollectionDialog: boolean;
      myCollectionIds: number[];
    }> {}

export const DIALOG_INITIAL_STATE: DialogState = {
  isLoading: false,
  hasError: false,
  isOpen: true,
  type: GLOBAL_DIALOG_TYPE.COLLECTION,
  isLoadingMyCollections: false,
  hasErrorToCollectionDialog: false,
  myCollectionIds: []
};

export function reducer(
  state: DialogState = DIALOG_INITIAL_STATE,
  action: Actions
): DialogState {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_DIALOG_OPEN: {
      return { ...state, isOpen: true, type: action.payload.type };
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE:
    case ACTION_TYPES.GLOBAL_DIALOG_CLOSE: {
      return DIALOG_INITIAL_STATE;
    }

    case ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE: {
      return { ...state, type: action.payload.type };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_START_TO_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingMyCollections: true,
        hasErrorToCollectionDialog: false
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_GET_COLLECTIONS: {
      return {
        ...state,
        myCollectionIds: action.payload.collectionIds,
        isLoadingMyCollections: false,
        hasErrorToCollectionDialog: false
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingMyCollections: false,
        hasErrorToCollectionDialog: true
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_START_TO_POST_COLLECTION: {
      return {
        ...state,
        isLoadingMyCollections: true,
        hasErrorToCollectionDialog: false
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION: {
      return {
        ...state,
        myCollectionIds: [
          action.payload.collectionId,
          ...state.myCollectionIds
        ],
        isLoadingMyCollections: false
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION: {
      return {
        ...state,
        isLoadingMyCollections: false,
        hasErrorToCollectionDialog: true
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_START_TO_ADD_PAPER_TO_COLLECTIONS: {
      return {
        ...state,
        isLoadingMyCollections: true,
        hasErrorToCollectionDialog: false
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_ADD_PAPER_TO_COLLECTIONS: {
      return {
        ...state,
        isLoadingMyCollections: false
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_ADD_PAPER_TO_COLLECTIONS: {
      return {
        ...state,
        isLoadingMyCollections: false,
        hasErrorToCollectionDialog: true
      };
    }

    default:
      return state;
  }
}
