import PlutoAxios from "./pluto";
import { IArticleStateRecord, recordifyArticle } from "../model/article";

class ArticleAPI extends PlutoAxios {
  public async getArticle(articleId: number): Promise<IArticleStateRecord> {
    const rawArticle = await this.get(`articles/${articleId}`);

    return recordifyArticle(rawArticle.data);
  }
}

const apiHelper = new ArticleAPI();

export default apiHelper;
