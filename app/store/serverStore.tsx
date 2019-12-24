import { AxiosInstance } from 'axios';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { rootReducer, initialState } from '../reducers';

interface ThunkExtraArgument {
  axios: AxiosInstance;
}

export default class ServerStoreManager {
  public static getStore(extraArgument: ThunkExtraArgument) {
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
