import { CancelToken } from "axios";
import PlutoAxios from "./pluto";
import { PaginationResponseV2, PageObjectV2 } from "./types/common";
import { Paper } from "../model/paper";
import { AggregationData } from "../model/aggregation";
import { Suggestion } from "../model/suggestion";
import { BasePaperAuthor } from "../model/author";
import { Affiliation } from "../model/affiliation";
import { camelCaseKeys } from "../helpers/camelCaseKeys";
import { Author } from "../model/author/author";

export interface AuthorSearchParams {
  query: string;
  sort: string;
  page?: number;
  cancelToken?: CancelToken;
}

export interface SearchParams extends AuthorSearchParams {
  filter: string;
}

export interface MatchEntityAuthor extends BasePaperAuthor {
  lastKnownAffiliation: Affiliation | null;
  paperCount: number;
  citationCount: number;
  profileImageUrl: string | null;
  representativePapers: Paper[];
}

export interface MatchAuthor {
  content: MatchEntityAuthor[];
  totalElements: number;
}

export interface SearchResult extends PaginationResponseV2<Paper[]> {
  data: {
    content: Paper[];
    page: PageObjectV2 | null;
    aggregation: AggregationData;
    matchedAuthor: MatchAuthor;
    resultModified: boolean;
    suggestion: Suggestion | null;
  };
}

export interface AuthorSearchResult extends PaginationResponseV2<Author[]> {
  data: {
    content: Author[];
    page: PageObjectV2 | null;
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
    const camelizedRes = camelCaseKeys(res.data);
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

  public async authorSearch({ query, sort, page = 0, cancelToken }: AuthorSearchParams) {
    const res = await this.get("/search/authors", {
      params: {
        q: query,
        sort,
        page,
      },
      cancelToken,
    });
    const camelizedRes = camelCaseKeys(res.data);
    console.log(camelizedRes);
    const searchRes: AuthorSearchResult = camelizedRes;
    console.log(searchRes);

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
