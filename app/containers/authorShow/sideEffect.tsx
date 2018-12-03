import axios from "axios";
import { Dispatch } from "react-redux";
import { LoadDataParams } from "../../routes";
import { CurrentUser } from "../../model/currentUser";
import { getAuthor, getCoAuthors, getAuthorPapers } from "../unconnectedAuthorShow/actions";
import { AuthorShowMatchParams } from "../unconnectedAuthorShow";
import { DEFAULT_AUTHOR_PAPERS_SIZE } from "../../api/author";
import { ActionCreators } from "../../actions/actionTypes";
import { GetAuthorPapersParams } from "../../api/author/types";

export async function fetchAuthorShowPageData(
  params: LoadDataParams<AuthorShowMatchParams>,
  currentUser?: CurrentUser
) {
  const { dispatch, match } = params;
  const authorId = parseInt(match.params.authorId, 10);
  const isMine =
    currentUser && currentUser.isLoggedIn && currentUser.is_author_connected && currentUser.author_id === authorId;
  const promiseArray = [];

  try {
    dispatch(ActionCreators.startToLoadAuthorShowPageData());

    promiseArray.push(dispatch(getAuthor(authorId, params.cancelToken)));
    promiseArray.push(dispatch(getCoAuthors(authorId, params.cancelToken)));
    promiseArray.push(
      dispatch(
        fetchAuthorPapers({
          authorId,
          size: DEFAULT_AUTHOR_PAPERS_SIZE,
          page: 1,
          sort: isMine ? "RECENTLY_UPDATED" : "NEWEST_FIRST",
          cancelToken: params.cancelToken,
        })
      )
    );

    await Promise.all(promiseArray);
    dispatch(ActionCreators.finishToLoadAuthorShowPageData());
  } catch (err) {
    if (!axios.isCancel(err)) {
      console.error(`Error for fetching author show page data`, err);
    }
  }
}

export function fetchAuthorPapers(params: GetAuthorPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getAuthorPapers({
        authorId: params.authorId,
        query: params.query,
        size: params.size,
        page: params.page,
        sort: params.sort,
        cancelToken: params.cancelToken,
      })
    );
  };
}
