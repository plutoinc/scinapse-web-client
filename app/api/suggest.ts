import { AxiosResponse } from 'axios';
import PlutoAxios from './pluto';
import { PaginationResponseV2 } from './types/common';

export interface SuggestAffiliation {
  type: string;
  keyword: string;
  affiliationId: string;
}

class SuggestAPI extends PlutoAxios {
  public async getAffiliationSuggest(q: string): Promise<PaginationResponseV2<SuggestAffiliation[]>> {
    const res: AxiosResponse = await this.get(`/complete/affiliation`, {
      params: {
        q,
      },
    });

    const suggestionData: PaginationResponseV2<SuggestAffiliation[]> = res.data;
    const safeSuggestionData = {
      ...suggestionData,
      data: {
        ...suggestionData.data,
        content: suggestionData.data.content.map(affiliation => ({
          ...affiliation,
          affiliationId: String(affiliation.affiliationId),
        })),
      },
    };

    return safeSuggestionData;
  }
}

const suggestAPI = new SuggestAPI();

export default suggestAPI;
