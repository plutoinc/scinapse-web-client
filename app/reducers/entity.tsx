import { merge } from 'lodash';
import { Author } from '../model/author/author';
import { Actions, ACTION_TYPES } from '../actions/actionTypes';
import { Paper } from '../model/paper';
import { Collection } from '../model/collection';
import { Member } from '../model/member';
import { Journal } from '../model/journal';
import { PaperInCollection } from '../model/paperInCollection';
import { Profile } from '../model/profile';

export interface NormalizedPaperListResponse {
  entities: { papers: { [paperId: string]: Paper } };
  result: number[];
}
/*
  ***************************************************
  ************CAUTION************
  ***************************************************
  Entities should not be nested object.
  They allow only 1-depth object to update because [Object Rest/Spread Properties for ECMAScript]
  allow only shallow merge.

  REFERENCE: https://github.com/tc39/proposal-object-rest-spread
*/

export interface AppEntities {
  authors: {
    [authorId: string]: Author;
  };
  papers: {
    [paperId: string]: Paper;
  };
  papersInCollection: {
    [paperId: string]: PaperInCollection;
  };
  collections: {
    [collectionId: string]: Collection;
  };
  members: {
    [memberId: number]: Member;
  };
  journals: {
    [journalId: string]: Journal;
  };
  profiles: {
    [authorId: string]: Profile;
  };
}

export interface EntityState extends Readonly<AppEntities> {}

export const INITIAL_ENTITY_STATE: AppEntities = {
  authors: {},
  papers: {},
  papersInCollection: {},
  collections: {},
  members: {},
  journals: {},
  profiles: {},
};

export function reducer(state: EntityState = INITIAL_ENTITY_STATE, action: Actions): AppEntities {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_ADD_ENTITY: {
      const { entities } = action.payload;

      if (!entities) {
        return state;
      }

      const newState = { ...state };
      for (const key of Object.keys(entities)) {
        const newKey = key as keyof AppEntities;
        if (newKey) {
          newState[newKey] = merge({}, state[newKey], entities[newKey]) as any;
        }
      }

      return newState;
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_POST_PAPER_TO_COLLECTION:
    case ACTION_TYPES.GLOBAL_FAILED_TO_REMOVE_PAPER_FROM_COLLECTION:
    case ACTION_TYPES.GLOBAL_START_TO_ADD_PAPER_TO_COLLECTION: {
      const targetCollection = action.payload.collection;
      const newCollections = {
        ...state.collections,
        [targetCollection.id]: {
          ...targetCollection,
          containsSelected: true,
          paperCount: targetCollection.paperCount + 1,
        },
      };

      return { ...state, collections: newCollections };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_REMOVE_PAPER_FROM_COLLECTION:
    case ACTION_TYPES.GLOBAL_FAILED_TO_ADD_PAPER_TO_COLLECTION:
    case ACTION_TYPES.GLOBAL_START_TO_REMOVE_PAPER_FROM_COLLECTION: {
      const targetCollection = action.payload.collection;
      const newCollections = {
        ...state.collections,
        [targetCollection.id]: {
          ...targetCollection,
          containsSelected: false,
          paperCount: targetCollection.paperCount - 1,
          note: null,
        },
      };

      return { ...state, collections: newCollections };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_DELETE_COLLECTION: {
      const targetCollectionId = action.payload.collectionId;
      const { [targetCollectionId]: deletedItem, ...newCollections } = state.collections;

      return { ...state, collections: newCollections };
    }

    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_SUCCEEDED_TO_UPDATE_PAPER_NOTE: {
      const targetCollectionId = action.payload.collectionId;

      return {
        ...state,
        papersInCollection: {
          ...state.papersInCollection,
          [action.payload.paperId]: {
            ...state.papersInCollection[action.payload.paperId],
            note: action.payload.note,
          },
        },
        collections: {
          ...state.collections,
          [targetCollectionId]: {
            ...state.collections[targetCollectionId],
            containsSelected: true,
            note: action.payload.note,
            noteUpdated: !!action.payload.note,
          },
        },
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_CHANGE_REPRESENTATIVE_PAPERS: {
      const { authorId, papers } = action.payload;

      return {
        ...state,
        authors: {
          ...state.authors,
          [authorId]: {
            ...state.authors[authorId],
            representativePapers: papers,
          },
        },
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_ADD_PROFILE_CV_DATA:
    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_CV_DATA:
    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_REMOVE_PROFILE_CV_DATA: {
      const { authorId, cvInformation, cvInfoType } = action.payload;

      return {
        ...state,
        profiles: {
          ...state.profiles,
          [authorId]: {
            ...state.profiles[authorId],
            [cvInfoType]: cvInformation,
          },
        },
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_IMAGE_DATA: {
      const { authorId, profileImageUrl } = action.payload;
      // TODO: remove below after changing member id type to string
      const memberId = parseInt(authorId, 10);

      return {
        ...state,
        authors: {
          ...state.authors,
          [authorId]: {
            ...state.authors[authorId],
            profileImageUrl,
          },
        },
        members: {
          ...state.members,
          [authorId]: {
            ...state.members[memberId],
            profileImageUrl,
          },
        },
      };
    }

    case ACTION_TYPES.PDF_VIEWER_GET_BEST_PDF_OF_PAPER: {
      const { paperId, bestPDF } = action.payload;
      return {
        ...state,
        papers: {
          ...state.papers,
          [paperId]: {
            ...state.papers[paperId],
            bestPdf: bestPDF,
          },
        },
      };
    }

    case ACTION_TYPES.GLOBAL_FLUSH_ENTITIES:
      return INITIAL_ENTITY_STATE;

    default:
      return state;
  }
}
