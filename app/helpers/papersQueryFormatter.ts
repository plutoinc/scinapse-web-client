import { stringify } from "qs";

export interface GetStringifiedPaperFilterParams {
  yearFrom?: number;
  yearTo?: number;
  journalIFFrom?: number;
  journalIFTo?: number;
}

export interface StringifyPapersQueryParams {
  query: string;
  filter: GetStringifiedPaperFilterParams;
  page?: number;
  references?: number;
  cited?: number;
  cognitiveId?: number;
  cognitive?: boolean;
}

class PapersQueryFormatter {
  private getStringifiedPaperFilterParams({
    yearFrom,
    yearTo,
    journalIFFrom,
    journalIFTo,
  }: GetStringifiedPaperFilterParams) {
    const resultQuery = `year=${yearFrom || ""}:${yearTo || ""},if=${journalIFFrom || ""}:${journalIFTo || ""}`;

    return resultQuery;
  }

  public stringifyPapersQuery(queryParamsObject: StringifyPapersQueryParams) {
    if (queryParamsObject.filter) {
      const formattedFilter = this.getStringifiedPaperFilterParams(queryParamsObject.filter);
      const formattedQueryParmasObject = { ...queryParamsObject, ...{ filter: formattedFilter } };

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
}

const papersQueryFormatter = new PapersQueryFormatter();

export default papersQueryFormatter;
