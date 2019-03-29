import Axios, { AxiosResponse, CancelToken } from "axios";
import PlutoAxios from "./pluto";
import { camelCaseKeys } from "../helpers/camelCaseKeys";

export interface CompletionKeyword
  extends Readonly<{
      keyword: string;
      type: string;
    }> {}

export interface FOSSuggestion {
  keyword: string;
  type: "FOS";
  fosId: number;
}

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

  public async fetchSuggestionFOS(query: string, cancelToken: CancelToken) {
    const res: AxiosResponse = await this.get("/complete/fos", {
      params: {
        q: query,
      },
      cancelToken,
    });

    const fosList: FOSSuggestion[] = camelCaseKeys(res.data.data.content);
    return fosList;
  }
}

const completionAPI = new CompletionAPI();

export default completionAPI;
