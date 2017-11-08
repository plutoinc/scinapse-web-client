import PlutoAxios from "../pluto";
import { IArticle, recordifyArticle, IArticleRecord, initialArticle } from "../../model/article";
import { CancelTokenSource } from "axios";
import { IReviewRecord, initialReview, IReview, recordifyReview } from "../../model/review";
import { ISubmitReviewParams } from "../article";

class ArticleAPI extends PlutoAxios {
  public async getArticle(articleId: number, _cancelTokenSource: CancelTokenSource): Promise<IArticleRecord> {
    if (articleId === 0) {
      throw new Error("FAKE ERROR");
    } else {
      const mockArticleRawData: IArticle = initialArticle;

      return recordifyArticle(mockArticleRawData);
    }
  }

  public async postReview(params: ISubmitReviewParams): Promise<IReviewRecord> {
    if (params.articleId === 0) {
      throw new Error("FAKE ERROR");
    } else {
      const mockArticleRawData: IReview = initialReview;

      const recordifiedReview = recordifyReview(mockArticleRawData);
      return recordifiedReview;
    }
  }

  public async voteReview(articleId: number, reviewId: number) {
    if (articleId === 0 || reviewId === 0) {
      throw new Error("FAKE ERROR");
    } else {
      return;
    }
  }
}

const apiHelper = new ArticleAPI();

export default apiHelper;
