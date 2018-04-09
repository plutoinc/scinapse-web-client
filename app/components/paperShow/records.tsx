import { List } from "immutable";
import { TypedRecord, recordify, makeTypedFactory } from "typed-immutable-record";
import { PaperRecord, Paper, PaperFactory, PaperListFactory, PaperList } from "../../model/paper";
import { ICommentsRecord, recordifyComments, IComment } from "../../model/comment";

export interface RelatedPaperMeta {
  paperId: number | undefined;
  isAbstractOpen: boolean;
  isAuthorsOpen: boolean;
  isFirstOpen: boolean;
  isTitleVisited: boolean;
}

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

const initialPaperMetaState: RelatedPaperMeta = {
  paperId: null,
  isAbstractOpen: false,
  isAuthorsOpen: false,
  isFirstOpen: true,
  isTitleVisited: false,
};

export function makePaperMetaInitialState(paperId: number) {
  return { ...initialPaperMetaState, ...{ paperId } };
}

export interface RelatedPapersMetaList extends List<RelatedPaperMetaRecord> {}

export interface RelatedPaperMetaRecord extends TypedRecord<RelatedPaperMetaRecord>, RelatedPaperMeta {}

export const RelatedPaperMetaFactory = makeTypedFactory<RelatedPaperMeta, RelatedPaperMetaRecord>(
  initialPaperMetaState,
);

export const InitialRelatedPaperMetaFactory = (paperId: number): RelatedPaperMetaRecord => {
  return RelatedPaperMetaFactory(makePaperMetaInitialState(paperId));
};

export const RelatedPaperMetaListFactory = (rawRelatedPaperMetaArray: RelatedPaperMeta[]): RelatedPapersMetaList => {
  return List(rawRelatedPaperMetaArray.map(meta => RelatedPaperMetaFactory(meta)));
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
  isCitationDialogOpen: boolean;
  isDeletingComment: boolean;
  isPostingComment: boolean;
  isFailedToPostingComment: boolean;
  relatedPapers: Paper[];
  isLoadingRelatedPapers: boolean;
  isFailedToGetRelatedPapers: boolean;
  relatedPaperTotalPage: number;
  relatedPaperCurrentPage: number;
  relatedPapersMeta: RelatedPaperMeta[];
  activeCitationTab: AvailableCitationType;
  isFetchingCitationInformation: boolean;
  citationText: string;
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
  isCitationDialogOpen: boolean;
  isDeletingComment: boolean;
  isPostingComment: boolean;
  isFailedToPostingComment: boolean;
  relatedPapers: PaperList;
  isLoadingRelatedPapers: boolean;
  isFailedToGetRelatedPapers: boolean;
  relatedPaperTotalPage: number;
  relatedPaperCurrentPage: number;
  relatedPapersMeta: RelatedPapersMetaList;
  activeCitationTab: AvailableCitationType;
  isFetchingCitationInformation: boolean;
  citationText: string;
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
  isCitationDialogOpen: false,
  isDeletingComment: false,
  isPostingComment: false,
  isFailedToPostingComment: false,
  relatedPapers: [],
  isLoadingRelatedPapers: false,
  isFailedToGetRelatedPapers: false,
  relatedPaperTotalPage: 0,
  relatedPaperCurrentPage: 0,
  relatedPapersMeta: [],
  activeCitationTab: AvailableCitationType.BIBTEX,
  isFetchingCitationInformation: false,
  citationText: "",
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
    isCitationDialogOpen: params.isCitationDialogOpen,
    isDeletingComment: params.isDeletingComment,
    isPostingComment: params.isPostingComment,
    isFailedToPostingComment: params.isFailedToPostingComment,
    relatedPapers: PaperListFactory(params.relatedPapers || []),
    isLoadingRelatedPapers: params.isLoadingRelatedPapers,
    isFailedToGetRelatedPapers: params.isFailedToGetRelatedPapers,
    relatedPaperTotalPage: params.relatedPaperTotalPage,
    relatedPaperCurrentPage: params.relatedPaperCurrentPage,
    relatedPapersMeta: RelatedPaperMetaListFactory(params.relatedPapersMeta),
    activeCitationTab: params.activeCitationTab,
    isFetchingCitationInformation: params.isFetchingCitationInformation,
    citationText: params.citationText,
  });
};

export const PAPER_SHOW_INITIAL_STATE = PaperShowStateFactory();
