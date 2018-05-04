import PlutoAxios from "./pluto";
import Axios, { AxiosResponse, Canceler } from "axios";
import { CompletionKeyword, CompletionKeywordKListFactory } from "../model/completion";
import { SuggestionKeyword, SuggestionKeywordFactory, SuggestionKeywordRecord } from "../model/suggestion";

const cancelToken = Axios.CancelToken;
let cancel: Canceler = null;

class CompletionAPI extends PlutoAxios {
  public async getSuggestionKeyword(query: string): Promise<SuggestionKeywordRecord> {
    const rawResponse: AxiosResponse = await this.get(`/suggest`, {
      params: {
        q: query,
      },
    });

    const rawKeyword: SuggestionKeyword = rawResponse.data.data;

    return SuggestionKeywordFactory(rawKeyword);
  }

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
