import PlutoAxios from "./pluto";
import Axios, { AxiosResponse, Canceler } from "axios";
import { CompletionKeyword, CompletionKeywordKListFactory } from "../model/completion";

const cancelToken = Axios.CancelToken;
let cancel: Canceler = null;

class CompletionAPI extends PlutoAxios {
  public async getKeywordCompletion(query: string) {
    if (!!cancel) {
      cancel();
    }

    const getCompleteKeywordResponse: AxiosResponse = await this.get("/complete", {
      params: {
        q: query,
      },
      cancelToken: new cancelToken(function executor(c: Canceler) {
        cancel = c;
      }),
    });

    const completionKeywords: CompletionKeyword[] = getCompleteKeywordResponse.data.data;

    cancel = null;

    return CompletionKeywordKListFactory(completionKeywords);
  }
}

const completionAPI = new CompletionAPI();

export default completionAPI;
