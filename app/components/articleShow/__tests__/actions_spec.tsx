jest.unmock("../actions");
jest.mock("../../../api/article");
jest.mock("../../../helpers/makePlutoToastAction", () => {
  return { default: () => {} };
});

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import axios from "axios";
import { initialArticle, recordifyArticle } from "../../../model/article";
import { ARTICLE_REVIEW_STEP } from "../records";
import { recordifyReview, initialReview } from "../../../model/review";
import { ISubmitReviewParams, IPostCommentParams } from "../../../api/article";

describe("ArticleShow state actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("getArticle action", () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    it("should return first action as ARTICLE_SHOW_START_TO_GET_ARTICLE action", async () => {
      const mockArticleId = 20;

      await store.dispatch(Actions.getArticle(mockArticleId, source));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_ARTICLE,
      });
    });

    it("should return ARTICLE_SHOW_SUCCEEDED_TO_GET_ARTICLE action with valid articleId", async () => {
      const mockArticleId = 20;
      await store.dispatch(Actions.getArticle(mockArticleId, source));
      const actions = store.getActions();

      expect(actions[1].payload.article.toJS()).toEqual(recordifyArticle(initialArticle).toJS());
      expect(actions[1].type).toEqual(ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_GET_ARTICLE);
    });

    it("should return ARTICLE_SHOW_FAILED_TO_GET_ARTICLE action with inValid articleId", async () => {
      const mockArticleId = 0;

      await store.dispatch(Actions.getArticle(mockArticleId, source));
      const actions = store.getActions();

      expect(actions[1]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_GET_ARTICLE,
      });
    });
  });

  describe("changeReviewStep action", () => {
    it("should return ARTICLE_SHOW_CHANGE_REVIEW_STEP action", () => {
      const mockStep: ARTICLE_REVIEW_STEP = ARTICLE_REVIEW_STEP.FIRST;
      store.dispatch(Actions.changeReviewStep(mockStep));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_REVIEW_STEP,
        payload: {
          step: mockStep,
        },
      });
    });
  });

  describe("changeReviewScore action", () => {
    it("should return ARTICLE_SHOW_CHANGE_REVIEW_SCORE action", () => {
      const mockStep: ARTICLE_REVIEW_STEP = ARTICLE_REVIEW_STEP.FIRST;
      const mockScore: number = 30;
      store.dispatch(Actions.changeReviewScore(mockStep, mockScore));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_REVIEW_SCORE,
        payload: {
          step: mockStep,
          score: mockScore,
        },
      });
    });
  });

  describe("submitReview action", () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    it("should return first action as ARTICLE_SHOW_START_TO_SUBMIT_REVIEW action", async () => {
      const submitReviewParams: ISubmitReviewParams = {
        articleId: 32,
        originalityScore: 7,
        significanceScore: 9,
        validityScore: 3,
        organizationScore: 23,
        review: "test",
        cancelTokenSource: source,
      };

      await store.dispatch(Actions.submitReview(submitReviewParams));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_START_TO_SUBMIT_REVIEW,
      });
    });

    it("should return ARTICLE_SHOW_SUCCEEDED_TO_GET_ARTICLE action with valid articleId", async () => {
      const submitReviewParams: ISubmitReviewParams = {
        articleId: 32,
        originalityScore: 7,
        significanceScore: 9,
        validityScore: 3,
        organizationScore: 23,
        review: "test",
        cancelTokenSource: source,
      };
      await store.dispatch(Actions.submitReview(submitReviewParams));
      const actions = store.getActions();

      expect(actions[1].payload.review.toJS()).toEqual(recordifyReview(initialReview).toJS());
      expect(actions[1].type).toEqual(ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_REVIEW);
    });

    it("should return ARTICLE_SHOW_FAILED_TO_GET_ARTICLE action with inValid articleId", async () => {
      const submitReviewParams: ISubmitReviewParams = {
        articleId: 0,
        originalityScore: 7,
        significanceScore: 9,
        validityScore: 3,
        organizationScore: 23,
        review: "test",
        cancelTokenSource: source,
      };

      await store.dispatch(Actions.submitReview(submitReviewParams));
      const actions = store.getActions();

      expect(actions[1]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_SUBMIT_REVIEW,
      });
    });
  });

  describe("togglePeerReviewComponent action", () => {
    it("should return ARTICLE_SHOW_TOGGLE_PEER_REVIEW_COMPONENT action", () => {
      const mockPeerReviewId = 30;
      store.dispatch(Actions.togglePeerReviewComponent(mockPeerReviewId));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_REVIEW_COMPONENT,
        payload: {
          peerReviewId: mockPeerReviewId,
        },
      });
    });
  });

  describe("handlePeerReviewCommentSubmit action", () => {
    it("should return first action as ARTICLE_SHOW_START_TO_PEER_REVIEW_COMMENT_SUBMIT action", async () => {
      const handlePeerReviewCommentSubmitParams: IPostCommentParams = {
        comment: "",
        articleId: 12,
        reviewId: 23,
      };

      await store.dispatch(Actions.handlePeerReviewCommentSubmit(handlePeerReviewCommentSubmitParams));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_START_TO_PEER_REVIEW_COMMENT_SUBMIT,
      });
    });
    // TODO: API Test after added
  });

  describe("votePeerReview action", () => {
    it("should return first action as ARTICLE_SHOW_START_TO_VOTE_PEER_REVIEW action", async () => {
      const mockArticleId = 20;
      const mockReviewId = 13;

      await store.dispatch(Actions.votePeerReview(mockArticleId, mockReviewId));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_START_TO_VOTE_PEER_REVIEW,
        payload: {
          articleId: mockArticleId,
          reviewId: mockReviewId,
        },
      });
    });

    it("should return ARTICLE_SHOW_SUCCEEDED_TO_VOTE_PEER_REVIEW action with valid articleId and reviewID", async () => {
      const mockArticleId = 20;
      const mockReviewId = 13;

      await store.dispatch(Actions.votePeerReview(mockArticleId, mockReviewId));
      const actions = store.getActions();

      expect(actions[1]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_VOTE_PEER_REVIEW,
      });
    });

    it("should return ARTICLE_SHOW_FAILED_TO_VOTE_PEER_REVIEW action with inValid articleId and reviewID", async () => {
      const mockArticleId = 0;
      const mockReviewId = 0;

      await store.dispatch(Actions.votePeerReview(mockArticleId, mockReviewId));
      const actions = store.getActions();

      expect(actions[1]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_VOTE_PEER_REVIEW,
        payload: {
          articleId: mockArticleId,
          reviewId: mockReviewId,
        },
      });
    });
  });
});
