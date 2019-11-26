import { CancelToken } from 'axios';
import PlutoAxios from './pluto';
import { PaginationResponseV2, PageObjectV2 } from './types/common';
import { Paper } from '../model/paper';
import { AggregationData } from '../model/aggregation';
import { Suggestion } from '../model/suggestion';
import { BasePaperAuthor } from '../model/author';
import { Affiliation } from '../model/affiliation';
import { Author } from '../model/author/author';
import { NewFOS } from '../model/fos';
import { getIdSafePaper, getSafeAuthor } from '../helpers/getIdSafeData';

export interface BaseSearchParams {
  query: string;
  sort: string;
  page?: number;
  cancelToken?: CancelToken;
  detectYear?: boolean;
}

export interface PaperSearchParams extends BaseSearchParams {
  filter: string;
}

export interface MatchEntityAuthor extends BasePaperAuthor {
  lastKnownAffiliation: Affiliation | null;
  fosList: NewFOS[];
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
    doi: string | null;
    doiPatternMatched: boolean;
    aggregation: AggregationData | null;
    matchedAuthor: MatchAuthor;
    resultModified: boolean;
    suggestion: Suggestion | null;
    detectedYear: number | null;
    detectedPhrases: string[];
  };
}

export interface AuthorSearchResult extends PaginationResponseV2<Author[]> {
  data: {
    content: Author[];
    page: PageObjectV2 | null;
  };
}

class SearchAPI extends PlutoAxios {
  public async search({ query, sort, filter, page = 0, cancelToken, detectYear, wcm }: PaperSearchParams) {
    const res = await this.get('/search', {
      params: {
        q: query,
        sort,
        filter,
        page,
        yd: detectYear,
        wcm,
      },
      cancelToken,
    });
    
    const searchResult: SearchResult = res.data;
    const searchResultData = searchResult.data;
    const safeSearchResultData = {
      ...searchResultData, 
      content: searchResultData.content.map(getIdSafePaper),
      aggregation: {
        ...searchResultData.aggregation,
        fosList: searchResultData.aggregation?.fosList.map(fos => ({ ...fos, id: String(fos.id)})) || [],
        journals: searchResultData.aggregation?.journals.map(journal => ({...journal, id: String(journal.id)}))
      },
      matchedAuthor: {
        ...searchResultData.matchedAuthor,
        content: searchResultData.matchedAuthor ? searchResultData.matchedAuthor.content.map(author => ({
          ...author,
          id: String(author.id),
          lastKnownAffiliation: {
            ...author.lastKnownAffiliation,
            id: String(author.lastKnownAffiliation?.id)
          },
          fosList: author.fosList.map(fos => ({ ...fos, id: String(fos.id)}))
        })) : []
      }
    }

    return {
      ...searchResult,
      data: {
        ...safeSearchResultData,
        page: {
          ...safeSearchResultData.page,
          page: safeSearchResultData.page ? safeSearchResultData.page.page + 1 : 1,
        },
      },
    };
  }

  public async searchAuthor({ query, sort, page = 0, cancelToken }: BaseSearchParams) {
    const res = await this.get('/search/authors', {
      params: {
        q: query,
        sort,
        page,
      },
      cancelToken,
    });
    
    const searchResult: AuthorSearchResult = res.data;
    const searchResultData = res.data.data;
    const safeSearchResultData = {
      ...searchResultData,
      content: searchResultData.content.map(getSafeAuthor)
    }
    

    return {
      ...searchResult,
      data: {
        ...safeSearchResultData,
        page: {
          ...safeSearchResultData.page,
          page: safeSearchResultData.page ? safeSearchResultData.page.page + 1 : 1,
        },
      },
    };
  }
}

const searchAPI = new SearchAPI();

export default searchAPI;
