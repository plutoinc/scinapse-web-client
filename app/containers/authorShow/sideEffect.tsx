import { LoadDataParams } from "../../routes";
import { CurrentUser } from "../../model/currentUser";
import { getAuthor, getCoAuthors, getAuthorPapers } from "../../components/authorShow/actions";
import { AuthorShowMatchParams } from "../../components/authorShow";
import { DEFAULT_AUTHOR_PAPERS_SIZE } from "../../api/author";
import { Dispatch } from "react-redux";
import { ActionCreators } from "../../actions/actionTypes";
import { GetAuthorPapersParams } from "../../api/author/types";

export async function fetchAuthorShowPageData(
  params: LoadDataParams<AuthorShowMatchParams>,
  _currentUser?: CurrentUser
) {
  const { dispatch, match } = params;
  const authorId = parseInt(match.params.authorId, 10);
  const promiseArray = [];

  try {
    dispatch(ActionCreators.startToLoadAuthorShowPageData());

    promiseArray.push(dispatch(getAuthor(authorId)));
    promiseArray.push(dispatch(getCoAuthors(authorId)));
    promiseArray.push(
      dispatch(
        fetchAuthorPapers({
          authorId,
          size: DEFAULT_AUTHOR_PAPERS_SIZE,
          page: 1,
          sort: "MOST_CITATIONS",
        })
      )
    );

    await Promise.all(promiseArray);
    dispatch(ActionCreators.finishToLoadAuthorShowPageData());
  } catch (err) {
    console.error(`Error for fetching author show page data`, err);
  }
}

export function fetchAuthorPapers(params: GetAuthorPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getAuthorPapers({
        authorId: params.authorId,
        size: params.size,
        page: params.page,
        sort: params.sort,
      })
    );
  };
}
