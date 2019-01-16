import { AxiosResponse } from "axios";
import PlutoAxios from "./pluto";
import { RawPaginationResponseV2 } from "./types/common";

export interface SuggestAffiliation {
  type: string;
  keyword: string;
  affiliation_id: number;
}

class SuggestAPI extends PlutoAxios {
  public async getAffiliationSuggest(q: string): Promise<RawPaginationResponseV2<SuggestAffiliation[]>> {
    const res: AxiosResponse = await this.get(`/complete/affiliation`, {
      params: {
        q,
      },
    });

    const suggestionData: RawPaginationResponseV2<SuggestAffiliation[]> = res.data;

    return suggestionData;
  }
}

const suggestAPI = new SuggestAPI();

export default suggestAPI;
