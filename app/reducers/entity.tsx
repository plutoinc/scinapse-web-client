import { Author } from "../model/author/author";
import { Actions, ACTION_TYPES } from "../actions/actionTypes";

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
};

export interface EntityState extends Readonly<AppEntities> {}

export const INITIAL_ENTITY_STATE = {
  authors: {},
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
      };

    default:
      return state;
  }
}
