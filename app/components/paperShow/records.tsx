import { List } from "immutable";
import { TypedRecord, recordify, makeTypedFactory } from "typed-immutable-record";
import { PaperRecord, Paper, PaperFactory, PaperListFactory, PaperList } from "../../model/paper";
import { ICommentsRecord, recordifyComments, IComment } from "../../model/comment";

export interface ReferencePaperMeta {
  paperId: number | undefined;
  isAuthorsOpen: boolean;
  isTitleVisited: boolean;
  isBookmarked: boolean;
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

const initialPaperMetaState: ReferencePaperMeta = {
  paperId: undefined,
  isAuthorsOpen: false,
  isTitleVisited: false,
  isBookmarked: false,
};

export function makePaperMetaInitialState(paperId: number) {
  return { ...initialPaperMetaState, ...{ paperId } };
}

export interface ReferencePapersMetaList extends List<ReferencePaperMetaRecord> {}

export interface ReferencePaperMetaRecord extends TypedRecord<ReferencePaperMetaRecord>, ReferencePaperMeta {}

export const ReferencePaperMetaFactory = makeTypedFactory<ReferencePaperMeta, ReferencePaperMetaRecord>(
  initialPaperMetaState,
);

export const InitialReferencePaperMetaFactory = (paperId: number): ReferencePaperMetaRecord => {
  return ReferencePaperMetaFactory(makePaperMetaInitialState(paperId));
};

export const ReferencePaperMetaListFactory = (
  rawReferencePaperMetaArray: ReferencePaperMeta[],
): ReferencePapersMetaList => {
  return List(rawReferencePaperMetaArray.map(meta => ReferencePaperMetaFactory(meta)));
};

export interface PaperShowState {
  isAuthorBoxExtended: boolean;
  isLoadingPaper: boolean;
  hasErrorOnFetchingPaper: boolean;
  isLoadingComments: boolean;
  hasErrorOnFetchingComments: boolean;
  currentCommentPage: number;
  commentTotalPage: number;
  paper: Paper | undefined;
  comments: IComment[] | null;
  commentInput: string;
  isCitationDialogOpen: boolean;
  isDeletingComment: boolean;
  isPostingComment: boolean;
  isFailedToPostingComment: boolean;

  relatedPapers: Paper[];
  otherPapers: Paper[];

  referencePapers: Paper[];
  isLoadingReferencePapers: boolean;
  isFailedToGetReferencePapers: boolean;
  referencePaperTotalPage: number;
  referencePaperCurrentPage: number;
  referencePapersMeta: ReferencePaperMeta[];

  citedPapers: Paper[];
  isLoadingCitedPapers: boolean;
  isFailedToGetCitedPapers: boolean;
  citedPaperTotalPage: number;
  citedPaperCurrentPage: number;
  citedPapersMeta: ReferencePaperMeta[];

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
  paper: PaperRecord | null;
  comments: ICommentsRecord;
  commentInput: string;
  isCitationDialogOpen: boolean;
  isDeletingComment: boolean;
  isPostingComment: boolean;
  isFailedToPostingComment: boolean;

  relatedPapers: PaperList;
  otherPapers: PaperList;

  referencePapers: PaperList;
  isLoadingReferencePapers: boolean;
  isFailedToGetReferencePapers: boolean;
  referencePaperTotalPage: number;
  referencePaperCurrentPage: number;
  referencePapersMeta: ReferencePapersMetaList;

  citedPapers: PaperList;
  isLoadingCitedPapers: boolean;
  isFailedToGetCitedPapers: boolean;
  citedPaperTotalPage: number;
  citedPaperCurrentPage: number;
  citedPapersMeta: ReferencePapersMetaList;

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
  paper: undefined,
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
  otherPapers: [],

  referencePapers: [],
  isLoadingReferencePapers: false,
  isFailedToGetReferencePapers: false,
  referencePaperTotalPage: 0,
  referencePaperCurrentPage: 0,
  referencePapersMeta: [],

  citedPapers: [],
  isLoadingCitedPapers: false,
  isFailedToGetCitedPapers: false,
  citedPaperTotalPage: 0,
  citedPaperCurrentPage: 0,
  citedPapersMeta: [],

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
    otherPapers: PaperListFactory(params.otherPapers || []),

    referencePapers: PaperListFactory(params.referencePapers || []),
    isLoadingReferencePapers: params.isLoadingReferencePapers,
    isFailedToGetReferencePapers: params.isFailedToGetReferencePapers,
    referencePaperTotalPage: params.referencePaperTotalPage,
    referencePaperCurrentPage: params.referencePaperCurrentPage,
    referencePapersMeta: ReferencePaperMetaListFactory(params.referencePapersMeta),

    citedPapers: PaperListFactory(params.citedPapers || []),
    isLoadingCitedPapers: params.isLoadingCitedPapers,
    isFailedToGetCitedPapers: params.isFailedToGetCitedPapers,
    citedPaperTotalPage: params.citedPaperTotalPage,
    citedPaperCurrentPage: params.citedPaperCurrentPage,
    citedPapersMeta: ReferencePaperMetaListFactory(params.citedPapersMeta),

    activeCitationTab: params.activeCitationTab,
    isFetchingCitationInformation: params.isFetchingCitationInformation,
    citationText: params.citationText,
    isBookmarked: params.isBookmarked,
  });
};

export const PAPER_SHOW_INITIAL_STATE = PaperShowStateFactory();
