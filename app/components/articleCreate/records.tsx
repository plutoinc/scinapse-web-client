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
  abstract: string;
  note: string;
  hasErrorCheck: IHasErrorCheckRecord;
}

export interface IArticleCreateStateRecord extends TypedRecord<IArticleCreateStateRecord>, IArticleCreateState {}

export enum ARTICLE_CREATE_STEP {
  FIRST,
  SECOND,
  FINAL,
}

export type ARTICLE_CATEGORY = "Post Paper" | "Pre Paper" | "White Paper" | "Tech Blog";

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

export interface IHasErrorCheck {
  articleLink: boolean;
  articleCategory: boolean;
  articleTitle: boolean;
  authors: List<IAuthorInputErrorCheckRecord>;
  abstract: boolean;
}

export interface IHasErrorCheckRecord extends TypedRecord<IHasErrorCheckRecord>, IHasErrorCheck {}

export const initialAuthor: IAuthor = {
  id: null,
  type: null,
  institution: "",
  name: "",
  member: null,
};

export const initialAuthorInputError: IAuthorInputErrorCheckRecord = recordify({
  name: false,
  institution: false,
});

export const initialAuthorRecord = recordifyAuthor(initialAuthor);

export const initialErrorCheck: IHasErrorCheckRecord = recordify({
  articleLink: false,
  articleCategory: false,
  articleTitle: false,
  authors: List([initialAuthorInputError]),
  abstract: false,
});

const initialArticleCreateState: IArticleCreateState = {
  isLoading: false,
  hasError: false,
  currentStep: ARTICLE_CREATE_STEP.FIRST,
  isArticleCategoryDropDownOpen: false,
  articleCategory: null,
  articleLink: "https://",
  articleTitle: "",
  authors: List([initialAuthorRecord]),
  abstract: "",
  note: "",
  hasErrorCheck: initialErrorCheck,
};

export const ArticleCreateStateFactory = makeTypedFactory<IArticleCreateState, IArticleCreateStateRecord>(
  initialArticleCreateState,
);

export const ARTICLE_CREATE_INITIAL_STATE = ArticleCreateStateFactory();
