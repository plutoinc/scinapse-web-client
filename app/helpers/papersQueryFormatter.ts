import { stringify } from "qs";

export interface GetStringifiedPaperFilterParams {
  yearFrom?: number;
  yearTo?: number;
  journalIFFrom?: number;
  journalIFTo?: number;
}

export interface StringifyPapersQueryParams {
  filter: GetStringifiedPaperFilterParams;
  query: string;
  page?: number;
  references?: number;
  cited?: number;
  cognitiveId?: number;
  cognitive?: boolean;
}

export interface SearchQueryObj extends GetStringifiedPaperFilterParams {
  query: string;
  page?: number;
  references?: number;
  cited?: number;
  cognitiveId?: number;
  cognitive?: boolean;
}

class PapersQueryFormatter {
  public stringifyPapersQuery(queryParamsObject: StringifyPapersQueryParams) {
    if (queryParamsObject.filter) {
      const formattedFilter = this.getStringifiedPaperFilterParams(queryParamsObject.filter);
      const formattedQueryParmasObject = {
        ...queryParamsObject,
        ...{ filter: formattedFilter, query: encodeURIComponent(queryParamsObject.query) },
      };

      return stringify(formattedQueryParmasObject);
    } else {
      return stringify(queryParamsObject);
    }
  }

  public objectifyPapersFilter(query: string): GetStringifiedPaperFilterParams {
    const queryMap: { [key: string]: string } = {};

    const splitedQueryArray = query.split(",");
    splitedQueryArray.forEach(splitedQuery => {
      const key = splitedQuery.split("=")[0];
      const value = splitedQuery.split("=")[1];
      queryMap[key] = value;
    });

    // tslint:disable-next-line:one-variable-per-declaration
    let yearFrom, yearTo, journalIFFrom, journalIFTo;
    if (!!queryMap.year) {
      yearFrom = parseInt(queryMap.year.split(":")[0], 10);
      yearTo = parseInt(queryMap.year.split(":")[1], 10);
    }

    if (!!queryMap.if) {
      journalIFFrom = parseInt(queryMap.if.split(":")[0], 10);
      journalIFTo = parseInt(queryMap.if.split(":")[1], 10);
    }

    return {
      yearFrom,
      yearTo,
      journalIFFrom,
      journalIFTo,
    };
  }

  private getStringifiedPaperFilterParams({
    yearFrom,
    yearTo,
    journalIFFrom,
    journalIFTo,
  }: GetStringifiedPaperFilterParams) {
    const resultQuery = `year=${yearFrom || ""}:${yearTo || ""},if=${journalIFFrom || ""}:${journalIFTo || ""}`;

    return resultQuery;
  }
}

const papersQueryFormatter = new PapersQueryFormatter();

export default papersQueryFormatter;
