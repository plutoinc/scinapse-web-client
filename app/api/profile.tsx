import { List } from "immutable";
import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { IArticle, recordifyArticle } from "../model/article";

const GET_USER_ARTICLE_DEFAULT_SIZE = 10;

export interface IGetUserArticlesParams {
  size?: number;
  page?: number;
  userId: number;
  cancelTokenSource: CancelTokenSource;
}

class ProfileAPI extends PlutoAxios {
  public async getUserProfile(userId: string) {
    const result = await this.get(`members/${userId}`);

    return result.data;
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
}

const apiHelper = new ProfileAPI();

export default apiHelper;
