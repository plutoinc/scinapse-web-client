import * as _ from "lodash";
import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { makeTypedFactory } from "typed-immutable-record/dist/src/typed.factory";
import { IPaperComment, IPaperCommentRecord, recordifyPaperComment } from "./paperComment";

interface IFos {
  id: number | null;
  fos: string | null;
}

export const initialFos: IFos = {
  id: null,
  fos: null,
};

export interface IFosRecord extends TypedRecord<IFosRecord>, IFos {}

export const FosFactory = makeTypedFactory<IFos, IFosRecord>(initialFos);

interface IPaperAuthor {
  order: number | null;
  name: string | null;
  organization: string | null;
  hIndex: number | null;
}

export const initialPaperAuthor: IPaperAuthor = {
  order: null,
  name: null,
  organization: null,
  hIndex: null,
};

export interface IPaperAuthorRecord extends TypedRecord<IPaperAuthorRecord>, IPaperAuthor {}

export const PaperAuthorFactory = makeTypedFactory<IPaperAuthor, IPaperAuthorRecord>(initialPaperAuthor);

export interface IPaper {
  id: number | null;
  title: string | null;
  year: number | null;
  citation: number | null;
  lang: string | null;
  doi: string | null;
  publisher: string | null;
  venue: string | null;
  fosList: IFos[] | null;
  authors: IPaperAuthor[] | null;
  abstract: string | null;
  comments: IPaperComment[] | null;
}

export interface IPaperPart {
  id: number | null;
  title: string | null;
  year: number | null;
  citation: number | null;
  lang: string | null;
  doi: string | null;
  publisher: string | null;
  venue: string | null;
  fosList: List<IFosRecord> | null;
  authors: List<IPaperAuthorRecord> | null;
  abstract: string | null;
  comments: List<IPaperCommentRecord> | null;
}

export interface IPaperRecord extends TypedRecord<IPaperRecord>, IPaperPart {}

export interface IPapersRecord extends List<IPaperRecord> {}

export const initialArticle: IPaper = {
  id: null,
  title: null,
  year: null,
  citation: null,
  lang: null,
  doi: null,
  publisher: null,
  venue: null,
  fosList: null,
  authors: null,
  abstract: null,
  comments: null,
};

export const PAPER_INITIAL_STATE: IPapersRecord = List();

export function recordifyPaper(paper: IPaper = initialArticle): IPaperRecord {
  let recordifiedPaperAuthors: List<IPaperAuthorRecord> = null;
  let recordifiedFosList: List<IFosRecord> = null;
  let recordifiedComments: List<IPaperCommentRecord> = null;

  if (paper.authors) {
    const recordMappedAuthors = paper.authors.map(author => {
      if (author && !_.isEmpty(author)) {
        return PaperAuthorFactory(author);
      }
    });
    recordifiedPaperAuthors = List(recordMappedAuthors);
  }

  if (paper.fosList) {
    const recordMappedFosList = paper.fosList.map(fos => {
      if (fos && !_.isEmpty(fos)) {
        return FosFactory(fos);
      }
    });

    recordifiedFosList = List(recordMappedFosList);
  }

  if (paper.comments) {
    const recordMappedComments = paper.comments.map(comment => {
      if (comment && !_.isEmpty(comment)) {
        return recordifyPaperComment(comment);
      }
    });

    recordifiedComments = List(recordMappedComments);
  }

  return recordify({
    id: paper.id,
    title: paper.title,
    year: paper.year,
    citation: paper.citation,
    lang: paper.lang,
    doi: paper.doi,
    publisher: paper.publisher,
    venue: paper.venue,
    fosList: recordifiedFosList,
    authors: recordifiedPaperAuthors,
    abstract: paper.abstract,
    comments: recordifiedComments,
  });
}
