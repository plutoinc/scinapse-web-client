import { EmailSettingItemResponse, EmailSettingTypes } from '../../api/types/auth';

interface ReducerState {
  activeStatus: { [key in EmailSettingTypes]: boolean };
  updateStatus: {
    [key in EmailSettingTypes]: {
      isLoading: boolean;
      hasFailed: boolean;
    }
  };
  isLoading: boolean;
  succeedToFetch: boolean;
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

interface StartToUpdatingSettingsAction {
  type: 'START_TO_UPDATING_SETTING';
  payload: {
    emailSettingTypes: EmailSettingTypes;
  };
}

interface SuccessToUpdatingSettingsAction {
  type: 'SUCCEED_TO_UPDATING_SETTING';
  payload: {
    emailSettingTypes: EmailSettingTypes;
    nextStatus: boolean;
  };
}

interface FailedToUpdatingSettingsAction {
  type: 'FAILED_TO_UPDATING_SETTING';
  payload: {
    emailSettingTypes: EmailSettingTypes;
  };
}

type EmailSettingsActions =
  | ToggleAction
  | StartToFetchingSettingsAction
  | FailedToFetchingSettingsAction
  | SuccessToFetchingSettingsAction
  | StartToUpdatingSettingsAction
  | SuccessToUpdatingSettingsAction
  | FailedToUpdatingSettingsAction;

const initialUpdateStatus = {
  isLoading: false,
  hasFailed: false,
};

export const EmailSettingsInitialState: ReducerState = {
  isLoading: false,
  failedToFetch: false,
  succeedToFetch: false,
  activeStatus: {
    GLOBAL: false,
    COLLECTION_REMIND: false,
    FEATURE_INSTRUCTION: false,
    PAPER_RECOMMENDATION: false,
    REQUEST_CONFIRMATION: false,
  },
  updateStatus: {
    GLOBAL: initialUpdateStatus,
    COLLECTION_REMIND: initialUpdateStatus,
    FEATURE_INSTRUCTION: initialUpdateStatus,
    PAPER_RECOMMENDATION: initialUpdateStatus,
    REQUEST_CONFIRMATION: initialUpdateStatus,
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
        succeedToFecth: true,
        activeStatus: newActiveStatus,
      };

    case 'FAILED_TO_FETCHING_SETTINGS':
      return {
        ...state,
        isLoading: false,
        failedToFetch: true,
      };

    case 'START_TO_UPDATING_SETTING': {
      return {
        ...state,
        updateStatus: {
          ...state.updateStatus,
          [action.payload.emailSettingTypes]: {
            isLoading: true,
            hasFailed: false,
          },
        },
      };
    }

    case 'SUCCEED_TO_UPDATING_SETTING': {
      return {
        ...state,
        activeStatus: {
          ...state.activeStatus,
          [action.payload.emailSettingTypes]: action.payload.nextStatus,
        },
        updateStatus: {
          ...state.updateStatus,
          [action.payload.emailSettingTypes]: {
            isLoading: false,
            hasFailed: false,
          },
        },
      };
    }

    case 'FAILED_TO_UPDATING_SETTING': {
      return {
        ...state,
        updateStatus: {
          ...state.updateStatus,
          [action.payload.emailSettingTypes]: {
            isLoading: false,
            hasFailed: true,
          },
        },
      };
    }

    default:
      throw new Error();
  }
}
