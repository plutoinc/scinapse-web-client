import { AxiosResponse } from "axios";
import PlutoAxios from "./pluto";
import { CommonPaginationResponseV2 } from "./types/common";

export interface SuggestAffiliation {
  type: string;
  keyword: string;
  affiliation_id: number;
}

class SuggestAPI extends PlutoAxios {
  public async getAffiliationSuggest(q: string): Promise<CommonPaginationResponseV2<SuggestAffiliation[]>> {
    const res: AxiosResponse = await this.get(`/complete/affiliation`, {
      params: {
        q,
      },
    });

    const suggestionData: CommonPaginationResponseV2<SuggestAffiliation[]> = res.data;

    return suggestionData;
  }
}

const suggestAPI = new SuggestAPI();

export default suggestAPI;
