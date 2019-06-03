jest.unmock('../actions');

import * as Actions from '../actions';
import { generateMockStore } from '../../../__tests__/mockStore';
import { ACTION_TYPES } from '../../../actions/actionTypes';
import { GLOBAL_DIALOG_TYPE } from '../reducer';

describe('sign in actions', () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe('openSignIn Action', () => {
    it('should return GLOBAL_DIALOG_OPEN action with GLOBAL_DIALOG_TYPE.SIGN_IN type', () => {
      store.dispatch(Actions.openSignIn());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.GLOBAL_DIALOG_OPEN,
        payload: {
          type: GLOBAL_DIALOG_TYPE.SIGN_IN,
        },
      });
    });
  });

  describe('openVerificationNeeded Action', () => {
    it('should return GLOBAL_DIALOG_OPEN action with GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED type', () => {
      store.dispatch(Actions.openVerificationNeeded());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.GLOBAL_DIALOG_OPEN,
        payload: {
          type: GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED,
        },
      });
    });
  });

  describe('closeDialog Action', () => {
    it('should return GLOBAL_DIALOG_CLOSE action', () => {
      store.dispatch(Actions.closeDialog());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.GLOBAL_DIALOG_CLOSE,
      });
    });
  });

  describe('changeDialogType Action', () => {
    it('should return GLOBAL_CHANGE_DIALOG_TYPE action with type payload', () => {
      const mockType = GLOBAL_DIALOG_TYPE.SIGN_IN;
      store.dispatch(Actions.changeDialogType(mockType));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE,
        payload: {
          type: mockType,
        },
      });
    });
  });
});
