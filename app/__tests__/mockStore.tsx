import thunk, { ThunkDispatch } from 'redux-thunk';
import configureMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import { AppState, initialState } from '../reducers';
import { AnyAction } from 'redux';

export type EnhancedMockStore = MockStoreEnhanced<AppState, ThunkDispatch<AppState, undefined, AnyAction>>;

export const generateMockStore = (state: AppState = initialState) => {
  const mockStore = configureMockStore<AppState, ThunkDispatch<AppState, undefined, AnyAction>>([thunk]);
  const store = mockStore(state);

  store.clearActions();
  return store;
};
