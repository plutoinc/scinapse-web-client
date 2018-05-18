import { TypedRecord, makeTypedFactory } from "typed-immutable-record";
import { ACTION_TYPES } from "../actions/actionTypes";

export interface Configuration {
  initialFetched: boolean;
  clientJSRendered: boolean;
}
export interface ConfigurationRecord extends TypedRecord<ConfigurationRecord>, Configuration {}

export const initialConfiguration: Configuration = {
  initialFetched: false,
  clientJSRendered: false,
};

export const ConfigurationFactory = makeTypedFactory<Configuration, ConfigurationRecord>(initialConfiguration);
export const CONFIGURATION_INITIAL_STATE = ConfigurationFactory();

export function reducer(state = CONFIGURATION_INITIAL_STATE, action: ReduxAction<any>): ConfigurationRecord {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_INITIAL_DATA_FETCHING: {
      return state.set("initialFetched", true);
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE: {
      return state.set("clientJSRendered", true);
    }

    default:
      return state;
  }
}
