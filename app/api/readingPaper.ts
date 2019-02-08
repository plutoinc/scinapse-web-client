import { CancelToken } from "axios";
import { Paper } from "../model/paper";
import WorkingshopAxios from "./workingshop";
const camelcaseKeys = require("camelcase-keys");

export interface GetPaperParams {
  paperId: number;
  cancelToken: CancelToken;
}

class ReadingPaperAPI extends WorkingshopAxios {
  public async getReadingNowPapers(params: GetPaperParams): Promise<Paper[]> {
    const getPapersResponse = await this.get(`/papers/${params.paperId}/reading-now`, {
      cancelToken: params.cancelToken,
    });

    const camelizedRes = camelcaseKeys(getPapersResponse.data, { deep: true });
    const papers: Paper[] = camelizedRes.data.content;

    return papers;
  }
}

const readingPaperAPI = new ReadingPaperAPI();

export default readingPaperAPI;
