import { Dispatch } from "react-redux";
import { parse } from "qs";
import { LoadDataParams } from "../../routes";
import { JournalShowMatchParams } from ".";
import { getJournal, getPapers } from "./actions";

interface JournalShowQueryParams {
  q?: string; // search query string
  p?: string; // page
}

export async function fetchJournalShowPageData(params: LoadDataParams<JournalShowMatchParams>) {
  const { dispatch, match, queryParams } = params;
  const queryParamsObj: JournalShowQueryParams = parse(queryParams, { ignoreQueryPrefix: true });

  const journalId = parseInt(match.params.journalId, 10);
  if (isNaN(journalId)) {
    // TODO: Add redirect logic
    return;
  } else {
    try {
      const promiseArr: Array<Promise<any>> = [];
      promiseArr.push(dispatch(getJournal(journalId)));
      promiseArr.push(dispatch(fetchPapers(journalId, queryParamsObj)));
      await Promise.all(promiseArr);
    } catch (err) {
      // TODO: add redirect logic
      console.error(`Error for fetching collection list page data`, err);
    }
  }
}

export function fetchPapers(journalId: number, queryParamsObj: JournalShowQueryParams) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getPapers({
        journalId,
        page: queryParamsObj && queryParamsObj.p ? parseInt(queryParamsObj.p, 10) : 1,
        query: queryParamsObj && queryParamsObj.q ? queryParamsObj.q : undefined,
      })
    );
  };
}
