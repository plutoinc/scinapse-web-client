import { Dispatch } from "react-redux";
import { LoadDataParams } from "../../routes";
import {
  getPaper,
  getComments,
  getCitedPapers,
  getReferencePapers,
  // getBookmarkedStatus,
  getRelatedPapers,
  // getOtherPapers,
} from "./actions";
// import { CurrentUserRecord } from "../../model/currentUser";
import { PaperShowPageQueryParams, PaperShowMatchParams } from ".";

export async function fetchPaperShowData(
  params: LoadDataParams<PaperShowMatchParams>,
  // currentUser?: CurrentUserRecord,
) {
  const { dispatch, match } = params;
  const paperId = parseInt(match.params.paperId, 10);
  const queryParamsObject: PaperShowPageQueryParams = params.queryParams
    ? params.queryParams
    : { "cited-page": 1, "ref-page": 1 };

  try {
    const promiseArray = [];
    promiseArray.push(dispatch(getPaper({ paperId })));
    promiseArray.push(dispatch(getComments({ paperId, page: 1 })));
    promiseArray.push(dispatch(getRelatedPapers({ paperId })));

    // if (paper.authors && paper.authors.count() > 0) {
    //   const targetAuthor = paper.authors.get(0);
    //   promiseArray.push(dispatch(getOtherPapers({ paperId, authorId: targetAuthor!.id })));
    // }

    promiseArray.push(dispatch(fetchCitedPaperData(paperId, queryParamsObject["cited-page"])));
    promiseArray.push(dispatch(fetchRefPaperData(paperId, queryParamsObject["ref-page"])));
    // const isVerifiedUser =
    //   currentUser && currentUser.isLoggedIn && (currentUser.oauthLoggedIn || currentUser.emailVerified);
    // if (isVerifiedUser) {
    //   promiseArray.push(dispatch(getBookmarkedStatus(paper)));
    // }

    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching paper show page data`, err);
  }
}

export function fetchCitedPaperData(paperId: number, page: number = 1) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getCitedPapers({
        paperId,
        page,
        filter: "year=:,if=:",
      }),
    );
  };
}

export function fetchRefPaperData(paperId: number, page: number = 1) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getReferencePapers({
        paperId,
        page,
        filter: "year=:,if=:",
      }),
    );
  };
}
