import PlutoAxios from "./pluto";
import Axios, { AxiosResponse, CancelToken } from "axios";

export interface CompletionKeyword
  extends Readonly<{
      keyword: string;
      type: string;
    }> {}

const CancelToken = Axios.CancelToken;
class CompletionAPI extends PlutoAxios {
  public async fetchSuggestionKeyword(query: string, cancelToken: CancelToken) {
    const getCompleteKeywordResponse: AxiosResponse = await this.get("/complete", {
      params: {
        q: query,
      },
      cancelToken,
    });

    const completionKeywords: CompletionKeyword[] = getCompleteKeywordResponse.data.data;
    return completionKeywords;
  }
}

const completionAPI = new CompletionAPI();

export default completionAPI;
