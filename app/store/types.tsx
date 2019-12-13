import { AxiosInstance } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../reducers';

export type AppThunkAction = ThunkAction<void, AppState, { axios: AxiosInstance }, any>;
