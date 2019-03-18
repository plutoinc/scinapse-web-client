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

  if (currentYear - yearFrom <= 4) {
    return `recent5`;
  } else if (yearFrom >= 1980) {
    return `1980`;
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

// 1. 아무것도 설정 안 함(실제로는 이런 경우 없음):    AllYear-AllField-AllJournal
// 2. X,Y,Z 저널:    AllYear-AllField-X3
// 3. A,B,C,D,E FOS:    AllYear-A5-AllJournal
// 4. 최근 5년:    recent5-AllField-AllJournal
// 5. 1980년 이후:    1980-AllField-AllJournal
// 6. 1980년 ~ 2000년:    19802000-AllField-AllJournal
