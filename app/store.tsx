import * as ReactRouterRedux from "react-router-redux";
import { createStore, Middleware, applyMiddleware } from "redux";
import { History, createBrowserHistory, createMemoryHistory } from "history";
import thunkMiddleware from "redux-thunk";
import { Store } from "react-redux";
import { createLogger } from "redux-logger";
import ReduxNotifier from "./helpers/notifier";
import EnvChecker from "./helpers/envChecker";
import { rootReducer, initialState, AppState } from "./reducers";
import { logException } from "./helpers/errorHandler";

class StoreManager {
  private _store: Store<AppState>;
  private _history: History;
  private routerMiddleware: Middleware;
  private loggerMiddleware: Middleware;

  public constructor() {
    this.initializeStore();
  }

  get store() {
    return this._store;
  }

  get history() {
    return this._history;
  }

  public setHistoryObject() {
    if (EnvChecker.isServer()) {
      this._history = createMemoryHistory();
    } else {
      this._history = createBrowserHistory();
    }
  }

  public initializeStore() {
    this.setHistoryObject();
    this.routerMiddleware = ReactRouterRedux.routerMiddleware(this.history);
    this.setLoggerMiddleware();

    if (EnvChecker.isServer()) {
      this._store = createStore<AppState>(
        rootReducer,
        initialState,
        applyMiddleware(this.routerMiddleware, thunkMiddleware),
      );
    } else {
      if (EnvChecker.isDev() || EnvChecker.isStage()) {
        this._store = createStore(
          rootReducer,
          this.getBrowserInitialState(),
          applyMiddleware(this.routerMiddleware, thunkMiddleware, ReduxNotifier, this.loggerMiddleware),
        );
      } else {
        this._store = createStore(
          rootReducer,
          this.getBrowserInitialState(),
          applyMiddleware(this.routerMiddleware, thunkMiddleware, ReduxNotifier),
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
      return JSON.parse(initialStateString);
    } catch (err) {
      logException(err, {
        extra: "Error occurred at getBrowserInitialState",
      });
      return initialState;
    }
  }

  private setLoggerMiddleware() {
    this.loggerMiddleware = createLogger({});
  }
}

const storeManager = new StoreManager();

export default storeManager;
