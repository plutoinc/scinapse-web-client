import { Dispatch } from "react-redux";
import { LoadDataParams } from "../../routes";
import {
  getPaper,
  getCitedPapers,
  getReferencePapers,
  getRelatedPapers,
  getMyCollections,
} from "../../actions/paperShow";
import { CurrentUser } from "../../model/currentUser";
import { PaperShowPageQueryParams, PaperShowMatchParams } from ".";

export async function fetchPaperShowData(params: LoadDataParams<PaperShowMatchParams>, currentUser?: CurrentUser) {
  const { dispatch, match } = params;
  const paperId = parseInt(match.params.paperId, 10);
  const queryParamsObject: PaperShowPageQueryParams = params.queryParams
    ? params.queryParams
    : { "cited-page": 1, "ref-page": 1 };

  try {
    const promiseArray = [];

    promiseArray.push(dispatch(getPaper({ paperId })));
    promiseArray.push(dispatch(getRelatedPapers({ paperId })));
    promiseArray.push(dispatch(fetchCitedPaperData(paperId, queryParamsObject["cited-page"])));
    promiseArray.push(dispatch(fetchRefPaperData(paperId, queryParamsObject["ref-page"])));

    if (currentUser && currentUser.isLoggedIn) {
      promiseArray.push(dispatch(fetchMyCollection(paperId)));
    }

    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching paper show page data`, err);
  }
}

export function fetchMyCollection(paperId: number) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(getMyCollections(paperId));
  };
}

export function fetchCitedPaperData(paperId: number, page: number = 1) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getCitedPapers({
        paperId,
        page,
        filter: "year=:,if=:",
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
        filter: "year=:,if=:",
      })
    );
  };
}
