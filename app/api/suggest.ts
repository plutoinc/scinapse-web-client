import { AxiosResponse } from 'axios';
import PlutoAxios from './pluto';
import { RawPaginationResponseV2 } from './types/common';
import { camelCaseKeys } from '../helpers/camelCaseKeys';

export interface SuggestAffiliation {
  type: string;
  keyword: string;
  affiliationId: string;
}

class SuggestAPI extends PlutoAxios {
  public async getAffiliationSuggest(q: string): Promise<RawPaginationResponseV2<SuggestAffiliation[]>> {
    const res: AxiosResponse = await this.get(`/complete/affiliation`, {
      params: {
        q,
      },
    });

    const suggestionData: RawPaginationResponseV2<SuggestAffiliation[]> = camelCaseKeys(res.data);

    return suggestionData;
  }
}

const suggestAPI = new SuggestAPI();

export default suggestAPI;
