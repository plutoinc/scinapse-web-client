import { TypedRecord, recordify } from "typed-immutable-record";
import { PaperRecord, Paper, PaperFactory } from "../../model/paper";
import { ICommentsRecord, recordifyComments, IComment } from "../../model/comment";

export interface PaperShowState {
  isLoadingPaper: boolean;
  hasErrorOnFetchingPaper: boolean;
  isLoadingComments: boolean;
  currentCommentPage: number;
  currentTotalPage: number;
  paper: Paper | null;
  comments: IComment[] | null;
}

export interface InnerRecordifiedPaperShowState {
  isLoadingPaper: boolean;
  hasErrorOnFetchingPaper: boolean;
  isLoadingComments: boolean;
  currentCommentPage: number;
  currentTotalPage: number;
  paper: PaperRecord | null;
  comments: ICommentsRecord | null;
}

export interface PaperShowStateRecord extends TypedRecord<PaperShowStateRecord>, InnerRecordifiedPaperShowState {}

export const initialPaperShowState: PaperShowState = {
  isLoadingPaper: false,
  hasErrorOnFetchingPaper: false,
  paper: null,
  isLoadingComments: false,
  currentCommentPage: 0,
  currentTotalPage: 0,
  comments: null,
};

export const PaperShowStateFactory = (params: PaperShowState = initialPaperShowState): PaperShowStateRecord => {
  return recordify({
    isLoadingPaper: params.isLoadingPaper,
    hasErrorOnFetchingPaper: params.hasErrorOnFetchingPaper,
    paper: PaperFactory(params.paper || null),
    isLoadingComments: params.isLoadingComments,
    currentCommentPage: params.currentCommentPage || 0,
    currentTotalPage: params.currentTotalPage || 0,
    comments: recordifyComments(params.comments || null),
  });
};

export const PAPER_SHOW_INITIAL_STATE = PaperShowStateFactory();
