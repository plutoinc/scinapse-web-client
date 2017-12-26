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
  const textIndex = query.search("text=");
  const yearFromIndex = query.search("year=");
  const yearToIndex = query.search(":");

  let text, yearFrom, yearTo;

  if (textIndex !== -1) {
    text = query.slice(textIndex + "text=".length, yearFromIndex - 1);
  }

  if (yearFromIndex !== -1) {
    yearFrom = query.slice(yearFromIndex + "year=".length, yearToIndex);
    if (!!yearFrom) {
      yearFrom = parseInt(yearFrom, 10);
    } else {
      yearFrom = null;
    }
  }

  if (yearToIndex !== -1) {
    yearTo = query.slice(yearToIndex + ":".length, query.length);
    if (!!yearTo) {
      yearTo = parseInt(yearTo, 10);
    } else {
      yearTo = null;
    }
  }

  return {
    text,
    yearFrom,
    yearTo,
  };
}
