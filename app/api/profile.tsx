import { List } from "immutable";
import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { IArticle, recordifyArticle } from "../model/article";
import { recordifyMember, IMemberRecord } from "../model/member";
import { IEvaluation, recordifyEvaluation } from "../model/evaluation";

const GET_USER_ARTICLE_DEFAULT_SIZE = 10;
const GET_USER_EVALUATIONS_DEFAULT_SIZE = 10;

export interface IGetUserArticlesParams {
  userId: number;
  cancelTokenSource: CancelTokenSource;
  size?: number;
  page?: number;
}

export interface IGetEvaluationsParams {
  userId: number;
  cancelTokenSource: CancelTokenSource;
  size?: number;
  page?: number;
}

export interface IUpdateUserProfileParams {
  email: string;
  institution?: string;
  major?: string;
  name: string;
  profileImage?: string;
}

class ProfileAPI extends PlutoAxios {
  public async getUserProfile(userId: string) {
    const result = await this.get(`members/${userId}`);

    return result.data;
  }

  public async updateUserProfile(userId: string, params: IUpdateUserProfileParams): Promise<IMemberRecord> {
    const updatedMemberResponse = await this.put(`members/${userId}`, params);
    const updatedMemberData: IMemberRecord = recordifyMember(updatedMemberResponse.data);

    return updatedMemberData;
  }

  public async getUserArticles({
    userId,
    cancelTokenSource,
    size = GET_USER_ARTICLE_DEFAULT_SIZE,
    page = 0,
  }: IGetUserArticlesParams) {
    const articlesResponse: AxiosResponse = await this.get(`members/${userId}/articles`, {
      params: {
        size,
        page,
      },
      cancelToken: cancelTokenSource.token,
    });

    const rawArticles: IArticle[] = articlesResponse.data.content;

    const recordifiedArticlesArray = rawArticles.map(article => {
      return recordifyArticle(article);
    });

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

  public async getUserEvaluations({
    userId,
    cancelTokenSource,
    size = GET_USER_EVALUATIONS_DEFAULT_SIZE,
    page = 0,
  }: IGetUserArticlesParams) {
    const evaluationsResponse: AxiosResponse = await this.get(`members/${userId}/evaluations`, {
      params: {
        size,
        page,
      },
      cancelToken: cancelTokenSource.token,
    });

    const rawEvaluations: IEvaluation[] = evaluationsResponse.data.content;

    const recordifiedEvaluationArray = rawEvaluations.map(evaluation => {
      return recordifyEvaluation(evaluation);
    });

    return {
      evaluations: List(recordifiedEvaluationArray),
      first: evaluationsResponse.data.first,
      last: evaluationsResponse.data.last,
      number: evaluationsResponse.data.number,
      numberOfElements: evaluationsResponse.data.numberOfElements,
      size: evaluationsResponse.data.size,
      sort: evaluationsResponse.data.sort,
      totalElements: evaluationsResponse.data.totalElements,
      totalPages: evaluationsResponse.data.totalPages,
    };
  }
}

const apiHelper = new ProfileAPI();

export default apiHelper;
