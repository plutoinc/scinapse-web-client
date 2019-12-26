import { configureStore, getDefaultMiddleware, EnhancedStore, AnyAction } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import ReduxNotifier from '../middlewares/notifier';
import setUserToTracker from '../middlewares/trackUser';
import EnvChecker from '../helpers/envChecker';
import { rootReducer, initialState, AppState } from '../reducers';
import { logException } from '../helpers/errorHandler';
import { getAxiosInstance } from '../api/axios';

class StoreManager {
  private _store: EnhancedStore<AppState, AnyAction>;

  public get store() {
    if (this._store) {
      return this._store;
    }
    this._store = this.initializeStore();
    return this._store;
  }

  public initializeStore() {
    const loggerMiddleware = createLogger({ collapsed: true });
    const preloadedState = this.getBrowserInitialState();
    const middlewares = [
      ...getDefaultMiddleware({
        thunk: {
          extraArgument: {
            axios: getAxiosInstance(),
          },
        },
      }),
      ReduxNotifier,
      setUserToTracker,
    ];
    if (EnvChecker.isLocal() || EnvChecker.isDev()) {
      middlewares.push(loggerMiddleware);
    }

    return configureStore({
      reducer: rootReducer,
      middleware: middlewares,
      devTools: process.env.NODE_ENV !== 'production',
      preloadedState,
    });
  }

  private getBrowserInitialState() {
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
}

const storeManager = new StoreManager();

export default storeManager;
