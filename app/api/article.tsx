import PlutoAxios from "./pluto";
import { IArticleRecord, recordifyArticle } from "../model/article";

class ArticleAPI extends PlutoAxios {
  public async getArticle(articleId: number): Promise<IArticleRecord> {
    const rawArticle = await this.get(`articles/${articleId}`);

    return recordifyArticle(rawArticle.data);
  }
}

const apiHelper = new ArticleAPI();

export default apiHelper;
