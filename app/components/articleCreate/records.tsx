import { List } from "immutable";
import { TypedRecord, makeTypedFactory, recordify } from "typed-immutable-record";
import { recordifyAuthor, IAuthorRecord, IAuthor } from "../../model/author";

export interface IArticleCreateState {
  isLoading: boolean;
  hasError: boolean;
  currentStep: ARTICLE_CREATE_STEP;
  isArticleCategoryDropDownOpen: boolean;
  articleLink: string;
  articleCategory: ARTICLE_CATEGORY | null;
  articleTitle: string;
  authors: List<IAuthorRecord>;
  summary: string;
  note: string;
  hasErrorCheck: IArticleCreateHasErrorCheckRecord;
}

export interface IArticleCreateStateRecord extends TypedRecord<IArticleCreateStateRecord>, IArticleCreateState {}

export enum ARTICLE_CREATE_STEP {
  FIRST,
  SECOND,
  FINAL,
}

export type ARTICLE_CATEGORY = "POST_PAPER" | "PRE_PAPER" | "WHITE_PAPER" | "TECH_BLOG";

export type ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE = "name" | "institution";

export const AUTHOR_NAME_TYPE: ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE = "name";
export const AUTHOR_INSTITUTION_TYPE: ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE = "institution";

export interface IAuthorInputErrorCheck {
  name: boolean;
  institution: boolean;
}

export interface IAuthorInputErrorCheckRecord
  extends TypedRecord<IAuthorInputErrorCheckRecord>,
    IAuthorInputErrorCheck {}

export interface IArticleCreateHasErrorCheck {
  articleLink: boolean;
  articleCategory: boolean;
  articleTitle: boolean;
  authors: List<IAuthorInputErrorCheckRecord>;
  summary: boolean;
}

export interface IArticleCreateHasErrorCheckRecord
  extends TypedRecord<IArticleCreateHasErrorCheckRecord>,
    IArticleCreateHasErrorCheck {}

export const initialAuthor: IAuthor = {
  id: null,
  type: "CO_AUTHOR", // TODO : Add input with author type
  institution: "",
  name: "",
  hIndex: 2323,
  member: null,
};

export const initialAuthorInputError: IAuthorInputErrorCheckRecord = recordify({
  name: false,
  institution: false,
});

export const initialAuthorRecord = recordifyAuthor(initialAuthor);

export const initialErrorCheck: IArticleCreateHasErrorCheckRecord = recordify({
  articleLink: false,
  articleCategory: false,
  articleTitle: false,
  authors: List([initialAuthorInputError]),
  summary: false,
});

export const initialArticleLinkInput = "https://";

const initialArticleCreateState: IArticleCreateState = {
  isLoading: false,
  hasError: false,
  currentStep: ARTICLE_CREATE_STEP.FIRST,
  isArticleCategoryDropDownOpen: false,
  articleCategory: null,
  articleLink: initialArticleLinkInput,
  articleTitle: "",
  authors: List([initialAuthorRecord]),
  summary: "",
  note: "",
  hasErrorCheck: initialErrorCheck,
};

export const ArticleCreateStateFactory = makeTypedFactory<IArticleCreateState, IArticleCreateStateRecord>(
  initialArticleCreateState,
);

export const ARTICLE_CREATE_INITIAL_STATE = ArticleCreateStateFactory();
