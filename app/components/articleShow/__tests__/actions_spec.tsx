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
import { ARTICLE_EVALUATION_STEP } from "../records";
import { IHandlePeerEvaluationCommentSubmitParams } from "../actions";
import { recordifyReview, initialReview } from "../../../model/review";
import { ISubmitEvaluationParams } from "../../../api/article";

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

  describe("changeEvaluationStep action", () => {
    it("should return ARTICLE_SHOW_CHANGE_EVALUATION_STEP action", () => {
      const mockStep: ARTICLE_EVALUATION_STEP = ARTICLE_EVALUATION_STEP.FIRST;
      store.dispatch(Actions.changeEvaluationStep(mockStep));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_STEP,
        payload: {
          step: mockStep,
        },
      });
    });
  });

  describe("changeEvaluationScore action", () => {
    it("should return ARTICLE_SHOW_CHANGE_EVALUATION_SCORE action", () => {
      const mockStep: ARTICLE_EVALUATION_STEP = ARTICLE_EVALUATION_STEP.FIRST;
      const mockScore: number = 30;
      store.dispatch(Actions.changeEvaluationScore(mockStep, mockScore));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_SCORE,
        payload: {
          step: mockStep,
          score: mockScore,
        },
      });
    });
  });

  describe("submitEvaluation action", () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    it("should return first action as ARTICLE_SHOW_START_TO_SUBMIT_EVALUATION action", async () => {
      const submitEvaluationParams: ISubmitEvaluationParams = {
        articleId: 32,
        originalityScore: 7,
        significanceScore: 9,
        validityScore: 3,
        organizationScore: 23,
        review: "test",
        cancelTokenSource: source,
      };

      await store.dispatch(Actions.submitEvaluation(submitEvaluationParams));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_START_TO_SUBMIT_EVALUATION,
      });
    });

    it("should return ARTICLE_SHOW_SUCCEEDED_TO_GET_ARTICLE action with valid articleId", async () => {
      const submitEvaluationParams: ISubmitEvaluationParams = {
        articleId: 32,
        originalityScore: 7,
        significanceScore: 9,
        validityScore: 3,
        organizationScore: 23,
        review: "test",
        cancelTokenSource: source,
      };
      await store.dispatch(Actions.submitEvaluation(submitEvaluationParams));
      const actions = store.getActions();

      expect(actions[1].payload.evaluation.toJS()).toEqual(recordifyReview(initialReview).toJS());
      expect(actions[1].type).toEqual(ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION);
    });

    it("should return ARTICLE_SHOW_FAILED_TO_GET_ARTICLE action with inValid articleId", async () => {
      const submitEvaluationParams: ISubmitEvaluationParams = {
        articleId: 0,
        originalityScore: 7,
        significanceScore: 9,
        validityScore: 3,
        organizationScore: 23,
        review: "test",
        cancelTokenSource: source,
      };

      await store.dispatch(Actions.submitEvaluation(submitEvaluationParams));
      const actions = store.getActions();

      expect(actions[1]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_SUBMIT_EVALUATION,
      });
    });
  });

  describe("togglePeerEvaluationComponent action", () => {
    it("should return ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT action", () => {
      const mockPeerEvaluationId = 30;
      store.dispatch(Actions.togglePeerEvaluationComponent(mockPeerEvaluationId));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT,
        payload: {
          peerEvaluationId: mockPeerEvaluationId,
        },
      });
    });
  });

  describe("handlePeerEvaluationCommentSubmit action", () => {
    it("should return first action as ARTICLE_SHOW_START_TO_PEER_EVALUATION_COMMENT_SUBMIT action", async () => {
      const handlePeerEvaluationCommentSubmitParams: IHandlePeerEvaluationCommentSubmitParams = {
        comment: "",
        articleId: 12,
        evaluationId: 23,
      };

      await store.dispatch(Actions.handlePeerEvaluationCommentSubmit(handlePeerEvaluationCommentSubmitParams));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_START_TO_PEER_EVALUATION_COMMENT_SUBMIT,
      });
    });
    // TODO: API Test after added
  });

  describe("votePeerEvaluation action", () => {
    it("should return first action as ARTICLE_SHOW_START_TO_VOTE_PEER_EVALUATION action", async () => {
      const mockArticleId = 20;
      const mockEvaluationId = 13;

      await store.dispatch(Actions.votePeerEvaluation(mockArticleId, mockEvaluationId));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_START_TO_VOTE_PEER_EVALUATION,
        payload: {
          articleId: mockArticleId,
          evaluationId: mockEvaluationId,
        },
      });
    });

    it("should return ARTICLE_SHOW_SUCCEEDED_TO_VOTE_PEER_EVALUATION action with valid articleId and evaluationID", async () => {
      const mockArticleId = 20;
      const mockEvaluationId = 13;

      await store.dispatch(Actions.votePeerEvaluation(mockArticleId, mockEvaluationId));
      const actions = store.getActions();

      expect(actions[1]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_VOTE_PEER_EVALUATION,
      });
    });

    it("should return ARTICLE_SHOW_FAILED_TO_VOTE_PEER_EVALUATION action with inValid articleId and evaluationID", async () => {
      const mockArticleId = 0;
      const mockEvaluationId = 0;

      await store.dispatch(Actions.votePeerEvaluation(mockArticleId, mockEvaluationId));
      const actions = store.getActions();

      expect(actions[1]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_VOTE_PEER_EVALUATION,
        payload: {
          articleId: mockArticleId,
          evaluationId: mockEvaluationId,
        },
      });
    });
  });
});
