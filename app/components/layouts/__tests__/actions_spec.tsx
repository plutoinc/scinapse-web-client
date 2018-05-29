jest.unmock("../actions");
jest.mock("../../../api/member");

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

  describe("getBookmarks action creator", () => {
    describe("when fetching is succeeded", () => {
      beforeEach(() => {
        store.dispatch(Actions.getBookmarks({ page: 0, size: 10 }));
        actions = store.getActions();
      });

      it("should return GLOBAL_START_TO_GET_BOOKMARK action", () => {
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.GLOBAL_START_TO_GET_BOOKMARK,
        });
      });

      it("should return GLOBAL_SUCCEEDED_TO_GET_BOOKMARK action", () => {
        expect(actions[1].type).toEqual(ACTION_TYPES.GLOBAL_SUCCEEDED_TO_GET_BOOKMARK);
      });

      it("should return bookmarkCount that represents total count", () => {
        expect(actions[1].payload.bookmarkCount).toEqual(1);
      });
    });
  });
});
