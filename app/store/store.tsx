import { AxiosInstance } from 'axios';
import { configureStore, getDefaultMiddleware, Middleware, AnyAction } from '@reduxjs/toolkit';
import { ThunkMiddleware } from 'redux-thunk';
import { createLogger } from 'redux-logger';
import ReduxNotifier from '../middlewares/notifier';
import setUserToTracker from '../middlewares/trackUser';
import { rootReducer, initialState, AppState } from '../reducers';
import { logException } from '../helpers/errorHandler';
import { getAxiosInstance } from '../api/axios';

function getBrowserInitialState() {
  try {
    if (!(window as any).__INITIAL_STATE__) {
      return initialState;
    }
    const initialStateString = decodeURIComponent((window as any).__INITIAL_STATE__);
    delete (window as any).__INITIAL_STATE__;
    return JSON.parse(initialStateString);
  } catch (err) {
    logException(err, {
      extra: 'Error occurred at getBrowserInitialState',
    });
    return initialState;
  }
}

function initializeStore() {
  const loggerMiddleware = createLogger({ collapsed: true });
  const preloadedState = getBrowserInitialState();

  const defaultMiddleware = getDefaultMiddleware<AppState, { thunk: { extraArgument: { axios: AxiosInstance } } }>({
    thunk: { extraArgument: { axios: getAxiosInstance() } },
  });
  const middleware: Array<Middleware<{}, AppState> | ThunkMiddleware<AppState, AnyAction, { axios: AxiosInstance }>> = [
    ...defaultMiddleware,
    ReduxNotifier,
    setUserToTracker,
    loggerMiddleware,
  ];

  return configureStore({
    reducer: rootReducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
  });
}

class StoreManager {
  private _store: ReturnType<typeof initializeStore>;

  public get store() {
    if (this._store) {
      return this._store;
    }
    this._store = initializeStore();
    return this._store;
  }
}

const storeManager = new StoreManager();

export default storeManager;
