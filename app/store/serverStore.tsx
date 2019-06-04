import { createStore, compose, applyMiddleware, AnyAction } from 'redux';
import thunk, { ThunkMiddleware, ThunkDispatch } from 'redux-thunk';
import { rootReducer, initialState, AppState } from '../reducers';

export default class ServerStoreManager {
  public static getStore() {
    return createStore<AppState, AnyAction, { dispatch: ThunkDispatch<AppState, undefined, AnyAction> }, {}>(
      rootReducer,
      initialState,
      compose(applyMiddleware(thunk as ThunkMiddleware<AppState>))
    );
  }
}
