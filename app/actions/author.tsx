import axios, { CancelToken } from "axios";
import { normalize } from "normalizr";
import { Dispatch } from "react-redux";
import { ActionCreators } from "./actionTypes";
import AuthorAPI, { ConnectAuthorParams, DEFAULT_AUTHOR_PAPERS_SIZE } from "../api/author";
import { Paper, paperSchema } from "../model/paper";
import PlutoAxios from "../api/pluto";
import alertToast from "../helpers/makePlutoToastAction";
import { GLOBAL_DIALOG_TYPE } from "../components/dialog/reducer";
import { getAuthor, getCoAuthors, getAuthorPapers } from "../containers/unconnectedAuthorShow/actions";
import { GetAuthorPapersParams } from "../api/author/types";
import { CurrentUser } from "../model/currentUser";
import { AUTHOR_PAPER_LIST_SORT_TYPES } from "../components/common/sortBox";

interface AddRemovePapersAndFetchPapersParams {
  authorId: number;
  papers: Paper[];
  currentUser: CurrentUser;
  cancelToken: CancelToken;
}

interface ReFetchAuthorShowRelevantDataParams {
  authorId: number;
  cancelToken: CancelToken;
  currentUser?: CurrentUser;
  page?: number;
  sort?: AUTHOR_PAPER_LIST_SORT_TYPES;
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

export function reFetchAuthorShowRelevantData(params: ReFetchAuthorShowRelevantDataParams) {
  return async (dispatch: Dispatch<any>) => {
    const { currentUser, authorId, cancelToken } = params;

    try {
      dispatch(ActionCreators.startToLoadAuthorShowPageData());

      const isMine =
        currentUser && currentUser.isLoggedIn && currentUser.is_author_connected && currentUser.author_id === authorId;
      const promiseArr = [];
      promiseArr.push(dispatch(getAuthor(authorId, cancelToken)));
      promiseArr.push(dispatch(getCoAuthors(authorId, cancelToken)));
      promiseArr.push(
        dispatch(
          fetchAuthorPapers({
            authorId,
            size: DEFAULT_AUTHOR_PAPERS_SIZE,
            page: params.page ? params.page : 1,
            sort: isMine ? "RECENTLY_ADDED" : "NEWEST_FIRST",
            cancelToken: params.cancelToken,
          })
        )
      );

      await Promise.all(promiseArr);
      dispatch(ActionCreators.finishToLoadAuthorShowPageData());
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error(`Error for fetching author show page data`, err);
      }
    }
  };
}

export function updateAuthor(params: ConnectAuthorParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToUpdateProfileData());

    const authorResponse = await AuthorAPI.updateAuthor(params);

    dispatch(ActionCreators.addEntity(authorResponse));
    dispatch(ActionCreators.succeededToUpdateProfileData());
  };
}

function addPaperToAuthorPaperList(authorId: number, papers: Paper[], cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    const paperIds = papers.map(paper => paper.id);
    dispatch(ActionCreators.startToAddPaperToAuthorPaperList());

    await AuthorAPI.addPapersToAuthorPaperList(authorId, paperIds, cancelToken);

    // HACK: you should normalize papers in API level
    const normalizedPapers = normalize(papers, [paperSchema]);
    dispatch(ActionCreators.addEntity(normalizedPapers));
    dispatch(ActionCreators.succeededToAddPaperToAuthorPaperList());
  };
}

export function addPapersAndFetchPapers(params: AddRemovePapersAndFetchPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      await dispatch(addPaperToAuthorPaperList(params.authorId, params.papers, params.cancelToken));
      await dispatch(
        reFetchAuthorShowRelevantData({
          authorId: params.authorId,
          currentUser: params.currentUser,
          cancelToken: params.cancelToken,
        })
      );
    } catch (err) {
      dispatch(ActionCreators.failedToAddPaperToAuthorPaperList());
    }
  };
}

export function removePaperFromPaperList(params: AddRemovePapersAndFetchPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    const paper = params.papers[0];

    try {
      await AuthorAPI.removeAuthorPapers(params.authorId, [paper.id]);
      await dispatch(
        reFetchAuthorShowRelevantData({
          authorId: params.authorId,
          currentUser: params.currentUser,
          cancelToken: params.cancelToken,
        })
      );
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      alertToast({
        type: "error",
        message: "Had an error to remove publication",
      });
    }
  };
}

export function openAddPublicationsToAuthorDialog() {
  return ActionCreators.openGlobalDialog({ type: GLOBAL_DIALOG_TYPE.ADD_PUBLICATIONS_TO_AUTHOR_DIALOG });
}

export function updateRepresentativePapers(authorId: number, papers: Paper[]) {
  return async (dispatch: Dispatch<any>) => {
    await AuthorAPI.updateRepresentativePapers({
      authorId,
      paperIds: papers.map(paper => paper.id),
    });

    dispatch(
      ActionCreators.succeedToUpdateAuthorRepresentativePapers({
        authorId,
        papers,
      })
    );
  };
}
