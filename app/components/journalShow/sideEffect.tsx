import { Dispatch } from "react-redux";
import { LoadDataParams } from "../../routes";
import { JournalShowMatchParams } from ".";
import { getJournal, getPapers } from "./actions";

export async function fetchJournalShowPageData(params: LoadDataParams<JournalShowMatchParams>) {
  const { dispatch, match } = params;

  const journalId = parseInt(match.params.journalId, 10);
  if (isNaN(journalId)) {
    // TODO: Add redirect logic
    return;
  } else {
    try {
      const promiseArr: Array<Promise<any>> = [];
      promiseArr.push(dispatch(getJournal(journalId)));
      promiseArr.push(dispatch(fetchPapers(journalId)));
      await Promise.all(promiseArr);
    } catch (err) {
      // TODO: add redirect logic
      console.error(`Error for fetching collection list page data`, err);
    }
  }
}

export function fetchPapers(journalId: number, page: number = 1, query?: string) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getPapers({
        journalId,
        page,
        query,
      })
    );
  };
}
