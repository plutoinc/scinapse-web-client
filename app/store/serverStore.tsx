import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { AppState, rootReducer, initialState } from '../reducers';

export default class ServerStoreManager {
  public static getStore() {
    return createStore<AppState>(rootReducer, initialState, compose(applyMiddleware(thunkMiddleware)));
  }
}
