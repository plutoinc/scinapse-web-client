import { List } from "immutable";
import { AxiosResponse } from "axios";
import PlutoAxios from "./pluto";
import { IArticleRecord, recordifyArticle, IArticle } from "../model/article";
import { ISubmitEvaluationParams } from "../components/articleShow/actions";

class ArticleAPI extends PlutoAxios {
  public async getArticles(): Promise<List<IArticleRecord>> {
    const articlesResponse: AxiosResponse = await this.get("articles");
    const rawArticles: IArticle[] = articlesResponse.data;
    const recordifiedArticlesArray = rawArticles.map(article => {
      return recordifyArticle(article);
    });
    return List(recordifiedArticlesArray);
  }

  public async getArticle(articleId: number): Promise<IArticleRecord> {
    const rawArticle = await this.get(`articles/${articleId}`);

    return recordifyArticle(rawArticle.data);
  }

  public async postEvaluation(params: ISubmitEvaluationParams): Promise<void> {
    await this.post(`articles/${params.articleId}/evaluations`, {
      point: {
        analysis: params.analysisScore,
        contribution: params.contributionScore,
        expressiveness: params.expressivenessScore,
        originality: params.originalityScore,
        analysisComment: params.analysisComment,
        contributionComment: params.contributionComment,
        expressivenessComment: params.expressivenessComment,
        originalityComment: params.originalityComment,
      },
    });
  }
}

const apiHelper = new ArticleAPI();

export default apiHelper;
