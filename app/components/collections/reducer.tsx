import { ACTION_TYPES, Actions } from '../../actions/actionTypes';

export interface UserCollectionsState
  extends Readonly<{
      isLoadingCollections: boolean;
      pageErrorCode: number | null;
      collectionIds: string[];
      maxCollectionCount: number;
      targetMemberId: number;
    }> {}

export const USER_COLLECTIONS_INITIAL_STATE: UserCollectionsState = {
  isLoadingCollections: false,
  pageErrorCode: null,
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
        pageErrorCode: null,
      };
    }

    case ACTION_TYPES.COLLECTIONS_SUCCEEDED_GET_COLLECTIONS: {
      return {
        ...state,
        collectionIds: action.payload.result,
        maxCollectionCount: action.payload.numberOfElements,
        isLoadingCollections: false,
        pageErrorCode: null,
      };
    }

    case ACTION_TYPES.COLLECTIONS_FAILED_TO_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingCollections: false,
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

    case ACTION_TYPES.COLLECTIONS_FAILED_TO_GET_PAGE_DATA: {
      return {
        ...state,
        pageErrorCode: action.payload.statusCode,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_DELETE_COLLECTION: {
      const targetCollectionId = action.payload.collectionId;
      const index = state.collectionIds.indexOf(targetCollectionId);

      if (index > -1) {
        const newCollectionIds = [...state.collectionIds.slice(0, index), ...state.collectionIds.slice(index + 1)];
        return { ...state, collectionIds: newCollectionIds };
      }

      return state;
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT: {
      return state;
    }

    default:
      return state;
  }
}
