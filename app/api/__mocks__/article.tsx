import PlutoAxios from "../pluto";
import { IArticle, recordifyArticle, IArticleRecord, initialArticle } from "../../model/article";
import { CancelTokenSource } from "axios";
import { IReviewRecord, initialEvaluation, IReview, recordifyEvaluation } from "../../model/review";
import { ISubmitEvaluationParams } from "../article";

class ArticleAPI extends PlutoAxios {
  public async getArticle(articleId: number, _cancelTokenSource: CancelTokenSource): Promise<IArticleRecord> {
    if (articleId === 0) {
      throw new Error("FAKE ERROR");
    } else {
      const mockArticleRawData: IArticle = initialArticle;

      return recordifyArticle(mockArticleRawData);
    }
  }

  public async postEvaluation(params: ISubmitEvaluationParams): Promise<IReviewRecord> {
    if (params.articleId === 0) {
      throw new Error("FAKE ERROR");
    } else {
      const mockArticleRawData: IReview = initialEvaluation;

      const recordifiedEvaluation = recordifyEvaluation(mockArticleRawData);
      return recordifiedEvaluation;
    }
  }

  public async voteEvaluation(articleId: number, evaluationId: number) {
    if (articleId === 0 || evaluationId === 0) {
      throw new Error("FAKE ERROR");
    } else {
      return;
    }
  }
}

const apiHelper = new ArticleAPI();

export default apiHelper;
