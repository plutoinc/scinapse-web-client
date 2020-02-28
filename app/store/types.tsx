import { AxiosInstance } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../reducers';

export type AppThunkAction<R = void> = ThunkAction<R, AppState, { axios: AxiosInstance }, any>;
