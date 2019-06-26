jest.mock('react-ga');

import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import * as store from 'store';
import { initialState } from '../../reducers';
import setUserToTracker from '../trackUser';
import { ACTION_TYPES } from '../../actions/actionTypes';
import { USER_ID_KEY } from '../../constants/actionTicket';

const mockStore = configureMockStore([thunk, setUserToTracker]);

const mockUser = {
  email: 'mock@mock.org',
  firstName: 'mock',
  lastName: 'user',
  id: 88,
};

describe('setUserToTracker redux middleware', () => {
  beforeEach(() => {
    store.clearAll();
  });

  describe('when user succeeded to check auth status(logged in)', () => {
    beforeEach(() => {
      const reduxStore = mockStore(initialState);
      reduxStore.dispatch({
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
        payload: {
          user: mockUser,
        },
      });
    });

    it('should set user information to store', () => {
      expect(store.get(USER_ID_KEY)).toEqual(mockUser.id);
    });
  });

  describe('when user succeeded to check auth status but actually logged out status', () => {
    beforeEach(() => {
      const reduxStore = mockStore(initialState);
      reduxStore.dispatch({
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
        payload: {
          user: mockUser,
        },
      });
      reduxStore.dispatch({
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
        payload: {
          user: null,
        },
      });
    });

    it('should remove user id information from store', () => {
      expect(store.get(USER_ID_KEY)).toBeUndefined();
    });
  });

  describe('when user succeeded to sign in', () => {
    beforeEach(() => {
      const reduxStore = mockStore(initialState);
      reduxStore.dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: mockUser,
        },
      });
    });

    it('should set user information to store', () => {
      expect(store.get(USER_ID_KEY)).toEqual(mockUser.id);
    });
  });

  describe('when user succeeded to sign out', () => {
    beforeEach(() => {
      const reduxStore = mockStore(initialState);
      reduxStore.dispatch({
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
        payload: {
          user: mockUser,
        },
      });
      reduxStore.dispatch({
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT,
      });
    });

    it('should remove user id information from store', () => {
      expect(store.get(USER_ID_KEY)).toBeUndefined();
    });
  });
});
