import { Paper } from "../../model/paper";
import { Author } from "../../model/author/author";
import { AUTHOR_PAPERS_SORT_TYPES } from "../../api/author";

export interface AuthorShowState
  extends Readonly<{
      papers: Paper[];
      author: Author | null;
      coAuthors: Author[];
      papersTotalPage: number;
      papersCurrentPage: number;
      papersSort: AUTHOR_PAPERS_SORT_TYPES;
    }> {}

export const AUTHOR_SHOW_INITIAL_STATE: AuthorShowState = {
  papers: [],
  author: null,
  coAuthors: [],
  papersTotalPage: 0,
  papersCurrentPage: 1,
  papersSort: "MOST_CITATION",
};
