import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { PaperRecord, Paper, PaperFactory, PaperListFactory, PaperList } from "../../model/paper";
import { ICommentsRecord, recordifyComments, IComment } from "../../model/comment";

export interface RelatedPaperMeta {
  paperId: number | undefined;
  isAbstractOpen: boolean;
  isAuthorsOpen: boolean;
  isFirstOpen: boolean;
  isTitleVisited: boolean;
}

export interface RelatedPapersMetaList extends List<RelatedPaperMetaRecord> {}

export interface RelatedPaperMetaRecord extends TypedRecord<RelatedPaperMetaRecord>, RelatedPaperMeta {}

export const RelatedPaperMetaFactory = (paperId?: number): RelatedPaperMetaRecord => {
  return recordify({
    paperId,
    isAbstractOpen: false,
    isAuthorsOpen: false,
    isFirstOpen: true,
    isTitleVisited: false,
  });
};

export interface PaperShowState {
  isLoadingPaper: boolean;
  hasErrorOnFetchingPaper: boolean;
  isLoadingComments: boolean;
  hasErrorOnFetchingComments: boolean;
  currentCommentPage: number;
  commentTotalPage: number;
  paper: Paper | null;
  comments: IComment[] | null;
  commentInput: string;
  isDeletingComment: boolean;
  isPostingComment: boolean;
  isFailedToPostingComment: boolean;
  relatedPapers: Paper[];
  isLoadingRelatedPapers: boolean;
  isFailedToGetRelatedPapers: boolean;
  relatedPaperTotalPage: number;
  relatedPaperCurrentPage: number;
  relatedPapersMeta: RelatedPaperMeta[];
}

export interface InnerRecordifiedPaperShowState {
  isLoadingPaper: boolean;
  hasErrorOnFetchingPaper: boolean;
  isLoadingComments: boolean;
  hasErrorOnFetchingComments: boolean;
  currentCommentPage: number;
  commentTotalPage: number;
  paper: PaperRecord | null;
  comments: ICommentsRecord | null;
  commentInput: string;
  isDeletingComment: boolean;
  isPostingComment: boolean;
  isFailedToPostingComment: boolean;
  relatedPapers: PaperList;
  isLoadingRelatedPapers: boolean;
  isFailedToGetRelatedPapers: boolean;
  relatedPaperTotalPage: number;
  relatedPaperCurrentPage: number;
  relatedPapersMeta: RelatedPapersMetaList;
}

export interface PaperShowStateRecord extends TypedRecord<PaperShowStateRecord>, InnerRecordifiedPaperShowState {}

export const initialPaperShowState: PaperShowState = {
  isLoadingPaper: false,
  hasErrorOnFetchingPaper: false,
  paper: null,
  isLoadingComments: false,
  hasErrorOnFetchingComments: false,
  currentCommentPage: 0,
  commentTotalPage: 0,
  comments: [],
  commentInput: "",
  isDeletingComment: false,
  isPostingComment: false,
  isFailedToPostingComment: false,
  relatedPapers: [],
  isLoadingRelatedPapers: false,
  isFailedToGetRelatedPapers: false,
  relatedPaperTotalPage: 0,
  relatedPaperCurrentPage: 0,
  relatedPapersMeta: [],
};

export const PaperShowStateFactory = (params: PaperShowState = initialPaperShowState): PaperShowStateRecord => {
  return recordify({
    isLoadingPaper: params.isLoadingPaper,
    hasErrorOnFetchingPaper: params.hasErrorOnFetchingPaper,
    hasErrorOnFetchingComments: params.hasErrorOnFetchingComments,
    paper: PaperFactory(params.paper || null),
    isLoadingComments: params.isLoadingComments,
    currentCommentPage: params.currentCommentPage || 0,
    commentTotalPage: params.commentTotalPage || 0,
    comments: recordifyComments(params.comments || null),
    commentInput: params.commentInput,
    isDeletingComment: params.isDeletingComment,
    isPostingComment: params.isPostingComment,
    isFailedToPostingComment: params.isFailedToPostingComment,
    relatedPapers: PaperListFactory(params.relatedPapers || []),
    isLoadingRelatedPapers: params.isLoadingRelatedPapers,
    isFailedToGetRelatedPapers: params.isFailedToGetRelatedPapers,
    relatedPaperTotalPage: params.relatedPaperTotalPage,
    relatedPaperCurrentPage: params.relatedPaperCurrentPage,
    relatedPapersMeta: List(params.relatedPapersMeta),
  });
};

export const PAPER_SHOW_INITIAL_STATE = PaperShowStateFactory();
