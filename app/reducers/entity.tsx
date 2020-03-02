import { merge } from 'lodash';
import { Author } from '../model/author/author';
import { Actions, ACTION_TYPES } from '../actions/actionTypes';
import { Paper } from '../model/paper';
import { Collection } from '../model/collection';
import { Member } from '../model/member';
import { Journal } from '../model/journal';
import { PaperInCollection } from '../model/paperInCollection';

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
    [memberId: string]: Member;
  };
  journals: {
    [journalId: string]: Journal;
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

    case ACTION_TYPES.GLOBAL_FLUSH_ENTITIES:
      return INITIAL_ENTITY_STATE;

    default:
      return state;
  }
}
