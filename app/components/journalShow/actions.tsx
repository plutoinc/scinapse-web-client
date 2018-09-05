import { Dispatch } from "react-redux";
import JournalAPI, { GetPapersParams } from "../../api/journal";
import { ActionCreators } from "../../actions/actionTypes";
import alertToast from "../../helpers/makePlutoToastAction";
import PlutoAxios from "../../api/pluto";

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
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: "error",
        message: error.message,
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
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: "error",
        message: error.message,
      });
      dispatch(ActionCreators.failedToGetJournalPapers());
    }
  };
}
