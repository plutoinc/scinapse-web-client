import { List } from "immutable";
import { AxiosResponse } from "axios";
import PlutoAxios from "./pluto";
import { IArticleRecord, recordifyArticle, IArticle } from "../model/article";
import { ISubmitEvaluationParams } from "../components/articleShow/actions";
import { IEvaluationRecord, recordifyEvaluation } from "../model/evaluation";
import { IAuthor } from "../model/author";
import { ARTICLE_CATEGORY } from "../components/articleCreate/records";

export interface IGetArticlesParams {
  size?: number;
  page?: number;
}

export interface ICreateArticleParams {
  articlePublishedAt?: string;
  articleUpdatedAt?: string;
  authors?: IAuthor[];
  link?: string;
  note?: string;
  source?: string;
  summary?: string;
  title: string;
  type: ARTICLE_CATEGORY;
}

interface IGetArticlesResult {
  articles: List<IArticleRecord>;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}

class ArticleAPI extends PlutoAxios {
  public async getArticles({ size = 10, page = 0 }: IGetArticlesParams): Promise<IGetArticlesResult> {
    const articlesResponse: AxiosResponse = await this.get("articles", {
      params: {
        size,
        page,
      },
    });
    const rawArticles: IArticle[] = articlesResponse.data.content;

    const recordifiedArticlesArray = rawArticles.map(article => {
      return recordifyArticle(article);
    });

    /* ***
    ******* PAGINATION RESPONSE FIELD INFORMATION *******
    **
    - content : array - Data of query
    - size : int - The number of the page
    - number : int - Current page number
    - sort : object - Sorting information
    - first : bool - True if the response page is the first page
    - last : bool - True if the response page is the last page
    - numberOfElements : int - The number of data of the current response page
    - totalPages : int - The number of the total page.
    - totalElements : int - The number of the total element.
    *** */

    return {
      articles: List(recordifiedArticlesArray),
      first: articlesResponse.data.first,
      last: articlesResponse.data.last,
      number: articlesResponse.data.number,
      numberOfElements: articlesResponse.data.numberOfElements,
      size: articlesResponse.data.size,
      sort: articlesResponse.data.sort,
      totalElements: articlesResponse.data.totalElements,
      totalPages: articlesResponse.data.totalPages,
    };
  }

  public async getArticle(articleId: number): Promise<IArticleRecord> {
    const rawArticle = await this.get(`articles/${articleId}`);

    return recordifyArticle(rawArticle.data);
  }

  public async postEvaluation(params: ISubmitEvaluationParams): Promise<IEvaluationRecord> {
    const evaluationResponse = await this.post(`articles/${params.articleId}/evaluations`, {
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

    const evaluationData = evaluationResponse.data;
    const recordifiedEvaluation = recordifyEvaluation(evaluationData);
    return recordifiedEvaluation;
  }

  public async createArticle(params: ICreateArticleParams): Promise<IArticleRecord> {
    const createdArticle = await this.post(`articles`, params);

    return createdArticle.data;
  }
}

const apiHelper = new ArticleAPI();

export default apiHelper;
