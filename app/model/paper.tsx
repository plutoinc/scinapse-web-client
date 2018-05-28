import { isEmpty } from "lodash";
import { List } from "immutable";
import { schema } from "normalizr";
import { TypedRecord, recordify } from "typed-immutable-record";
import { IComment, ICommentRecord, recordifyComment } from "./comment";
import { PaperAuthor, PaperAuthorRecord, PaperAuthorFactory } from "./author";
import { IPaperSource, IPaperSourceRecord, PaperSourceFactory } from "./paperSource";
import { IFos, IFosRecord, FosFactory } from "./fos";
import { IJournal, IJournalRecord, JournalFactory } from "./journal";

export interface Paper {
  id: number;
  cognitivePaperId: number;
  title: string;
  year: number;
  referenceCount: number;
  citedCount: number;
  lang: string;
  doi: string;
  publisher: string;
  venue: string;
  fosList: IFos[];
  authors: PaperAuthor[];
  abstract: string;
  commentCount: number;
  comments: IComment[];
  urls?: IPaperSource[];
  journal: IJournal | null;
}

export interface PaperPart {
  id: number;
  cognitivePaperId: number;
  title: string;
  year: number;
  referenceCount: number;
  citedCount: number;
  lang: string;
  doi: string;
  publisher: string;
  venue: string;
  fosList: List<IFosRecord | undefined>;
  authors: List<PaperAuthorRecord | undefined>;
  abstract: string;
  commentCount: number;
  comments: List<ICommentRecord | undefined>;
  urls: List<IPaperSourceRecord | undefined>;
  journal: IJournalRecord | null;
}

export interface PaperRecord extends TypedRecord<PaperRecord>, PaperPart {}

export interface PaperList extends List<PaperRecord> {}

export const initialPaper: Paper = {
  id: 0,
  cognitivePaperId: 0,
  title: "",
  year: 0,
  referenceCount: 0,
  citedCount: 0,
  lang: "",
  doi: "",
  publisher: "",
  venue: "",
  fosList: [],
  authors: [],
  abstract: "",
  commentCount: 0,
  comments: [],
  urls: [],
  journal: null,
};

export const PAPER_INITIAL_STATE: PaperList = List();

export function PaperFactory(paper: Paper | null = initialPaper): PaperRecord | null {
  if (!paper) {
    return null;
  }

  let recordifiedPaperAuthors: List<PaperAuthorRecord | undefined> = List();
  let recordifiedFosList: List<IFosRecord | undefined> = List();
  let recordifiedComments: List<ICommentRecord | undefined> = List();
  let recordifiedUrls: List<IPaperSourceRecord | undefined> = List();

  if (paper.authors) {
    const recordMappedAuthors = paper.authors.map(author => {
      if (author) {
        return PaperAuthorFactory(author);
      }
    });
    recordifiedPaperAuthors = List(recordMappedAuthors);
  }

  if (paper.fosList) {
    const recordMappedFosList = paper.fosList.map(fos => {
      if (fos && !isEmpty(fos)) {
        return FosFactory(fos);
      }
    });

    recordifiedFosList = List(recordMappedFosList);
  }

  if (paper.comments) {
    const recordMappedComments = paper.comments.map(comment => {
      if (comment && !isEmpty(comment)) {
        return recordifyComment(comment);
      }
    });

    recordifiedComments = List(recordMappedComments);
  }

  if (paper.urls) {
    const recordMappedUrls = paper.urls.map(url => {
      if (url && !isEmpty(url)) {
        return PaperSourceFactory(url);
      }
    });

    recordifiedUrls = List(recordMappedUrls);
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
    journal: paper.journal ? JournalFactory(paper.journal) : null,
  }) as PaperRecord;
}

export const PaperListFactory = (papers: Paper[] = []): List<PaperRecord | null> => {
  if (!papers || papers.length === 0) {
    return List();
  }
  const recordifiedPapersArray = papers.map(paper => {
    return PaperFactory(paper);
  });

  return List(recordifiedPapersArray);
};

export const paperSchema = new schema.Entity("papers");
export const paperListSchema = [paperSchema];
