jest.unmock("../actions");
jest.mock("../../../api/profile");
jest.mock("../../../helpers/makePlutoToastAction", () => {
  return { default: () => {} };
});

import axios from "axios";
import { List } from "immutable";
import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { initialCurrentUser, ICurrentUserRecord, recordifyCurrentUser } from "../../../model/currentUser";
import { RECORD } from "../../../__mocks__";
import { IUpdateCurrentUserProfileParams } from "../actions";

describe("myPage actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("syncCurrentUserWithProfileUser action", () => {
    it("should return PROFILE_SYNC_CURRENT_USER_WITH_PROFILE_USER action with currentUser payload", () => {
      const mockCurrentUser: ICurrentUserRecord = recordifyCurrentUser(initialCurrentUser);

      store.dispatch(Actions.syncCurrentUserWithProfileUser(mockCurrentUser));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_SYNC_CURRENT_USER_WITH_PROFILE_USER,
        payload: {
          currentUser: mockCurrentUser,
        },
      });
    });
  });

  describe("getUserProfile action", () => {
    it("should return PROFILE_START_TO_GET_USER_PROFILE action with userId", () => {
      const mockUserId = "13";

      store.dispatch(Actions.getUserProfile(mockUserId));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_START_TO_GET_USER_PROFILE,
      });
      // TODO: Success Case & Fail Case
    });
  });

  describe("syncSettingInputWithCurrentUser action", () => {
    it("should return PROFILE_SYNC_SETTING_INPUT_WITH_CURRENT_USER action with profileImage and institution and major payload", () => {
      const mockProfileImage = "test.img";
      const mockInstitution = "Postech";
      const mockMajor = "CITE";

      store.dispatch(Actions.syncSettingInputWithCurrentUser(mockProfileImage, mockInstitution, mockMajor));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_SYNC_SETTING_INPUT_WITH_CURRENT_USER,
        payload: {
          profileImage: mockProfileImage,
          institution: mockInstitution,
          major: mockMajor,
        },
      });
    });
  });

  describe("changeProfileImageInput action", () => {
    it("should return MY_PAGE_CHANGE_PROFILE_IMAGE_INPUT action with profileImage", () => {
      const mockProfileImage = "test.img";

      store.dispatch(Actions.changeProfileImageInput(mockProfileImage));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_CHANGE_PROFILE_IMAGE_INPUT,
        payload: {
          profileImage: mockProfileImage,
        },
      });
    });
  });

  describe("changeInstitutionInput action", () => {
    it("should return MY_PAGE_CHANGE_INSTITUTION_INPUT action with institution", () => {
      const mockInstitution = "Postech";

      store.dispatch(Actions.changeInstitutionInput(mockInstitution));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_CHANGE_INSTITUTION_INPUT,
        payload: {
          institution: mockInstitution,
        },
      });
    });
  });

  describe("changeMajorInput action", () => {
    it("should return MY_PAGE_CHANGE_MAJOR_INPUT action with major", () => {
      const mockMajor = "CITE";

      store.dispatch(Actions.changeMajorInput(mockMajor));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_CHANGE_MAJOR_INPUT,
        payload: {
          major: mockMajor,
        },
      });
    });
  });

  describe("getUserArticles action", () => {
    it("should dispatch PROFILE_START_TO_FETCH_USER_ARTICLES action", async () => {
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      await store.dispatch(
        Actions.getUserArticles({
          userId: 10,
          cancelTokenSource: source,
        }),
      );

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_START_TO_FETCH_USER_ARTICLES,
      });
    });

    describe("when it's succeeded", () => {
      beforeEach(async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        await store.dispatch(
          Actions.getUserArticles({
            userId: 10,
            cancelTokenSource: source,
          }),
        );
      });

      it("should dispatch PROFILE_SUCCEEDED_FETCH_USER_ARTICLES", async () => {
        const actions = await store.getActions();

        expect(actions[1]).toEqual({
          type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_FETCH_USER_ARTICLES,
          payload: {
            articles: List([RECORD.ARTICLE, RECORD.ARTICLE, RECORD.ARTICLE]),
            nextPage: 1,
            isEnd: false,
          },
        });
      });
    });

    describe("when it's failed", () => {
      beforeEach(async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        await store.dispatch(
          Actions.getUserArticles({
            userId: 0,
            cancelTokenSource: source,
          }),
        );
      });

      it("should dispatch PROFILE_FAILED_FETCH_USER_ARTICLES", async () => {
        const actions = await store.getActions();

        expect(actions[1]).toEqual({
          type: ACTION_TYPES.PROFILE_FAILED_TO_FETCH_USER_ARTICLES,
        });
      });
    });
  });

  describe("updateCurrentUserProfile action", () => {
    it("should first dispatch PROFILE_START_TO_UPDATE_USER_PROFILE action", async () => {
      const updatedParams: IUpdateCurrentUserProfileParams = {
        currentUserRecord: recordifyCurrentUser(initialCurrentUser),
        profileImage: "https://www.naver.com",
        institution: "postech",
        major: "major",
      };

      await store.dispatch(Actions.updateCurrentUserProfile(updatedParams));

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_START_TO_UPDATE_USER_PROFILE,
      });
    });

    describe("when it's succeeded", () => {
      beforeEach(async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        await store.dispatch(
          Actions.getUserArticles({
            userId: 10,
            cancelTokenSource: source,
          }),
        );
      });

      it("should dispatch PROFILE_SUCCEEDED_FETCH_USER_ARTICLES", async () => {
        const actions = await store.getActions();

        expect(actions[1]).toEqual({
          type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_FETCH_USER_ARTICLES,
          payload: {
            articles: List([RECORD.ARTICLE, RECORD.ARTICLE, RECORD.ARTICLE]),
            nextPage: 1,
            isEnd: false,
          },
        });
      });
    });

    describe("when it's failed", () => {
      beforeEach(async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        await store.dispatch(
          Actions.getUserArticles({
            userId: 0,
            cancelTokenSource: source,
          }),
        );
      });

      it("should dispatch PROFILE_FAILED_FETCH_USER_ARTICLES", async () => {
        const actions = await store.getActions();

        expect(actions[1]).toEqual({
          type: ACTION_TYPES.PROFILE_FAILED_TO_FETCH_USER_ARTICLES,
        });
      });
    });
  });

  describe("clearEvaluationIdsToShow action", () => {
    it("should return PROFILE_CLEAR_EVALUATIONS_TO_SHOW action", () => {
      store.dispatch(Actions.clearEvaluationIdsToShow());
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_CLEAR_REVIEWS_TO_SHOW,
      });
    });
  });

  describe("fetchEvaluations action", () => {
    describe("when it's succeed", () => {
      beforeEach(async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        await store.dispatch(
          Actions.fetchEvaluations({
            userId: 5,
            cancelTokenSource: source,
          }),
        );
      });

      it("should dispatch PROFILE_START_TO_FETCH_USER_EVALUATIONS", () => {
        const actions = store.getActions();

        expect(actions[0]).toEqual({
          type: ACTION_TYPES.PROFILE_START_TO_FETCH_USER_REVIEWS,
        });
      });

      it("should dispatch PROFILE_SUCCEEDED_TO_FETCH_USER_EVALUATIONS with proper payload", () => {
        const actions = store.getActions();

        expect(actions[1]).toEqual({
          type: ACTION_TYPES.SUCCEEDED_TO_FETCH_REVIEWS,
          payload: {
            evaluations: List([RECORD.REVIEW, RECORD.REVIEW, RECORD.REVIEW]),
            nextPage: 1,
            isEnd: false,
          },
        });
      });
    });

    describe("when it's failed", () => {
      beforeEach(async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        await store.dispatch(
          Actions.fetchEvaluations({
            userId: 0,
            cancelTokenSource: source,
          }),
        );
      });

      it("should dispatch PROFILE_START_TO_FETCH_USER_EVALUATIONS", () => {
        const actions = store.getActions();

        expect(actions[0]).toEqual({
          type: ACTION_TYPES.PROFILE_START_TO_FETCH_USER_REVIEWS,
        });
      });

      it("should dispatch PROFILE_FAILED_TO_FETCH_USER_EVALUATIONS", () => {
        const actions = store.getActions();

        expect(actions[1]).toEqual({
          type: ACTION_TYPES.PROFILE_FAILED_TO_FETCH_USER_REVIEWS,
        });
      });
    });
  });
});
