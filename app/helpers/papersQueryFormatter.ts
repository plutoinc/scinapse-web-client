import { stringify } from "qs";

export interface GetStringifiedPaperFilterParams {
  yearFrom?: number;
  yearTo?: number;
  journalIFFrom?: number;
  journalIFTo?: number;
  fos?: number[];
  journal?: number[];
}

export interface ParsedSearchPageQueryParams {
  filter: GetStringifiedPaperFilterParams;
  query: string;
  page?: number;
  references?: number;
  cited?: number;
  cognitiveId?: number;
  cognitive?: boolean;
}

class PaperSearchQueryFormatter {
  public stringifyPapersQuery(queryParamsObject: ParsedSearchPageQueryParams) {
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

  public objectifyPapersFilter(query: string): GetStringifiedPaperFilterParams {
    const queryMap: { [key: string]: string } = {};

    const splitQueryArray = query.split(",");
    splitQueryArray.forEach(splitQuery => {
      const key = splitQuery.split("=")[0];
      const value = splitQuery.split("=")[1];
      queryMap[key] = value;
    });

    // tslint:disable-next-line:one-variable-per-declaration
    let yearFrom, yearTo, journalIFFrom, journalIFTo, fos, journal;
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
        }
      });
    }

    if (!!queryMap.journal) {
      journal = queryMap.journal.split("|").map(j => {
        if (!!j) {
          return parseInt(j, 10);
        }
      });
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
  }: GetStringifiedPaperFilterParams) {
    const resultQuery = `year=${yearFrom || ""}:${yearTo || ""},if=${journalIFFrom || ""}:${journalIFTo || ""},fos=${
      fos ? fos.join("|") : ""
    },journal=${journal ? journal.join("|") : ""}`;

    return resultQuery;
  }
}

const papersQueryFormatter = new PaperSearchQueryFormatter();

export default papersQueryFormatter;
