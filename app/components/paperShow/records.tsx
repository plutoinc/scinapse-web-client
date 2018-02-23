import { TypedRecord, recordify } from "typed-immutable-record";
import { PaperRecord, Paper, PaperFactory } from "../../model/paper";

export interface PaperShowState {
  isLoadingPaper: boolean;
  hasErrorOnFetchingPaper: boolean;
  paper: Paper | null;
}

export interface InnerRecordifiedPaperShowState {
  isLoadingPaper: boolean;
  hasErrorOnFetchingPaper: boolean;
  paper: PaperRecord | null;
}

export interface PaperShowStateRecord extends TypedRecord<PaperShowStateRecord>, InnerRecordifiedPaperShowState {}

export const initialPaperShowState: PaperShowState = {
  isLoadingPaper: false,
  hasErrorOnFetchingPaper: false,
  paper: null,
};

export const PaperShowStateFactory = (params: PaperShowState = initialPaperShowState): PaperShowStateRecord => {
  return recordify({
    isLoadingPaper: params.isLoadingPaper,
    hasErrorOnFetchingPaper: params.hasErrorOnFetchingPaper,
    paper: PaperFactory(params.paper),
  });
};

export const PAPER_SHOW_INITIAL_STATE = PaperShowStateFactory();
