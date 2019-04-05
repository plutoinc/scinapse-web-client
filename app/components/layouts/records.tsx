export enum UserDevice {
  DESKTOP,
  TABLET,
  MOBILE,
}

export interface LayoutState
  extends Readonly<{
      userDevice: UserDevice;
    }> {}

export const LAYOUT_INITIAL_STATE: LayoutState = {
  userDevice: UserDevice.DESKTOP,
};
