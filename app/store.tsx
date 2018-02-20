import * as Immutable from "immutable";
import * as ReactRouterRedux from "react-router-redux";
import { createStore, Middleware, applyMiddleware } from "redux";
import { History, createBrowserHistory, createHashHistory, createMemoryHistory } from "history";
import thunkMiddleware from "redux-thunk";
import { Store } from "react-redux";
import { createLogger } from "redux-logger";
import ReduxNotifier from "./helpers/notifier";
import EnvChecker from "./helpers/envChecker";
import { rootReducer, initialState, AppState } from "./reducers";

class StoreManager {
  private _store: Store<AppState>;
  private _history: History;
  private routerMiddleware: Middleware;
  private loggerMiddleware: Middleware;

  public constructor() {
    this.setHistoryObject();
    this.routerMiddleware = ReactRouterRedux.routerMiddleware(this.history);
    this.setLoggerMiddleware();

    if (EnvChecker.isServer()) {
      this._store = createStore<AppState>(
        rootReducer,
        initialState,
        applyMiddleware(this.routerMiddleware, thunkMiddleware),
      );
    } else if (EnvChecker.isDev() || EnvChecker.isStage()) {
      this._store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(this.routerMiddleware, thunkMiddleware, ReduxNotifier, this.loggerMiddleware),
      );
    } else {
      this._store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(this.routerMiddleware, thunkMiddleware, ReduxNotifier),
      );
    }
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
    } else if (EnvChecker.isDev()) {
      this._history = createHashHistory();
    } else {
      this._history = createBrowserHistory();
    }
  }

  private setLoggerMiddleware() {
    this.loggerMiddleware = createLogger({
      stateTransformer: state => {
        const newState: any = {};
        for (const i of Object.keys(state)) {
          if ((Immutable as any).Iterable.isIterable(state[i])) {
            newState[i] = state[i].toJS();
          } else {
            newState[i] = state[i];
          }
        }
        return newState;
      },
    });
  }
}

const storeManager = new StoreManager();

export default storeManager;
