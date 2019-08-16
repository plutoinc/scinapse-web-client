import { configureStore } from 'redux-starter-kit';
import { rootReducer, initialState } from '../reducers';

export default class ServerStoreManager {
  public static getStore() {
    return configureStore({
      reducer: rootReducer,
      devTools: false,
      preloadedState: initialState,
    });
  }
}
