import PlutoAxios from "../pluto";
import { RAW } from "../../__mocks__";
import { SearchResult, SearchParams } from "../search";
const camelcaseKeys = require("camelcase-keys");

class SearchAPI extends PlutoAxios {
  public async search(params: SearchParams) {
    if (!params.query) {
      throw new Error("FAKE ERROR");
    }

    const searchResult = {
      data: {
        content: RAW.PAPER,
        page: null,
        aggregation: RAW.AGGREGATION_RESPONSE,
        matchedEntities: null,
        resultModified: true,
        suggestion: null,
      },
    };

    const camelizedRes = camelcaseKeys(searchResult, { deep: true });
    const searchRes: SearchResult = camelizedRes;

    return {
      ...searchRes,
      data: {
        ...searchRes.data,
        page: {
          ...searchRes.data.page,
          page: searchRes.data.page ? searchRes.data.page.page + 1 : 1,
        },
      },
    };
  }
}

const apiHelper = new SearchAPI();

export default apiHelper;
