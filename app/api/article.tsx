import PlutoAxios from "./pluto";
import { IArticleDetail } from "../model/article";

class ArticleAPI extends PlutoAxios {
  public async getArticleDetail(articleId: number): Promise<IArticleDetail> {
    const result = await this.get(`articles/${articleId}`);

    return result.data;
  }
}

const apiHelper = new ArticleAPI();

export default apiHelper;
