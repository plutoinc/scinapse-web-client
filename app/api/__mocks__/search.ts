import { CancelToken } from "axios";
import PlutoAxios from "../pluto";
import { RAW } from "../../__mocks__";
import { PaginationResponseV2, PageObjectV2 } from "../types/common";
import { Paper } from "../../model/paper";
import { AggregationData } from "../../model/aggregation";
import { Suggestion } from "../../model/suggestion";
import { BasePaperAuthor } from "../../model/author";
import { Affiliation } from "../../model/affiliation";
const camelcaseKeys = require("camelcase-keys");

interface SearchParams {
  query: string;
  sort: string;
  filter: string;
  page?: number;
  cancelToken?: CancelToken;
}

interface MatchEntityAuthor extends BasePaperAuthor {
  lastKnownAffiliation: Affiliation | null;
  paperCount: number;
  citationCount: number;
  profileImageUrl: string | null;
  representativePapers: Paper[];
}

export interface MatchEntity {
  entity: MatchEntityAuthor;
  type: "AUTHOR";
}

export interface SearchResult extends PaginationResponseV2<Paper[]> {
  data: {
    content: Paper[];
    page: PageObjectV2 | null;
    aggregation: AggregationData;
    matchedEntities: MatchEntity[];
    resultModified: boolean;
    suggestion: Suggestion | null;
  };
}

class SearchAPI extends PlutoAxios {
  public async search(params: SearchParams) {
    if (!params.query) {
      throw new Error("FAKE ERROR");
    }

    const searchResult = {
      content: RAW.PAPER,
      page: null,
      aggregation: RAW.AGGREGATION_RESPONSE,
      matchedEntities: null,
      resultModified: true,
      suggestion: null,
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
