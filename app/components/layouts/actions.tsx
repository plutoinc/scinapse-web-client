import { ACTION_TYPES } from "../../actions/actionTypes";

export function setDeviceToDesktop() {
  return {
    type: ACTION_TYPES.SET_DEVICE_TO_DESKTOP,
  };
}

export function setDeviceToMobile() {
  return {
    type: ACTION_TYPES.SET_DEVICE_TO_MOBILE,
  };
}

export function setDeviceToTablet() {
  return {
    type: ACTION_TYPES.SET_DEVICE_TO_TABLET,
  };
}
