interface IFormatPapersQueryParams {
  text: string;
  yearFrom?: number;
  yearTo?: number;
}

export function formatPapersQuery({ text, yearFrom, yearTo }: IFormatPapersQueryParams) {
  const resultQuery = `text=${text},year=${yearFrom || ""}:${yearTo || ""}`;

  return encodeURIComponent(resultQuery);
}

export function objectifyPapersQuery(query: string): { text: string; yearFrom?: number; yearTo?: number } {
  const queryMap: { [key: string]: string } = {};
  const splitedQueryArray = query.split(",");
  splitedQueryArray.forEach(splitedQuery => {
    const key = splitedQuery.split("=")[0];
    const value = splitedQuery.split("=")[1];
    queryMap[key] = value;
  });

  let yearFrom, yearTo;
  if (!!queryMap.year) {
    yearFrom = parseInt(queryMap.year.split(":")[0], 10);
    yearTo = parseInt(queryMap.year.split(":")[1], 10);
  }

  return {
    text: queryMap.text,
    yearFrom,
    yearTo,
  };
}
