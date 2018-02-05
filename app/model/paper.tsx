import * as _ from "lodash";
import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { IComment, ICommentRecord, recordifyComment } from "./comment";
import { IAuthor, IAuthorRecord, AuthorFactory } from "./author";
import { IPaperSource, IPaperSourceRecord, PaperSourceFactory } from "./paperSource";
import { IFos, IFosRecord, FosFactory } from "./fos";
import { IJournal, IJournalRecord, JournalFactory } from "./journal";

export interface IPaper {
  id: number | null;
  cognitivePaperId: number | null;
  title: string | null;
  year: number | null;
  referenceCount: number | null;
  citedCount: number | null;
  lang: string | null;
  doi: string | null;
  publisher: string | null;
  venue: string | null;
  fosList: IFos[] | null;
  authors: IAuthor[] | null;
  abstract: string | null;
  commentCount: number | null;
  comments: IComment[] | null;
  urls: IPaperSource[] | null;
  journal: IJournal | null;
}

export interface IPaperPart {
  id: number | null;
  cognitivePaperId: number | null;
  title: string | null;
  year: number | null;
  referenceCount: number | null;
  citedCount: number | null;
  lang: string | null;
  doi: string | null;
  publisher: string | null;
  venue: string | null;
  fosList: List<IFosRecord> | null;
  authors: List<IAuthorRecord> | null;
  abstract: string | null;
  commentCount: number | null;
  comments: List<ICommentRecord> | null;
  urls: List<IPaperSourceRecord> | null;
  journal: IJournalRecord;
}

export interface IPaperRecord extends TypedRecord<IPaperRecord>, IPaperPart {}

export interface IPapersRecord extends List<IPaperRecord> {}

export const initialPaper: IPaper = {
  id: null,
  cognitivePaperId: null,
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
  journal: null,
};

export const PAPER_INITIAL_STATE: IPapersRecord = List();

export function recordifyPaper(paper: IPaper = initialPaper): IPaperRecord {
  let recordifiedPaperAuthors: List<IAuthorRecord> = null;
  let recordifiedFosList: List<IFosRecord> = null;
  let recordifiedComments: List<ICommentRecord> = null;
  let recordifiedUrls: List<IPaperSourceRecord> = null;
  let recordifiedJournal: IJournalRecord = null;

  if (paper.authors) {
    const recordMappedAuthors = paper.authors.map(author => {
      if (author && !_.isEmpty(author)) {
        return AuthorFactory(author);
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
        return recordifyComment(comment);
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

  if (paper.journal) {
    recordifiedJournal = JournalFactory(paper.journal);
  }

  return recordify({
    id: paper.id,
    cognitivePaperId: paper.cognitivePaperId,
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
    journal: recordifiedJournal,
  });
}
