import { stringify } from "qs";
import { ArticleSearchSearchParams } from "../components/articleSearch/types";
import { GetPapersParams } from "../api/types/paper";
import SafeURIStringHandler from "./safeURIStringHandler";

export interface FilterObject {
  yearFrom?: number | string;
  yearTo?: number | string;
  journalIFFrom?: number | string;
  journalIFTo?: number | string;
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
  public makeSearchQueryFromParamsObject(queryParams: ArticleSearchSearchParams): GetPapersParams {
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
        ...{ filter: formattedFilter, query: encodeURIComponent(queryParamsObject.query) },
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
    let yearFrom: number | undefined;
    let yearTo: number | undefined;
    let journalIFFrom: number | undefined;
    let journalIFTo: number | undefined;
    let fos: number[];
    let journal: number[];
    if (!!queryMap.year) {
      yearFrom = parseInt(queryMap.year.split(":")[0], 10);
      yearTo = parseInt(queryMap.year.split(":")[1], 10);
    }

    if (!!queryMap.if) {
      journalIFFrom = parseInt(queryMap.if.split(":")[0], 10);
      journalIFTo = parseInt(queryMap.if.split(":")[1], 10);
    }

    if (!!queryMap.fos) {
      fos = queryMap.fos.split("|").map(field => {
        if (!!field) {
          return parseInt(field, 10);
        } else {
          return 0;
        }
      });
    } else {
      fos = [];
    }

    if (!!queryMap.journal) {
      journal = queryMap.journal.split("|").map(j => {
        if (!!j) {
          return parseInt(j, 10);
        } else {
          return 0;
        }
      });
    } else {
      journal = [];
    }

    return {
      yearFrom,
      yearTo,
      journalIFFrom,
      journalIFTo,
      fos,
      journal,
    };
  }

  private getStringifiedPaperFilterParams({
    yearFrom,
    yearTo,
    journalIFFrom,
    journalIFTo,
    fos,
    journal,
  }: FilterObject) {
    const resultQuery = `year=${yearFrom || ""}:${yearTo || ""},if=${journalIFFrom || ""}:${journalIFTo || ""},fos=${
      fos ? fos.join("|") : ""
    },journal=${journal ? journal.join("|") : ""}`;

    return resultQuery;
  }
}

const papersQueryFormatter = new PaperSearchQueryFormatter();

export default papersQueryFormatter;
