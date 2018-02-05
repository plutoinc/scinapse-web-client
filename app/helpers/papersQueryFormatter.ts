import { stringify } from "qs";

export interface IFormatPapersQueryParams {
  text: string;
  yearFrom?: number;
  yearTo?: number;
  journalIFFrom?: number;
  journalIFTo?: number;
}

class PapersQueryFormatter {
  public formatPapersQuery({ text, yearFrom, yearTo, journalIFFrom, journalIFTo }: IFormatPapersQueryParams) {
    const resultQuery = `text=${text},year=${yearFrom || ""}:${yearTo || ""},if=${journalIFFrom || ""}:${journalIFTo ||
      ""}`;

    return encodeURIComponent(resultQuery);
  }

  public stringifyPapersQuery(queryParamsObject: any) {
    if (queryParamsObject.text) {
      const formattedQuery = this.formatPapersQuery({ text: queryParamsObject.text });
      const formattedQueryParmasObject = { ...queryParamsObject, ...{ query: formattedQuery } };

      return stringify(formattedQueryParmasObject);
    } else {
      return stringify(queryParamsObject);
    }
  }

  public objectifyPapersQuery(query: string): IFormatPapersQueryParams {
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
      text: queryMap.text,
      yearFrom,
      yearTo,
      journalIFFrom,
      journalIFTo,
    };
  }
}

const papersQueryFormatter = new PapersQueryFormatter();

export default papersQueryFormatter;
