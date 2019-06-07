import { stringify } from 'qs';
import { SearchPageQueryParams } from '../components/articleSearch/types';
import { SearchPapersParams } from '../api/types/paper';
import SafeURIStringHandler from './safeURIStringHandler';

export interface FilterObject {
  yearFrom: number;
  yearTo: number;
  fos: number[];
  journal: number[];
}

interface RawFilter {
  year: string;
  fos: string;
  journal: string;
}

export interface SearchPageQueryParamsObject {
  query: string;
  filter: Partial<FilterObject>;
  page: number;
  sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
}

export const DEFAULT_FILTER: FilterObject = {
  yearFrom: 0,
  yearTo: 0,
  fos: [],
  journal: [],
};

class SearchQueryManager {
  public makeSearchQueryFromParamsObject(queryParams: SearchPageQueryParams): SearchPapersParams {
    const query = SafeURIStringHandler.decode(queryParams.query ? queryParams.query : '');
    const searchPage = parseInt(queryParams.page ? queryParams.page : '0', 10) - 1 || 0;
    const filter = queryParams.filter;
    const sort = queryParams.sort;

    return {
      query,
      page: searchPage,
      filter: filter || '',
      sort: sort || '',
    };
  }

  public stringifyPapersQuery(queryParamsObject: SearchPageQueryParamsObject) {
    if (queryParamsObject.filter) {
      const formattedFilter = this.getStringifiedPaperFilterParams(queryParamsObject.filter);
      const formattedQueryParamsObject = {
        ...queryParamsObject,
        ...{ filter: formattedFilter, query: queryParamsObject.query },
      };

      return stringify(formattedQueryParamsObject);
    } else {
      return stringify(queryParamsObject);
    }
  }

  public objectifyPaperFilter(filterString?: string): FilterObject {
    if (!filterString) {
      return DEFAULT_FILTER;
    }

    const filter = filterString
      .split(',')
      .map(filter => {
        const keyValueArr = filter.split('=');
        const object: Partial<RawFilter> = { [keyValueArr[0]]: keyValueArr[1] };
        return object;
      })
      .reduce((prev, current) => {
        const mappedObject: Partial<FilterObject> = {};
        if (current.year) {
          const yearSet = current.year.split(':');
          mappedObject.yearFrom = parseInt(yearSet[0] || '0', 10);
          mappedObject.yearTo = parseInt(yearSet[1] || '0', 10);
        }
        if (current.journal) {
          mappedObject.journal = this.parseNumberArray(current.journal);
        }
        if (current.fos) {
          mappedObject.fos = this.parseNumberArray(current.fos);
        }

        return { ...prev, ...mappedObject };
      }, DEFAULT_FILTER);

    return filter;
  }

  public getStringifiedPaperFilterParams({ yearFrom, yearTo, fos, journal }: Partial<FilterObject>) {
    const resultQuery = `year=${yearFrom || ''}:${yearTo || ''},fos=${fos ? fos.join('|') : ''},journal=${
      journal ? journal.join('|') : ''
    }`;

    return resultQuery;
  }

  private parseNumberArray(raw: string) {
    return raw.split('|').map(str => parseInt(str, 10));
  }
}

const papersQueryFormatter = new SearchQueryManager();

export default papersQueryFormatter;
