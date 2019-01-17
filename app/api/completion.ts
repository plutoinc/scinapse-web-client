import PlutoAxios from "./pluto";
import Axios, { AxiosResponse, Canceler, CancelToken } from "axios";

export interface CompletionKeyword
  extends Readonly<{
      keyword: string;
      type: string;
    }> {}

const CancelToken = Axios.CancelToken;
let cancel: Canceler | null = null;

class CompletionAPI extends PlutoAxios {
  public async getKeywordCompletion(query: string) {
    if (!!cancel) {
      cancel();
    }

    const getCompleteKeywordResponse: AxiosResponse = await this.get("/complete", {
      params: {
        q: query,
      },
      cancelToken: new CancelToken(function executor(c: Canceler) {
        cancel = c;
      }),
    });

    const completionKeywords: CompletionKeyword[] = getCompleteKeywordResponse.data.data;

    cancel = null;

    return completionKeywords;
  }
}

const completionAPI = new CompletionAPI();

export default completionAPI;
