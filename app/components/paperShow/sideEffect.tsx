import { LoadDataParams } from "../../routes";
import {
  getPaper,
  getComments,
  getCitationText,
  getCitedPapers,
  getReferencePapers,
  getBookmarkedStatus,
} from "./actions";
import { CurrentUserRecord } from "../../model/currentUser";
import { getBookmarkedStatus as getBookmarkedStatusList } from "../../actions/bookmark";
import { AvailableCitationType } from "./records";
import { Dispatch } from "react-redux";

export async function fetchPaperShowData(params: LoadDataParams, currentUser: CurrentUserRecord) {
  const { dispatch, match } = params;
  const paperId = parseInt(match.params.paperId, 10);

  try {
    const paper = await dispatch(getPaper({ paperId }));
    const promiseArray = [];

    promiseArray.push(dispatch(getComments({ paperId: paper.id, page: 0 })));

    if (paper.doi) {
      promiseArray.push(dispatch(getCitationText({ type: AvailableCitationType.BIBTEX, paperId: paper.id })));
    }

    // TODO: Get page from queryParams
    const referencePapers = await dispatch(fetchReferencePapers(paper.id, 0));
    if (currentUser && currentUser.isLoggedIn) {
      promiseArray.push(dispatch(getBookmarkedStatus(paper)));
      if (referencePapers && !referencePapers.isEmpty()) {
        promiseArray.push(dispatch(getBookmarkedStatusList(referencePapers)));
      }
    }

    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching paper show page data in server`, err);
  }
}

function fetchReferencePapers(paperId: number, page: number = 0) {
  return async (dispatch: Dispatch<any>) => {
    const citedPapers = await dispatch(
      getCitedPapers({
        paperId,
        page,
        filter: "year=:,if=:",
      }),
    );

    const refPapers = await dispatch(
      getReferencePapers({
        paperId,
        page,
        filter: "year=:,if=:",
      }),
    );

    return citedPapers.concat(refPapers).toList();
  };
}
