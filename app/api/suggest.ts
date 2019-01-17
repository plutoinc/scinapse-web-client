import { AxiosResponse } from "axios";
import PlutoAxios from "./pluto";
import { RawPaginationResponseV2 } from "./types/common";
const camelcaseKeys = require("camelcase-keys");

export interface SuggestAffiliation {
  type: string;
  keyword: string;
  affiliationId: number;
}

class SuggestAPI extends PlutoAxios {
  public async getAffiliationSuggest(q: string): Promise<RawPaginationResponseV2<SuggestAffiliation[]>> {
    const res: AxiosResponse = await this.get(`/complete/affiliation`, {
      params: {
        q,
      },
    });

    const suggestionData: RawPaginationResponseV2<SuggestAffiliation[]> = camelcaseKeys(res.data, { deep: true });

    return suggestionData;
  }
}

const suggestAPI = new SuggestAPI();

export default suggestAPI;
