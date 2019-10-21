import { createSlice, PayloadAction } from 'redux-starter-kit';

export const enum UserDevice {
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET',
  MOBILE = 'MOBILE',
}

export interface LayoutState {
  userDevice: UserDevice;
}

export const LAYOUT_INITIAL_STATE = { userDevice: UserDevice.DESKTOP };

type SetDeviceAction = PayloadAction<{ userDevice: UserDevice }>;

const layoutSlice = createSlice({
  name: 'layout',
  initialState: LAYOUT_INITIAL_STATE,
  reducers: {
    setDeviceType(state, action: SetDeviceAction) {
      if (state.userDevice === action.payload.userDevice) return state;
      return { ...state, userDevice: action.payload.userDevice };
    },
  },
});

export const { setDeviceType } = layoutSlice.actions;

export default layoutSlice.reducer;
