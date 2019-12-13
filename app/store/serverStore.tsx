import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { rootReducer, initialState } from '../reducers';

export default class ServerStoreManager {
  public static getStore(extraArgument: object) {
    return configureStore({
      reducer: rootReducer,
      devTools: false,
      preloadedState: initialState,
      middleware: [
        ...getDefaultMiddleware({
          thunk: {
            extraArgument,
          },
        }),
      ],
    });
  }
}
