import { CancelToken } from "axios";
import { Dispatch } from "react-redux";
import { LoadDataParams } from "../../routes";
import { getPaper, getCitedPapers, getReferencePapers, getMyCollections } from "../../actions/paperShow";
import { CurrentUser } from "../../model/currentUser";
import { PaperShowPageQueryParams, PaperShowMatchParams } from "./types";
import { ActionCreators } from "../../actions/actionTypes";

export async function fetchPaperShowData(params: LoadDataParams<PaperShowMatchParams>, currentUser?: CurrentUser) {
  const { dispatch, match } = params;
  const paperId = parseInt(match.params.paperId, 10);
  const queryParamsObject: PaperShowPageQueryParams = params.queryParams
    ? params.queryParams
    : { "cited-page": 1, "ref-page": 1 };

  if (isNaN(paperId)) {
    return dispatch(ActionCreators.failedToGetPaper({ statusCode: 400 }));
  }

  try {
    const promiseArray = [];

    promiseArray.push(dispatch(getPaper({ paperId, cancelToken: params.cancelToken })));
    promiseArray.push(dispatch(fetchCitedPaperData(paperId, queryParamsObject["cited-page"], params.cancelToken)));
    promiseArray.push(dispatch(fetchRefPaperData(paperId, queryParamsObject["ref-page"], params.cancelToken)));

    if (currentUser && currentUser.isLoggedIn) {
      promiseArray.push(dispatch(fetchMyCollection(paperId, params.cancelToken)));
    }

    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching paper show page data`, err);
  }
}

export function fetchMyCollection(paperId: number, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(getMyCollections(paperId, cancelToken));
  };
}

export function fetchCitedPaperData(paperId: number, page: number = 1, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getCitedPapers({
        paperId,
        page,
        filter: "year=:,if=:",
        cancelToken,
      })
    );
  };
}

export function fetchRefPaperData(paperId: number, page: number = 1, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getReferencePapers({
        paperId,
        page,
        filter: "year=:,if=:",
        cancelToken,
      })
    );
  };
}
