import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
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
