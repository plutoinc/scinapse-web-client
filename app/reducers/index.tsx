import * as Redux from "redux";
import { routerReducer } from "react-router-redux";
import * as LocaleReducer from "../components/connectedIntlProvider/reducer";

export interface IAppState {
  routing?: any;
  locale: LocaleReducer.ILocaleState;
}

export const initialState: IAppState = {
  locale: LocaleReducer.LOCALE_INITIAL_STATE,
};

export const rootReducer = Redux.combineReducers({
  locale: LocaleReducer.reducer,
  routing: routerReducer,
});
