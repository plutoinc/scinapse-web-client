import axios from "axios";
import { LoadDataParams } from "../../routes";
import { CurrentUser } from "../../model/currentUser";
import { AuthorShowMatchParams } from "../unconnectedAuthorShow";
import { reFetchAuthorShowRelevantData } from "../../actions/author";

export async function fetchAuthorShowPageData(
  params: LoadDataParams<AuthorShowMatchParams>,
  currentUser?: CurrentUser
) {
  const { dispatch, match } = params;
  const authorId = parseInt(match.params.authorId, 10);

  await dispatch(
    reFetchAuthorShowRelevantData({
      authorId,
      currentUser,
      cancelToken: axios.CancelToken.source().token,
    })
  );
}
