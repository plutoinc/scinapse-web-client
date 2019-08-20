import { createSlice, PayloadAction } from 'redux-starter-kit';

export enum UserDevice {
  DESKTOP,
  TABLET,
  MOBILE,
}

export interface LayoutState {
  userDevice: UserDevice;
}

export const LAYOUT_INITIAL_STATE = { userDevice: UserDevice.DESKTOP };

type SetDeviceAction = PayloadAction<{ userDevice: UserDevice }>;

const layoutSlice = createSlice({
  slice: 'layout',
  initialState: LAYOUT_INITIAL_STATE,
  reducers: {
    setDeviceType(state, action: SetDeviceAction) {
      state.userDevice = action.payload.userDevice;
    },
  },
});

export const { setDeviceType } = layoutSlice.actions;

export default layoutSlice.reducer;
