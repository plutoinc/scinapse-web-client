import PlutoAxios from "./pluto";
import { AxiosResponse } from "axios";
import { CompletionKeyword, CompletionKeywordKListFactory } from "../model/completion";

class CompletionAPI extends PlutoAxios {
  public async getCompleteKeyword(query: string) {
    const getCompleteKeywordResponse: AxiosResponse = await this.get("/complete", {
      params: {
        q: query,
      },
    });

    const completionKeywords: CompletionKeyword[] = getCompleteKeywordResponse.data;

    return CompletionKeywordKListFactory(completionKeywords);
  }
}

const completionAPI = new CompletionAPI();

export default completionAPI;
