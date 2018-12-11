import { Author } from "../model/author/author";
import { Actions, ACTION_TYPES } from "../actions/actionTypes";
import { Paper } from "../model/paper";
import { Comment } from "../model/comment";
import { Collection } from "../model/collection";
import { Member } from "../model/member";
import { Journal } from "../model/journal";
import { PaperInCollection } from "../model/paperInCollection";

export interface NormalizedPaperListResponse {
  entities: { papers: { [paperId: number]: Paper } };
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

export type AppEntities = {
  authors: {
    [authorId: number]: Author;
  };
  papers: {
    [paperId: number]: Paper;
  };
  papersInCollection: {
    [paperId: number]: PaperInCollection;
  };
  comments: {
    [commentId: number]: Comment;
  };
  collections: {
    [collectionId: number]: Collection;
  };
  members: {
    [memberId: number]: Member;
  };
  journals: {
    [journalId: number]: Journal;
  };
};

export interface EntityState extends Readonly<AppEntities> {}

export const INITIAL_ENTITY_STATE = {
  authors: {},
  papers: {},
  papersInCollection: {},
  comments: {},
  collections: {},
  members: {},
  journals: {},
};

export function reducer(state: EntityState = INITIAL_ENTITY_STATE, action: Actions) {
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
        papersInCollection: { ...state.papersInCollection, ...entities.papersInCollection },
        comments: { ...state.comments, ...entities.comments },
        collections: { ...state.collections, ...entities.collections },
        members: { ...state.members, ...entities.members },
        journals: { ...state.journals, ...entities.journals },
      };

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_POST_PAPER_TO_COLLECTION:
    case ACTION_TYPES.GLOBAL_FAILED_TO_REMOVE_PAPER_TO_COLLECTION:
    case ACTION_TYPES.GLOBAL_START_TO_ADD_PAPER_TO_COLLECTION: {
      const targetCollection = action.payload.collection;
      const newCollections = {
        ...state.collections,
        [`${targetCollection.id}`]: {
          ...targetCollection,
          contains_selected: true,
          paper_count: targetCollection.paper_count + 1,
        },
      };

      return { ...state, collections: newCollections };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_REMOVE_PAPER_FROM_COLLECTION:
    case ACTION_TYPES.GLOBAL_FAILED_TO_ADD_PAPER_TO_COLLECTION:
    case ACTION_TYPES.GLOBAL_START_TO_REMOVE_PAPER_TO_COLLECTION: {
      const targetCollection = action.payload.collection;
      const newCollections = {
        ...state.collections,
        [`${targetCollection.id}`]: {
          ...targetCollection,
          contains_selected: false,
          paper_count: targetCollection.paper_count - 1,
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
        collections: {
          ...state.collections,
          [targetCollectionId]: {
            ...state.collections[targetCollectionId],
            contains_selected: true,
            note: action.payload.note,
          },
        },
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_CHANGE_SELECTED_PAPERS: {
      const { authorId, papers } = action.payload;

      return {
        ...state,
        authors: {
          ...state.authors,
          [authorId]: {
            ...state.authors[authorId],
            selectedPapers: papers,
          },
        },
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST: {
      const { authorId, paperIds } = action.payload;

      return {
        ...state,
        authors: {
          ...state.authors,
          [authorId]: {
            ...state.authors[authorId],
            paperCount: state.authors[authorId].paperCount + paperIds.length,
          },
        },
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_REMOVE_PAPER_FROM_AUTHOR_PAPER_LIST: {
      const { authorId, paperId } = action.payload;
      const selectedPapers = state.authors[authorId].selectedPapers;
      const index = state.authors[authorId].selectedPapers.findIndex(paper => paper.id === paperId);

      return {
        ...state,
        authors: {
          ...state.authors,
          [authorId]: {
            ...state.authors[authorId],
            paperCount: state.authors[authorId].paperCount - 1,
            selectedPapers:
              index === -1 ? selectedPapers : [...selectedPapers.slice(0, index), ...selectedPapers.slice(index + 1)],
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
