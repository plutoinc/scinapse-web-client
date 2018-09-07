import { createStore, applyMiddleware, compose } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { History, createBrowserHistory, createMemoryHistory } from "history";
import thunkMiddleware from "redux-thunk";
import { Store } from "react-redux";
import { createLogger } from "redux-logger";
import ReduxNotifier from "./middlewares/notifier";
import setUserToTracker from "./middlewares/trackUser";
import EnvChecker from "./helpers/envChecker";
import { rootReducer, initialState, AppState } from "./reducers";
import { logException } from "./helpers/errorHandler";

export interface ReadonlyStore extends Readonly<Store<AppState>> {}

class StoreManager {
  private _store: ReadonlyStore;
  private _history: History;

  get store() {
    return this._store;
  }

  get history() {
    return this._history;
  }

  public setHistoryObject(initialRequest?: string) {
    if (EnvChecker.isOnServer()) {
      this._history = createMemoryHistory({
        initialEntries: [initialRequest || "/"],
      });
    } else {
      this._history = createBrowserHistory();
    }
  }

  public initializeStore(initialRequest?: string) {
    this.setHistoryObject(initialRequest);
    const routeMiddleware = routerMiddleware(this.history);

    if (EnvChecker.isOnServer()) {
      this._store = createStore<AppState>(
        connectRouter(this.history)(rootReducer),
        initialState,
        compose(applyMiddleware(routeMiddleware, thunkMiddleware))
      );
    } else {
      if (EnvChecker.isLocal() || EnvChecker.isDev()) {
        const loggerMiddleware = createLogger({});
        this._store = createStore(
          connectRouter(this.history)(rootReducer),
          this.getBrowserInitialState(),
          compose(applyMiddleware(routeMiddleware, thunkMiddleware, ReduxNotifier, loggerMiddleware))
        );
      } else {
        this._store = createStore(
          connectRouter(this.history)(rootReducer),
          this.getBrowserInitialState(),
          compose(applyMiddleware(routeMiddleware, thunkMiddleware, ReduxNotifier, setUserToTracker))
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
        extra: "Error occurred at getBrowserInitialState",
      });
      return initialState;
    }
  }
}

const storeManager = new StoreManager();

export default storeManager;
