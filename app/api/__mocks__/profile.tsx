import { List } from "immutable";
import PlutoAxios from "../pluto";
import { IGetUserArticlesParams, IGetReviewsParams } from "../profile";
import { RECORD } from "../../__mocks__";

class ProfileAPI extends PlutoAxios {
  public async getUserArticles(params: IGetUserArticlesParams) {
    if (params.userId === 0) {
      throw new Error("FAKE ERROR");
    } else {
      return {
        articles: List([RECORD.ARTICLE, RECORD.ARTICLE, RECORD.ARTICLE]),
        first: false,
        last: false,
        number: 0,
        numberOfElements: 30,
        size: 0,
        sort: "",
        totalElements: 300,
        totalPages: 300,
      };
    }
  }

  public async getUserReviews(params: IGetReviewsParams) {
    if (params.userId === 0) {
      throw new Error("FAKE ERROR");
    } else {
      return {
        reviews: List([RECORD.REVIEW, RECORD.REVIEW, RECORD.REVIEW]),
        first: false,
        last: false,
        number: 0,
        numberOfElements: 30,
        size: 0,
        sort: "",
        totalElements: 300,
        totalPages: 300,
      };
    }
  }
}

const apiHelper = new ProfileAPI();

export default apiHelper;
