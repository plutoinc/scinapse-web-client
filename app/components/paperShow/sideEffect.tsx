import { Dispatch } from "react-redux";
import { LoadDataParams } from "../../routes";
import {
  getPaper,
  getComments,
  getCitedPapers,
  getReferencePapers,
  getBookmarkedStatus,
  getRelatedPapers,
  getOtherPapers
} from "./actions";
import { CurrentUser } from "../../model/currentUser";
import { PaperShowPageQueryParams, PaperShowMatchParams } from ".";

export async function fetchPaperShowData(
  params: LoadDataParams<PaperShowMatchParams>,
  currentUser?: CurrentUser
) {
  const { dispatch, match } = params;
  const paperId = parseInt(match.params.paperId, 10);
  const queryParamsObject: PaperShowPageQueryParams = params.queryParams
    ? params.queryParams
    : { "cited-page": 1, "ref-page": 1 };

  try {
    const promiseArray = [];
    const isVerifiedUser =
      currentUser &&
      currentUser.isLoggedIn &&
      (currentUser.oauthLoggedIn || currentUser.emailVerified);
    promiseArray.push(
      dispatch(getPaper({ paperId })).then(async paper => {
        if (paper && paper.authors && paper.authors.length > 0) {
          const targetAuthor = paper.authors[0];
          await dispatch(
            getOtherPapers({ paperId, authorId: targetAuthor.id })
          );
        }

        if (paper && isVerifiedUser) {
          await dispatch(getBookmarkedStatus(paper));
        }
      })
    );
    promiseArray.push(dispatch(getComments({ paperId, page: 1 })));
    promiseArray.push(dispatch(getRelatedPapers({ paperId })));
    promiseArray.push(
      dispatch(fetchCitedPaperData(paperId, queryParamsObject["cited-page"]))
    );
    promiseArray.push(
      dispatch(fetchRefPaperData(paperId, queryParamsObject["ref-page"]))
    );

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
        filter: "year=:,if=:"
      })
    );
  };
}

export function fetchRefPaperData(paperId: number, page: number = 1) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getReferencePapers({
        paperId,
        page,
        filter: "year=:,if=:"
      })
    );
  };
}
