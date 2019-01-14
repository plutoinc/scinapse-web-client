import PlutoAxios from "../pluto";
import { SuggestionKeyword } from "../../model/suggestion";
import { CompletionKeyword } from "../completion";

class CompletionAPI extends PlutoAxios {
  public async getSuggestionKeyword(_query: string): Promise<SuggestionKeyword> {
    return { keyword: "papre", suggestion: "paper", highlighted: "<b>paper</b>" };
  }

  public async getKeywordCompletion(_query: string) {
    const completionKeywords: CompletionKeyword[] = [
      { keyword: "paprec", type: "KEYWORD" },
      { keyword: "papreg", type: "KEYWORD" },
      { keyword: "paprent", type: "KEYWORD" },
      { keyword: "parents", type: "KEYWORD" },
      { keyword: "papreen", type: "KEYWORD" },
      { keyword: "papreddy kashireddy", type: "KEYWORD" },
      { keyword: "papreen nahar", type: "KEYWORD" },
      { keyword: "papreck", type: "KEYWORD" },
      { keyword: "papreck justin", type: "KEYWORD" },
      { keyword: "papreckiene", type: "KEYWORD" },
    ];

    return completionKeywords;
  }
}

const completionAPI = new CompletionAPI();

export default completionAPI;
