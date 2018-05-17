import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { PaperList, Paper, PaperListFactory } from "../../model/paper";
import { Author, AuthorRecord, AuthorFactory, AuthorListFactory } from "../../model/author/author";
import { AUTHOR_PAPERS_SORT_TYPES } from "../../api/author";

export interface AuthorShowState {
  papers: Paper[];
  author: Author | null;
  coAuthors: Author[];
  papersTotalPage: number;
  papersCurrentPage: number;
  papersSort: AUTHOR_PAPERS_SORT_TYPES;
}

interface InnerRecordifiedAuthorShowState {
  papers: PaperList;
  author: AuthorRecord;
  coAuthors: List<AuthorRecord>;
  papersTotalPage: number;
  papersCurrentPage: number;
  papersSort: AUTHOR_PAPERS_SORT_TYPES;
}

export interface AuthorShowStateRecord extends TypedRecord<AuthorShowStateRecord>, InnerRecordifiedAuthorShowState {}

export const initialAuthorShowState: AuthorShowState = {
  papers: [],
  author: null,
  coAuthors: [],
  papersTotalPage: 0,
  papersCurrentPage: 1,
  papersSort: "MOST_CITATION",
};

export const AuthorShowStateFactory = (params: AuthorShowState = initialAuthorShowState): AuthorShowStateRecord => {
  const innerRecordifiedArticleSearchState: InnerRecordifiedAuthorShowState = {
    papers: PaperListFactory(params.papers),
    author: AuthorFactory(params.author),
    coAuthors: AuthorListFactory(params.coAuthors),
    papersTotalPage: params.papersTotalPage,
    papersCurrentPage: params.papersCurrentPage,
    papersSort: params.papersSort,
  };

  return recordify(innerRecordifiedArticleSearchState);
};

export const AUTHOR_SHOW_INITIAL_STATE = AuthorShowStateFactory();
