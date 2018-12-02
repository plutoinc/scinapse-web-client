import { CancelToken } from "axios";
import { Dispatch } from "react-redux";
import { parse } from "qs";
import { LoadDataParams } from "../../routes";
import { JournalShowMatchParams } from ".";
import { getJournal, getPapers } from "./actions";
import { PAPER_LIST_SORT_TYPES } from "../common/sortBox";

export interface JournalShowQueryParams {
  q?: string; // search query string
  p?: string; // page
  s?: PAPER_LIST_SORT_TYPES;
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
      promiseArr.push(dispatch(getJournal(journalId, params.cancelToken)));
      promiseArr.push(dispatch(fetchPapers(journalId, queryParamsObj, params.cancelToken)));
      await Promise.all(promiseArr);
    } catch (err) {
      // TODO: add redirect logic
      console.error(`Error for fetching collection list page data`, err);
    }
  }
}

export function fetchPapers(journalId: number, queryParamsObj: JournalShowQueryParams, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getPapers({
        journalId,
        page: queryParamsObj && queryParamsObj.p ? parseInt(queryParamsObj.p, 10) : 1,
        query: queryParamsObj && queryParamsObj.q ? queryParamsObj.q : undefined,
        sort: queryParamsObj && queryParamsObj.s ? queryParamsObj.s : "NEWEST_FIRST",
        cancelToken,
      })
    );
  };
}
