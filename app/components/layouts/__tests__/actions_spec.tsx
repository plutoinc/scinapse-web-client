jest.unmock("../actions");
jest.mock("../../../api/member");

import * as React from "react";
import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";

describe("layout actions", () => {
  let store: any;
  let actions: any[];

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("Scroll Top Action", () => {
    it("should return HEADER_REACH_SCROLL_TOP action", () => {
      store.dispatch(Actions.reachScrollTop());
      actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.HEADER_REACH_SCROLL_TOP,
      });
    });

    it("should return HEADER_LEAVE_SCROLL_TOP action", () => {
      store.dispatch(Actions.leaveScrollTop());
      actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.HEADER_LEAVE_SCROLL_TOP,
      });
    });
  });

  describe("set device to desktop action", () => {
    it("should return SET_DEVICE_TO_DESKTOP action", () => {
      store.dispatch(Actions.setDeviceToDesktop());
      actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SET_DEVICE_TO_DESKTOP,
      });
    });
  });

  describe("set device to mobile action", () => {
    it("should return SET_DEVICE_TO_MOBILE action", () => {
      store.dispatch(Actions.setDeviceToMobile());
      actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SET_DEVICE_TO_MOBILE,
      });
    });
  });

  describe("setUserDropdownAnchorElement action", () => {
    it("should return GLOBAL_SET_USER_DROPDOWN_ANCHOR_ELEMENT action", () => {
      const mockElement: any = <span />;
      store.dispatch(Actions.setUserDropdownAnchorElement(mockElement));
      actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.GLOBAL_SET_USER_DROPDOWN_ANCHOR_ELEMENT,
        payload: {
          element: mockElement,
        },
      });
    });
  });

  describe("toggleUserDropdown action", () => {
    it("should return GLOBAL_TOGGLE_USER_DROPDOWN action", () => {
      store.dispatch(Actions.toggleUserDropdown());
      actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.GLOBAL_TOGGLE_USER_DROPDOWN,
      });
    });
  });

  describe("closeUserDropdown action", () => {
    it("should return GLOBAL_CLOSE_USER_DROPDOWN action", () => {
      store.dispatch(Actions.closeUserDropdown());
      actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.GLOBAL_CLOSE_USER_DROPDOWN,
      });
    });
  });

  describe("getBookmarks action creator", () => {
    describe("when fetching is succeeded", () => {
      beforeEach(() => {
        store.dispatch(Actions.getBookmarks());
        actions = store.getActions();
      });

      it("should return GLOBAL_START_TO_GET_BOOKMARK action", () => {
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.GLOBAL_START_TO_GET_BOOKMARK,
        });
      });

      it("should return GLOBAL_SUCCEEDED_TO_GET_BOOKMARK action", () => {
        expect(actions[1]).toEqual({
          type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_GET_BOOKMARK,
          payload: {
            bookmarkCount: 0,
          },
        });
      });
    });
  });
});
