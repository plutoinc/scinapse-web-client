import { TypedRecord, recordify } from "typed-immutable-record";
import { CommentsRecord, recordifyComments, Comment } from "../../model/comment";

export enum AvailableCitationType {
  BIBTEX,
  RIS,
  APA,
  MLA,
  IEEE,
  HARVARD,
  VANCOUVER,
  CHICAGO,
}

export interface PaperShowState {
  isAuthorBoxExtended: boolean;
  isLoadingPaper: boolean;
  hasErrorOnFetchingPaper: boolean;
  isLoadingComments: boolean;
  hasErrorOnFetchingComments: boolean;
  currentCommentPage: number;
  commentTotalPage: number;
  paperId: number;
  commentInput: string;
  isCitationDialogOpen: boolean;
  isDeletingComment: boolean;
  isPostingComment: boolean;
  isFailedToPostingComment: boolean;

  relatedPaperIds: number[];
  otherPaperIds: number[];
  referencePaperIds: number[];
  citedPaperIds: number[];
  comments: Comment[] | null;

  isLoadingReferencePapers: boolean;
  isFailedToGetReferencePapers: boolean;
  referencePaperTotalPage: number;
  referencePaperCurrentPage: number;
  isLoadingCitedPapers: boolean;
  isFailedToGetCitedPapers: boolean;
  citedPaperTotalPage: number;
  citedPaperCurrentPage: number;
  activeCitationTab: AvailableCitationType;
  isFetchingCitationInformation: boolean;
  citationText: string;
  isBookmarked: boolean;
}

export interface InnerRecordifiedPaperShowState {
  isAuthorBoxExtended: boolean;
  isLoadingPaper: boolean;
  hasErrorOnFetchingPaper: boolean;
  isLoadingComments: boolean;
  hasErrorOnFetchingComments: boolean;
  currentCommentPage: number;
  commentTotalPage: number;
  paperId: number;
  comments: CommentsRecord;
  commentInput: string;
  isCitationDialogOpen: boolean;
  isDeletingComment: boolean;
  isPostingComment: boolean;
  isFailedToPostingComment: boolean;

  relatedPaperIds: number[];
  otherPaperIds: number[];

  referencePaperIds: number[];
  isLoadingReferencePapers: boolean;
  isFailedToGetReferencePapers: boolean;
  referencePaperTotalPage: number;
  referencePaperCurrentPage: number;

  citedPaperIds: number[];
  isLoadingCitedPapers: boolean;
  isFailedToGetCitedPapers: boolean;
  citedPaperTotalPage: number;
  citedPaperCurrentPage: number;

  activeCitationTab: AvailableCitationType;
  isFetchingCitationInformation: boolean;
  citationText: string;
  isBookmarked: boolean;
}

export interface PaperShowStateRecord extends TypedRecord<PaperShowStateRecord>, InnerRecordifiedPaperShowState {}

export const initialPaperShowState: PaperShowState = {
  isAuthorBoxExtended: false,
  isLoadingPaper: false,
  hasErrorOnFetchingPaper: false,
  paperId: 0,
  isLoadingComments: false,
  hasErrorOnFetchingComments: false,
  currentCommentPage: 0,
  commentTotalPage: 0,
  comments: [],
  commentInput: "",
  isCitationDialogOpen: false,
  isDeletingComment: false,
  isPostingComment: false,
  isFailedToPostingComment: false,

  relatedPaperIds: [],
  otherPaperIds: [],

  referencePaperIds: [],
  isLoadingReferencePapers: false,
  isFailedToGetReferencePapers: false,
  referencePaperTotalPage: 0,
  referencePaperCurrentPage: 0,

  citedPaperIds: [],
  isLoadingCitedPapers: false,
  isFailedToGetCitedPapers: false,
  citedPaperTotalPage: 0,
  citedPaperCurrentPage: 0,

  activeCitationTab: AvailableCitationType.BIBTEX,
  isFetchingCitationInformation: false,
  citationText: "",
  isBookmarked: false,
};

export const PaperShowStateFactory = (params: PaperShowState = initialPaperShowState): PaperShowStateRecord => {
  return recordify({
    isAuthorBoxExtended: params.isAuthorBoxExtended,
    isLoadingPaper: params.isLoadingPaper,
    hasErrorOnFetchingPaper: params.hasErrorOnFetchingPaper,
    hasErrorOnFetchingComments: params.hasErrorOnFetchingComments,
    paperId: params.paperId,
    isLoadingComments: params.isLoadingComments,
    currentCommentPage: params.currentCommentPage || 0,
    commentTotalPage: params.commentTotalPage || 0,
    comments: recordifyComments(params.comments || null),
    commentInput: params.commentInput,
    isCitationDialogOpen: params.isCitationDialogOpen,
    isDeletingComment: params.isDeletingComment,
    isPostingComment: params.isPostingComment,
    isFailedToPostingComment: params.isFailedToPostingComment,

    relatedPaperIds: params.relatedPaperIds,
    otherPaperIds: params.otherPaperIds,

    referencePaperIds: params.referencePaperIds,
    isLoadingReferencePapers: params.isLoadingReferencePapers,
    isFailedToGetReferencePapers: params.isFailedToGetReferencePapers,
    referencePaperTotalPage: params.referencePaperTotalPage,
    referencePaperCurrentPage: params.referencePaperCurrentPage,

    citedPaperIds: params.citedPaperIds,
    isLoadingCitedPapers: params.isLoadingCitedPapers,
    isFailedToGetCitedPapers: params.isFailedToGetCitedPapers,
    citedPaperTotalPage: params.citedPaperTotalPage,
    citedPaperCurrentPage: params.citedPaperCurrentPage,

    activeCitationTab: params.activeCitationTab,
    isFetchingCitationInformation: params.isFetchingCitationInformation,
    citationText: params.citationText,
    isBookmarked: params.isBookmarked,
  });
};

export const PAPER_SHOW_INITIAL_STATE = PaperShowStateFactory();
