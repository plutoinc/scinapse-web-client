import { ACTION_TYPES } from "../../actions/actionTypes";

export function reachScrollTop() {
  return {
    type: ACTION_TYPES.HEADER_REACH_SCROLL_TOP,
  };
}

export function leaveScrollTop() {
  return {
    type: ACTION_TYPES.HEADER_LEAVE_SCROLL_TOP,
  };
}

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
