import { AggregationJournal, AggregationFos } from "../model/aggregation";

interface FilterSet {
  journal: AggregationJournal[];
  fos: AggregationFos[];
  yearFrom: number;
  yearTo: number;
}

function makeJournalTitle(journal: AggregationJournal[]) {
  if (journal === null || journal.length === 0) {
    return "AllJournal";
  } else if (journal.length > 1) {
    return `${journal[0].title}${journal.length}`;
  } else {
    return `${journal[0].title}`;
  }
}

function makeFosTitle(fos: AggregationFos[]) {
  if (fos === null || fos.length === 0) {
    return "AllFos";
  } else if (fos.length > 1) {
    return `${fos[0].name}${fos.length}`;
  } else {
    return `${fos[0].name}`;
  }
}

function makeYearTitle(yearFrom: number, yearTo: number) {
  const currentYear = new Date().getFullYear();
  if (yearFrom === 0 && yearTo === 0) {
    return `AllYear`;
  }

  if (currentYear - yearFrom <= 4 && currentYear - yearFrom > 2) {
    return `recent5`;
  } else if (currentYear - yearFrom <= 2 && currentYear - yearFrom > 0) {
    return `recent3`;
  } else if (currentYear - yearFrom === 0) {
    return `current`;
  } else if (yearFrom <= 1980) {
    return `1980${yearTo === 0 || yearTo === currentYear - 1 ? "current" : ""}`;
  } else {
    return `${yearFrom}${yearTo}`;
  }
}

export default function makeNewFilterSetTitle(params: FilterSet) {
  const journalTitle = makeJournalTitle(params.journal);
  const fosTitle = makeFosTitle(params.fos);
  const yearTitle = makeYearTitle(params.yearFrom, params.yearTo);

  return `${yearTitle}-${fosTitle}-${journalTitle}`;
}
