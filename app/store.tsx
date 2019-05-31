import { createStore, applyMiddleware, compose } from 'redux';
import { History, createBrowserHistory, createMemoryHistory } from 'history';
import thunkMiddleware from 'redux-thunk';
import { Store } from 'react-redux';
import { createLogger } from 'redux-logger';
import ReduxNotifier from './middlewares/notifier';
import setUserToTracker from './middlewares/trackUser';
import EnvChecker from './helpers/envChecker';
import { rootReducer, initialState, AppState } from './reducers';
import { logException } from './helpers/errorHandler';

export interface ReadonlyStore extends Readonly<Store<AppState>> {}

class StoreManager {
  private _store: ReadonlyStore;
  private _history: History;

  public get store() {
    return this._store;
  }

  public get history() {
    return this._history;
  }

  public setHistoryObject(initialRequest?: string) {
    if (EnvChecker.isOnServer()) {
      this._history = createMemoryHistory({
        initialEntries: [initialRequest || '/'],
      });
    } else {
      this._history = createBrowserHistory();
    }
  }

  public initializeStore(initialRequest?: string) {
    this.setHistoryObject(initialRequest);

    if (EnvChecker.isOnServer()) {
      this._store = createStore<AppState>(rootReducer, initialState, compose(applyMiddleware(thunkMiddleware)));
    } else {
      if (EnvChecker.isLocal() || EnvChecker.isDev()) {
        const loggerMiddleware = createLogger({ collapsed: true });
        this._store = createStore(
          rootReducer,
          this.getBrowserInitialState(),
          compose(applyMiddleware(thunkMiddleware, ReduxNotifier, loggerMiddleware))
        );
      } else {
        this._store = createStore(
          rootReducer,
          this.getBrowserInitialState(),
          compose(applyMiddleware(thunkMiddleware, ReduxNotifier, setUserToTracker))
        );
      }
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
