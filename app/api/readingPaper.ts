import { normalize } from "normalizr";
import { CancelToken } from "axios";
import { Paper, paperSchema } from "../model/paper";
import WorkingshopAxios from "./workingshop";
const camelcaseKeys = require("camelcase-keys");

export interface GetPaperParams {
  paperId: number;
  cancelToken: CancelToken;
}

class ReadingPaperAPI extends WorkingshopAxios {
  public async getReadingNowPapers(
    params: GetPaperParams
  ): Promise<{
    entities: { papers: { [paperId: number]: Paper } };
    result: number[];
  }> {
    const getPapersResponse = await this.get(`/papers/${params.paperId}/reading-now`, {
      cancelToken: params.cancelToken,
    });

    const camelizedRes = camelcaseKeys(getPapersResponse.data, { deep: true });
    const rawPapers: Paper[] = camelizedRes.data.content;
    const authorSlicedPapers = rawPapers.map(paper => {
      return { ...paper, authors: paper.authors.slice(0, 10) };
    });

    return normalize(authorSlicedPapers, [paperSchema]);
  }
}

const readingPaperAPI = new ReadingPaperAPI();

export default readingPaperAPI;
