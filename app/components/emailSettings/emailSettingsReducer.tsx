import { EmailSettingItemResponse, EmailSettingTypes } from '../../api/types/auth';

interface ReducerState {
  activeStatus: { [key in EmailSettingTypes]: boolean };
  isLoading: boolean;
  failedToFetch: boolean;
}

interface ToggleAction {
  type: 'TOGGLE_ITEM';
  payload: {
    type: EmailSettingTypes;
  };
}

interface StartToFetchingSettingsAction {
  type: 'START_TO_FETCHING_SETTINGS';
}

interface SuccessToFetchingSettingsAction {
  type: 'SUCCEED_TO_FETCHING_SETTINGS';
  payload: {
    settings: EmailSettingItemResponse[];
  };
}

interface FailedToFetchingSettingsAction {
  type: 'FAILED_TO_FETCHING_SETTINGS';
}

type EmailSettingsActions =
  | ToggleAction
  | StartToFetchingSettingsAction
  | FailedToFetchingSettingsAction
  | SuccessToFetchingSettingsAction;

export const EmailSettingsInitialState: ReducerState = {
  isLoading: false,
  failedToFetch: false,
  activeStatus: {
    GLOBAL: false,
    COLLECTION_REMIND: false,
    FEATURE_INSTRUCTION: false,
    PAPER_RECOMMENDATION: false,
    REQUEST_CONFIRMATION: false,
  },
};

export default function reducer(state: ReducerState, action: EmailSettingsActions) {
  switch (action.type) {
    case 'TOGGLE_ITEM':
      return {
        ...state,
      };

    case 'START_TO_FETCHING_SETTINGS':
      return {
        ...state,
        failedToFetch: false,
        isLoading: true,
      };

    case 'SUCCEED_TO_FETCHING_SETTINGS':
      const newActiveStatus = { ...state.activeStatus };
      action.payload.settings.forEach(setting => {
        newActiveStatus[setting.type] = setting.setting === 'ON';
      });

      return {
        ...state,
        isLoading: false,
        activeStatus: newActiveStatus,
      };

    case 'FAILED_TO_FETCHING_SETTINGS':
      return {
        ...state,
        isLoading: false,
        failedToFetch: true,
      };

    default:
      throw new Error();
  }
}
