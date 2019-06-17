import { createStore, applyMiddleware, compose, Store, AnyAction } from 'redux';
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk';
import { createLogger } from 'redux-logger';
import ReduxNotifier from '../middlewares/notifier';
import setUserToTracker from '../middlewares/trackUser';
import EnvChecker from '../helpers/envChecker';
import { rootReducer, initialState, AppState } from '../reducers';
import { logException } from '../helpers/errorHandler';

class StoreManager {
  private _store: Store<AppState, AnyAction> & { dispatch: ThunkDispatch<AppState, undefined, AnyAction> };

  public get store() {
    if (this._store) {
      return this._store;
    }
    this._store = this.initializeStore();
    return this._store;
  }

  public initializeStore() {
    if (EnvChecker.isLocal() || EnvChecker.isDev()) {
      const loggerMiddleware = createLogger({ collapsed: true });
      return createStore(
        rootReducer,
        this.getBrowserInitialState(),
        compose(applyMiddleware(thunkMiddleware, ReduxNotifier, loggerMiddleware, setUserToTracker))
      );
    } else {
      return createStore(
        rootReducer,
        this.getBrowserInitialState(),
        compose(applyMiddleware(thunkMiddleware, ReduxNotifier, setUserToTracker))
      );
    }
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
