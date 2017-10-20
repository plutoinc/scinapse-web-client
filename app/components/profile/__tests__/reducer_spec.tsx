jest.unmock("../reducer");
jest.unmock("../records");

import { List } from "immutable";
import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { IProfileStateRecord, PROFILE_INITIAL_STATE } from "../records";
import { ICurrentUserRecord, recordifyCurrentUser, initialCurrentUser } from "../../../model/currentUser";
import { RECORD } from "../../../__mocks__";

function reduceState(action: any, state: IProfileStateRecord = PROFILE_INITIAL_STATE) {
  return reducer(state, action);
}

describe("MyPage reducer", () => {
  let mockAction: any;
  let state: IProfileStateRecord;
  let mockState: IProfileStateRecord;

  describe("when receive PROFILE_START_TO_GET_USER_PROFILE", () => {
    it("should set isLoading to true", () => {
      mockAction = {
        type: ACTION_TYPES.PROFILE_START_TO_GET_USER_PROFILE,
      };

      state = reduceState(mockAction);

      expect(state.isLoading).toBeTruthy();
    });
  });

  describe("when receive PROFILE_SUCCEEDED_TO_GET_USER_PROFILE", () => {
    it("should set isLoading to false & set userProfile following userProfile payload", () => {
      const mockUserProfile: ICurrentUserRecord = recordifyCurrentUser({
        isLoggedIn: true,
        email: "test.com",
        name: "test",
        id: 123,
        reputation: null,
        profileImage: null,
        institution: null,
        major: null,
        wallet: null,
      });

      mockAction = {
        type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_GET_USER_PROFILE,
        payload: {
          userProfile: mockUserProfile,
        },
      };

      state = reduceState(mockAction);

      expect(state.userProfile).toEqual(mockUserProfile);
    });
  });

  describe("when receive PROFILE_FAILED_TO_GET_USER_PROFILE", () => {
    it("should set isLoading to false & hasError to true", () => {
      mockAction = {
        type: ACTION_TYPES.PROFILE_FAILED_TO_GET_USER_PROFILE,
      };

      state = reduceState(mockAction);

      expect(state.isLoading).toBeFalsy();
      expect(state.hasError).toBeTruthy();
    });
  });

  describe("when receive PROFILE_SYNC_CURRENT_USER_WITH_PROFILE_USER", () => {
    it("should set userProfile to following currentUser payload", () => {
      const mockCurrentUser: ICurrentUserRecord = recordifyCurrentUser({
        isLoggedIn: true,
        email: "test.com",
        name: "test",
        id: 123,
        reputation: null,
        profileImage: null,
        institution: null,
        major: null,
        wallet: null,
      });

      mockAction = {
        type: ACTION_TYPES.PROFILE_SYNC_CURRENT_USER_WITH_PROFILE_USER,
        payload: {
          currentUser: mockCurrentUser,
        },
      };

      state = reduceState(mockAction);

      expect(state.userProfile).toEqual(mockCurrentUser);
    });
  });

  describe("when receive PROFILE_SYNC_SETTING_INPUT_WITH_CURRENT_USER", () => {
    it("should set profileImage, institution, major input to following profileImage, institution, major input payload", () => {
      const mockProfileImage = "test.com";
      const mockInstitution = "postech";
      const mockMajor = "CITE";

      mockAction = {
        type: ACTION_TYPES.PROFILE_SYNC_SETTING_INPUT_WITH_CURRENT_USER,
        payload: {
          profileImage: mockProfileImage,
          institution: mockInstitution,
          major: mockMajor,
        },
      };

      state = reduceState(mockAction);

      expect(state.profileImageInput).toEqual(mockProfileImage);
      expect(state.institutionInput).toEqual(mockInstitution);
      expect(state.majorInput).toEqual(mockMajor);
    });
  });

  describe("when receive MY_PAGE_CHANGE_PROFILE_IMAGE_INPUT", () => {
    it("should set category following profileImage payload", () => {
      const mockProfileImage = "test.img";

      mockAction = {
        type: ACTION_TYPES.PROFILE_CHANGE_PROFILE_IMAGE_INPUT,
        payload: {
          profileImage: mockProfileImage,
        },
      };

      state = reduceState(mockAction);

      expect(state.profileImageInput).toEqual(mockProfileImage);
    });
  });

  describe("when receive MY_PAGE_CHANGE_INSTITUTION_INPUT", () => {
    it("should set category following institution payload", () => {
      const mockInstitution = "postech";

      mockAction = {
        type: ACTION_TYPES.PROFILE_CHANGE_INSTITUTION_INPUT,
        payload: {
          institution: mockInstitution,
        },
      };

      state = reduceState(mockAction);

      expect(state.institutionInput).toEqual(mockInstitution);
    });
  });

  describe("when receive MY_PAGE_CHANGE_MAJOR_INPUT", () => {
    it("should set category following major payload", () => {
      const mockMajor = "Postech";

      mockAction = {
        type: ACTION_TYPES.PROFILE_CHANGE_MAJOR_INPUT,
        payload: {
          major: mockMajor,
        },
      };

      state = reduceState(mockAction);

      expect(state.majorInput).toEqual(mockMajor);
    });
  });

  describe("when receive PROFILE_START_TO_FETCH_USER_ARTICLES", () => {
    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("fetchingContentError", true);
      mockAction = {
        type: ACTION_TYPES.PROFILE_START_TO_FETCH_USER_ARTICLES,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set fetchingContentLoading to true", () => {
      expect(state.fetchingContentLoading).toBeTruthy();
    });

    it("should set fetchingContentError to false", () => {
      expect(state.fetchingContentError).toBeFalsy();
    });
  });

  describe("when receive PROFILE_START_TO_FETCH_USER_EVALUATIONS", () => {
    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("fetchingContentError", true);
      mockAction = {
        type: ACTION_TYPES.PROFILE_START_TO_FETCH_USER_EVALUATIONS,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set fetchingContentLoading to true", () => {
      expect(state.fetchingContentLoading).toBeTruthy();
    });

    it("should set fetchingContentError to false", () => {
      expect(state.fetchingContentError).toBeFalsy();
    });
  });

  describe("when receive PROFILE_FAILED_FETCH_USER_ARTICLES", () => {
    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("fetchingContentLoading", true);
      mockAction = {
        type: ACTION_TYPES.PROFILE_FAILED_TO_FETCH_USER_ARTICLES,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set fetchingContentLoading to false", () => {
      expect(state.fetchingContentLoading).toBeFalsy();
    });

    it("should set fetchingContentError to true", () => {
      expect(state.fetchingContentError).toBeTruthy();
    });
  });

  describe("when receive PROFILE_FAILED_TO_FETCH_USER_EVALUATIONS", () => {
    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("fetchingContentLoading", true);
      mockAction = {
        type: ACTION_TYPES.PROFILE_FAILED_TO_FETCH_USER_EVALUATIONS,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set fetchingContentLoading to false", () => {
      expect(state.fetchingContentLoading).toBeFalsy();
    });

    it("should set fetchingContentError to true", () => {
      expect(state.fetchingContentError).toBeTruthy();
    });
  });

  describe("when receive PROFILE_SUCCEEDED_FETCH_USER_ARTICLES", () => {
    const mockArticles = List([RECORD.ARTICLE]);

    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("fetchingContentLoading", true).set("fetchingContentError", true);
      mockAction = {
        type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_FETCH_USER_ARTICLES,
        payload: {
          isEnd: true,
          nextPage: 1,
          articles: mockArticles,
        },
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set fetchingContentLoading to false", () => {
      expect(state.fetchingContentLoading).toBeFalsy();
    });

    it("should set fetchingContentError to true", () => {
      expect(state.fetchingContentError).toBeFalsy();
    });

    it("should set isEnd to payload's value", () => {
      expect(state.isEnd).toBeTruthy();
    });

    it("should set page to payload's value", () => {
      expect(state.page).toEqual(1);
    });

    it("should set articlesToShow to payload's value", () => {
      expect(state.articlesToShow).toEqual(mockArticles);
    });
  });

  describe("when receive PROFILE_START_TO_UPDATE_USER_PROFILE", () => {
    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("hasError", true);
      mockAction = {
        type: ACTION_TYPES.PROFILE_START_TO_UPDATE_USER_PROFILE,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isLoading to true", () => {
      expect(state.isLoading).toBeTruthy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });
  });

  describe("when receive PROFILE_SUCCEEDED_TO_UPDATE_USER_PROFILE", () => {
    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("isLoading", true);
      const testUserProfile = initialCurrentUser;
      mockAction = {
        type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_UPDATE_USER_PROFILE,
        payload: {
          userProfile: testUserProfile,
        },
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set userProfile to be recordified userProfile payload", () => {
      const testUserProfile = initialCurrentUser;
      const updatedUserProfile = recordifyCurrentUser(testUserProfile).set("isLoggedIn", true);

      expect(state.userProfile.toJS()).toEqual(updatedUserProfile.toJS());
    });
  });

  describe("when receive PROFILE_FAILED_TO_UPDATE_USER_PROFILE", () => {
    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("isLoading", true);
      mockAction = {
        type: ACTION_TYPES.PROFILE_FAILED_TO_UPDATE_USER_PROFILE,
      };
    });
  });

  describe("when receive PROFILE_SUCCEEDED_TO_FETCH_USER_EVALUATIONS", () => {
    describe("when payload's evaluations is empty", () => {
      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_FETCH_USER_EVALUATIONS,
          payload: {
            evaluations: List(),
          },
        };

        state = reduceState(mockAction);
      });

      it("should return state's evaluationIdsToShow", () => {
        expect(state.evaluationIdsToShow).toEqual(List());
      });
    });

    describe("when payload's evaluations isn't empty", () => {
      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.PROFILE_SUCCEEDED_TO_FETCH_USER_EVALUATIONS,
          payload: {
            evaluations: List([RECORD.EVALUATION]),
          },
        };

        state = reduceState(mockAction);
      });

      it("should set state's evaluationIdsToShow to payload's evaluations ids", () => {
        expect(state.evaluationIdsToShow.get(0)).toEqual(50); // 50 means mock evaluation's id value
      });
    });
  });

  describe("when receive PROFILE_CLEAR_EVALUATIONS_TO_SHOW action", () => {
    beforeEach(() => {
      mockState = PROFILE_INITIAL_STATE.set("evaluationIdsToShow", List([RECORD.EVALUATION]));
      mockAction = {
        type: ACTION_TYPES.PROFILE_CLEAR_EVALUATIONS_TO_SHOW,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to true", () => {
      expect(state.hasError).toBeTruthy();
    });

    it("should set evaluationIdsToShow to empty List", () => {
      expect(state.evaluationIdsToShow).toEqual(List());
    });
  });
});
