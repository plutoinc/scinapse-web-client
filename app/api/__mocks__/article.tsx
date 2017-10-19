import PlutoAxios from "../pluto";

class ArticleAPI extends PlutoAxios {
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
