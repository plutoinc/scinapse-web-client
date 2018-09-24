import { ACTION_TYPES, Actions } from "../../actions/actionTypes";

export interface UserCollectionsState
  extends Readonly<{
      isLoadingCollections: boolean;
      hasFailedToLoadCollections: boolean;
      collectionIds: number[];
      maxCollectionCount: number;
      targetMemberId: number;
    }> {}

export const USER_COLLECTIONS_INITIAL_STATE: UserCollectionsState = {
  isLoadingCollections: false,
  hasFailedToLoadCollections: false,
  collectionIds: [],
  maxCollectionCount: 0,
  targetMemberId: 0,
};

export function reducer(
  state: UserCollectionsState = USER_COLLECTIONS_INITIAL_STATE,
  action: Actions
): UserCollectionsState {
  switch (action.type) {
    case ACTION_TYPES.COLLECTIONS_START_TO_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingCollections: true,
        hasFailedToLoadCollections: false,
      };
    }

    case ACTION_TYPES.COLLECTIONS_SUCCEEDED_GET_COLLECTIONS: {
      return {
        ...state,
        collectionIds: action.payload.result,
        maxCollectionCount: action.payload.numberOfElements,
        isLoadingCollections: false,
        hasFailedToLoadCollections: false,
      };
    }

    case ACTION_TYPES.COLLECTIONS_FAILED_TO_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingCollections: false,
        hasFailedToLoadCollections: true,
      };
    }

    case ACTION_TYPES.COLLECTIONS_SUCCEEDED_GET_MEMBER: {
      return {
        ...state,
        targetMemberId: action.payload.memberId,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION: {
      return {
        ...state,
        collectionIds: [action.payload.collectionId, ...state.collectionIds],
      };
    }

    default:
      return state;
  }
}
