import PlutoAxios from "../pluto";
import { IArticle, recordifyArticle, IArticleRecord, initialArticle } from "../../model/article";
import { CancelTokenSource } from "axios";
import { ISubmitEvaluationParams } from "../../components/articleShow/actions";
import { IEvaluationRecord, initialEvaluation, IEvaluation, recordifyEvaluation } from "../../model/evaluation";

class ArticleAPI extends PlutoAxios {
  public async getArticle(articleId: number, _cancelTokenSource: CancelTokenSource): Promise<IArticleRecord> {
    if (articleId === 0) {
      throw new Error("FAKE ERROR");
    } else {
      const mockArticleRawData: IArticle = initialArticle;

      return recordifyArticle(mockArticleRawData);
    }
  }

  public async postEvaluation(params: ISubmitEvaluationParams): Promise<IEvaluationRecord> {
    if (params.articleId === 0) {
      throw new Error("FAKE ERROR");
    } else {
      const mockArticleRawData: IEvaluation = initialEvaluation;

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
