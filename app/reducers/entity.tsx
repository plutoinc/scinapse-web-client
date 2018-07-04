import { Author } from "../model/author/author";
import { Actions, ACTION_TYPES } from "../actions/actionTypes";
import { Paper } from "../model/paper";
import { Comment } from "../model/comment";
import { Collection } from "../model/collection";

/*
  ***************************************************
  ************CAUTION************
  ***************************************************
  Entities should not be nested object.
  They allow only 1-depth object to update because [Object Rest/Spread Properties for ECMAScript]
  allow only shallow merge.

  REFERENCE: https://github.com/tc39/proposal-object-rest-spread
*/

export type AppEntities = {
  authors: {
    [authorId: number]: Author;
  };
  papers: {
    [paperId: number]: Paper;
  };
  comments: {
    [commentId: number]: Comment;
  };
  collections: {
    [collectionId: number]: Collection;
  };
};

export interface EntityState extends Readonly<AppEntities> {}

export const INITIAL_ENTITY_STATE = {
  authors: {},
  papers: {},
  comments: {},
  collections: {}
};

export function reducer(
  state: EntityState = INITIAL_ENTITY_STATE,
  action: Actions
) {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_ADD_ENTITY:
      const { entities } = action.payload;

      if (!entities) {
        return state;
      }

      return {
        ...state,
        authors: { ...state.authors, ...entities.authors },
        papers: { ...state.papers, ...entities.papers },
        comments: { ...state.comments, ...entities.comments },
        collections: { ...state.collections, ...entities.collections }
      };

    case ACTION_TYPES.GLOBAL_FLUSH_ENTITIES:
      return INITIAL_ENTITY_STATE;

    case ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_REMOVE_PAPER_TO_COLLECTION:
    case ACTION_TYPES.GLOBAL_DIALOG_START_TO_ADD_PAPER_TO_COLLECTION: {
      const targetCollection = action.payload.collection;
      const newCollections = {
        ...state.collections,
        [`${targetCollection.id}`]: {
          ...targetCollection,
          contains_selected: true
        }
      };

      return { ...state, collections: newCollections };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_ADD_PAPER_TO_COLLECTION:
    case ACTION_TYPES.GLOBAL_DIALOG_START_TO_REMOVE_PAPER_TO_COLLECTION: {
      const targetCollection = action.payload.collection;
      const newCollections = {
        ...state.collections,
        [`${targetCollection.id}`]: {
          ...targetCollection,
          contains_selected: false
        }
      };

      return { ...state, collections: newCollections };
    }

    default:
      return state;
  }
}
