import { stringify } from "qs";
import { SearchPageQueryParams } from "../components/articleSearch/types";
import { GetPapersParams } from "../api/types/paper";
import SafeURIStringHandler from "./safeURIStringHandler";
import { sortBy } from "lodash";

export interface FilterObject {
  yearFrom?: number | string;
  yearTo?: number | string;
  fos?: number[] | string[];
  journal?: number[] | string[];
}

export interface SearchPageQueryParamsObject {
  query: string;
  filter: FilterObject;
  page: number;
  sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
}

class PaperSearchQueryFormatter {
  public makeSearchQueryFromParamsObject(queryParams: SearchPageQueryParams): GetPapersParams {
    const query = SafeURIStringHandler.decode(queryParams.query ? queryParams.query : "");
    const searchPage = parseInt(queryParams.page ? queryParams.page : "0", 10) - 1 || 0;
    const filter = queryParams.filter;
    const sort = queryParams.sort;

    return {
      query,
      page: searchPage,
      filter: filter || "",
      sort: sort || "",
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

  public objectifyPapersFilter(rawFilterString?: string): FilterObject {
    const queryMap: { [key: string]: string } = {};

    if (rawFilterString) {
      const splitQueryArray = rawFilterString.split(",");

      splitQueryArray.forEach(splitQuery => {
        const key = splitQuery.split("=")[0];
        const value = splitQuery.split("=")[1];
        queryMap[key] = value;
      });
    }

    // tslint:disable-next-line:one-variable-per-declaration
    let yearFrom: number | any;
    let yearTo: number | any;
    let fos: number[] = [];
    let journal: number[] = [];
    if (!!queryMap.year) {
      yearFrom = parseInt(queryMap.year.split(":")[0], 10);
      yearTo = parseInt(queryMap.year.split(":")[1], 10);
    }

    if (!!queryMap.fos) {
      queryMap.fos.split("|").forEach(f => {
        if (!!f) {
          fos.push(parseInt(f, 10));
        }
      });
    } else {
      fos = [];
    }

    if (!!queryMap.journal) {
      queryMap.journal.split("|").forEach(j => {
        if (!!j) {
          journal.push(parseInt(j, 10));
        }
      });
    } else {
      journal = [];
    }

    return {
      yearFrom: isNaN(yearFrom) ? undefined : yearFrom,
      yearTo: isNaN(yearTo) ? undefined : yearTo,
      fos: sortBy(fos),
      journal: sortBy(journal),
    };
  }

  private getStringifiedPaperFilterParams({ yearFrom, yearTo, fos, journal }: FilterObject) {
    const resultQuery = `year=${yearFrom || ""}:${yearTo || ""},fos=${fos ? fos.join("|") : ""},journal=${
      journal ? journal.join("|") : ""
    }`;

    return resultQuery;
  }
}

const papersQueryFormatter = new PaperSearchQueryFormatter();

export default papersQueryFormatter;
