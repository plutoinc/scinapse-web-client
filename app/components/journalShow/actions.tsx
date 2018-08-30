import { Dispatch } from "react-redux";
import JournalAPI, { GetPapersParams } from "../../api/journal";
import { ActionCreators } from "../../actions/actionTypes";
import alertToast from "../../helpers/makePlutoToastAction";

export function getJournal(journalId: number) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetJournal());
      const journal = await JournalAPI.getJournal(journalId);
      dispatch(ActionCreators.addEntity(journal));
      dispatch(
        ActionCreators.succeededToGetJournal({
          journalId: journal.result,
        })
      );
    } catch (err) {
      alertToast({
        type: "error",
        message: err.message || "Failed to get journal data",
      });
      dispatch(ActionCreators.failedToGetJournal());
    }
  };
}

export function getPapers(params: GetPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetJournalPapers());
      const res = await JournalAPI.getPapers(params);
      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToGetJournalPapers({
          paperIds: res.result,
          totalPage: res.totalPages,
          currentPage: res.number,
          paperCount: res.numberOfElements,
        })
      );
    } catch (err) {
      alertToast({
        type: "error",
        message: err.message || "Failed to get journal's papers",
      });
      dispatch(ActionCreators.failedToGetJournalPapers());
    }
  };
}
