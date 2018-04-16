jest.unmock("../reducer");
jest.unmock("../records");

import * as React from "react";
import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { LayoutStateRecord, LAYOUT_INITIAL_STATE } from "../records";

function reduceState(action: any, state: LayoutStateRecord = LAYOUT_INITIAL_STATE) {
  return reducer(state, action);
}

describe("Layout reducer", () => {
  let mockAction: any;
  let mockState: LayoutStateRecord;
  let state: LayoutStateRecord;

  describe("when it receive HEADER_REACH_SCROLL_TOP", () => {
    it("should isTop be true", () => {
      mockState = LAYOUT_INITIAL_STATE.set("isTop", false);
      mockAction = {
        type: ACTION_TYPES.HEADER_REACH_SCROLL_TOP,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isTop).toBeTruthy();
    });
  });

  describe("when receive HEADER_LEAVE_SCROLL_TOP", () => {
    it("should isTop be Falsy", () => {
      mockState = LAYOUT_INITIAL_STATE.set("isTop", true);

      mockAction = {
        type: ACTION_TYPES.HEADER_LEAVE_SCROLL_TOP,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isTop).toBeFalsy();
    });
  });

  describe("when receive SET_DEVICE_TO_DESKTOP", () => {
    it("should set state to state", () => {
      mockState = LAYOUT_INITIAL_STATE.set("isMobile", true);
      mockAction = {
        type: ACTION_TYPES.SET_DEVICE_TO_DESKTOP,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isMobile).toBeFalsy();
    });
  });

  describe("when receive SET_DEVICE_TO_MOBILE", () => {
    it("should set state to state", () => {
      mockState = LAYOUT_INITIAL_STATE.set("isMobile", false);
      mockAction = {
        type: ACTION_TYPES.SET_DEVICE_TO_MOBILE,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isMobile).toBeTruthy();
    });
  });

  describe("when receive GLOBAL_SET_USER_DROPDOWN_ANCHOR_ELEMENT", () => {
    it("should set userDropdownAnchorElement state to the payload's value", () => {
      const mockElement: any = <span />;
      mockAction = {
        type: ACTION_TYPES.GLOBAL_SET_USER_DROPDOWN_ANCHOR_ELEMENT,
        payload: {
          element: mockElement,
        },
      };

      state = reduceState(mockAction, mockState);

      expect(state.userDropdownAnchorElement).toEqual(mockElement);
    });
  });

  describe("when receive GLOBAL_TOGGLE_USER_DROPDOWN", () => {
    it("should set isUserDropdownOpen state to the opposite value of the current state", () => {
      mockAction = {
        type: ACTION_TYPES.GLOBAL_TOGGLE_USER_DROPDOWN,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isUserDropdownOpen).toBeTruthy();
    });
  });

  describe("when receive GLOBAL_CLOSE_USER_DROPDOWN", () => {
    it("should set isUserDropdownOpen state to false", () => {
      mockState = LAYOUT_INITIAL_STATE.set("isUserDropdownOpen", true);

      mockAction = {
        type: ACTION_TYPES.GLOBAL_CLOSE_USER_DROPDOWN,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isUserDropdownOpen).toBeFalsy();
    });
  });

  describe("when receive GLOBAL_START_TO_GET_BOOKMARK", () => {
    beforeEach(() => {
      mockState = LAYOUT_INITIAL_STATE.set("hasErrorOnFetchingBookmark", true);

      mockAction = {
        type: ACTION_TYPES.GLOBAL_START_TO_GET_BOOKMARK,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isBookmarkLoading state to true", () => {
      expect(state.isBookmarkLoading).toBeTruthy();
    });

    it("should set hasErrorOnFetchingBookmark state to false", () => {
      expect(state.hasErrorOnFetchingBookmark).toBeFalsy();
    });
  });

  describe("when receive GLOBAL_SUCCEEDED_TO_GET_BOOKMARK", () => {
    beforeEach(() => {
      mockState = LAYOUT_INITIAL_STATE.set("isBookmarkLoading", true);

      mockAction = {
        type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_GET_BOOKMARK,
        payload: {
          bookmarkCount: 5,
        },
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isBookmarkLoading state to false", () => {
      expect(state.isBookmarkLoading).toBeFalsy();
    });
  });

  describe("when receive GLOBAL_FAILED_TO_GET_BOOKMARK", () => {
    beforeEach(() => {
      mockState = LAYOUT_INITIAL_STATE.set("isBookmarkLoading", true);

      mockAction = {
        type: ACTION_TYPES.GLOBAL_FAILED_TO_GET_BOOKMARK,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isBookmarkLoading state to false", () => {
      expect(state.isBookmarkLoading).toBeFalsy();
    });

    it("should set hasErrorOnFetchingBookmark state to true", () => {
      expect(state.hasErrorOnFetchingBookmark).toBeTruthy();
    });
  });

  describe("when receive GLOBAL_SUCCEEDED_POST_BOOKMARK", () => {
    beforeEach(() => {
      mockState = LAYOUT_INITIAL_STATE.set("bookmarkCount", 1);

      mockAction = {
        type: ACTION_TYPES.GLOBAL_SUCCEEDED_POST_BOOKMARK,
      };

      state = reduceState(mockAction, mockState);
    });
  });
});
