import { LoadDataParams } from "../../routes";
import {
  getPaper,
  getComments,
  getCitedPapers,
  getReferencePapers,
  getBookmarkedStatus,
  getRelatedPapers,
  getOtherPapers,
} from "./actions";
import { CurrentUserRecord } from "../../model/currentUser";
import { getBookmarkedStatus as getBookmarkedStatusList } from "../../actions/bookmark";
import { Dispatch } from "react-redux";

export async function fetchPaperShowData(params: LoadDataParams, currentUser: CurrentUserRecord) {
  const { dispatch, match } = params;
  const paperId = parseInt(match.params.paperId, 10);

  try {
    const paper = await dispatch(getPaper({ paperId }));
    const promiseArray = [];

    promiseArray.push(dispatch(getComments({ paperId: paper.id, page: 1 })));
    promiseArray.push(dispatch(getRelatedPapers({ paperId: paper.id })));

    if (paper.authors && paper.authors.count() > 0) {
      const targetAuthor = paper.authors.get(0);
      promiseArray.push(dispatch(getOtherPapers({ paperId: paper.id, authorId: targetAuthor.id })));
    }

    // TODO: Get page from queryParams
    const referencePapers = await dispatch(fetchReferencePapers(paper.id, 1));

    if (currentUser && currentUser.isLoggedIn) {
      promiseArray.push(dispatch(getBookmarkedStatus(paper)));
      if (referencePapers && !referencePapers.isEmpty()) {
        promiseArray.push(dispatch(getBookmarkedStatusList(referencePapers)));
      }
    }

    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching paper show page data`, err);
  }
}

function fetchReferencePapers(paperId: number, page: number = 1) {
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
