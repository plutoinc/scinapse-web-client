import { ACTION_TYPES, getMessages } from "./actions";

export interface ILocaleState {
  lang: string;
  messages: Object;
}

export const LOCALE_INITIAL_STATE = {
  lang: "en",
  messages: getMessages("en"),
};

export function reducer(state = LOCALE_INITIAL_STATE, action: any) {
  // TODO: Change action type
  switch (action.type) {
    case ACTION_TYPES.CHANGE_LOCALE: {
      return { ...state, ...{ lang: action.payload.lang, messages: action.payload.messages } };
    }

    default:
      return state;
  }
}
