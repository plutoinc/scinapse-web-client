import * as _ from "lodash";
import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { IPaperComment, IPaperCommentRecord, recordifyPaperComment } from "./comment";
import { IPaperAuthor, IPaperAuthorRecord, PaperAuthorFactory } from "./author";
import { IPaperSource, IPaperSourceRecord, PaperSourceFactory } from "./source";
import { IFos, IFosRecord, FosFactory } from "./fos";

export interface IPaper {
  id: number | null;
  title: string | null;
  year: number | null;
  referenceCount: number | null;
  citedCount: number | null;
  lang: string | null;
  doi: string | null;
  publisher: string | null;
  venue: string | null;
  fosList: IFos[] | null;
  authors: IPaperAuthor[] | null;
  abstract: string | null;
  commentCount: number | null;
  comments: IPaperComment[] | null;
  urls: IPaperSource[] | null;
}

export interface IPaperPart {
  id: number | null;
  title: string | null;
  year: number | null;
  referenceCount: number | null;
  citedCount: number | null;
  lang: string | null;
  doi: string | null;
  publisher: string | null;
  venue: string | null;
  fosList: List<IFosRecord> | null;
  authors: List<IPaperAuthorRecord> | null;
  abstract: string | null;
  commentCount: number | null;
  comments: List<IPaperCommentRecord> | null;
  urls: List<IPaperSourceRecord> | null;
}

export interface IPaperRecord extends TypedRecord<IPaperRecord>, IPaperPart {}

export interface IPapersRecord extends List<IPaperRecord> {}

export const initialArticle: IPaper = {
  id: null,
  title: null,
  year: null,
  referenceCount: null,
  citedCount: null,
  lang: null,
  doi: null,
  publisher: null,
  venue: null,
  fosList: null,
  authors: null,
  abstract: null,
  commentCount: null,
  comments: null,
  urls: null,
};

export const PAPER_INITIAL_STATE: IPapersRecord = List();

export function recordifyPaper(paper: IPaper = initialArticle): IPaperRecord {
  let recordifiedPaperAuthors: List<IPaperAuthorRecord> = null;
  let recordifiedFosList: List<IFosRecord> = null;
  let recordifiedComments: List<IPaperCommentRecord> = null;
  let recordifiedUrls: List<IPaperSourceRecord> = null;

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

  if (paper.urls) {
    const recordMappedUrls = paper.urls.map(url => {
      if (url && !_.isEmpty(url)) {
        return PaperSourceFactory(url);
      }
    });

    recordifiedUrls = List(recordMappedUrls);
  }

  return recordify({
    id: paper.id,
    title: paper.title,
    year: paper.year,
    referenceCount: paper.referenceCount,
    citedCount: paper.citedCount,
    lang: paper.lang,
    doi: paper.doi,
    publisher: paper.publisher,
    venue: paper.venue,
    fosList: recordifiedFosList,
    authors: recordifiedPaperAuthors,
    abstract: paper.abstract,
    commentCount: paper.commentCount,
    comments: recordifiedComments,
    urls: recordifiedUrls,
  });
}
