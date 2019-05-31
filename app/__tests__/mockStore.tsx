import thunk from 'redux-thunk';
import { AppState } from '../reducers';
const configureMockStore = require('redux-mock-store');

export const generateMockStore = (state: AppState | {}) => {
  const mockStore = configureMockStore([thunk]);
  const store = mockStore(state);

  store.clearActions();
  return store;
};
