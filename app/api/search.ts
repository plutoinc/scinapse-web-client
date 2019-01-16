import { CancelToken } from "axios";
// import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { CommonPaginationResponseV2, RawPageObjectV2 } from "./types/common";
import { Paper } from "../model/paper";
import { RawAggregation } from "../model/aggregation";
import { RawSuggestion } from "../model/suggestion";
import { BasePaperAuthor } from "../model/author";
import { Affiliation } from "../model/affiliation";

interface SearchParams {
  query: string;
  sort: string;
  filter: string;
  page?: number;
  cancelToken?: CancelToken;
}

interface MatchEntityAuthor extends BasePaperAuthor {
  last_known_affiliation: Affiliation;
  paper_count: number;
  citation_count: number;
  profile_image_url: string | null;
  representative_papers: Paper[];
}

interface MatchEntities {
  entity: MatchEntityAuthor;
  type: "AUTHOR";
}

export interface RawSearchResult extends CommonPaginationResponseV2<Paper[]> {
  data: {
    content: Paper[];
    page: RawPageObjectV2 | null;
    aggregation: RawAggregation;
    matched_entities: MatchEntities[];
    result_modified: boolean;
    suggestion: RawSuggestion;
  };
}

class SearchAPI extends PlutoAxios {
  public async search({ query, sort, filter, page = 0, cancelToken }: SearchParams) {
    const res = await this.get("/search", {
      params: {
        q: query,
        sort,
        filter,
        page,
      },
      cancelToken,
    });

    const searchRes: RawSearchResult = res.data;
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

const searchAPI = new SearchAPI();

export default searchAPI;
