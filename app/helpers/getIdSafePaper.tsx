import { Paper, SavedInCollection } from '../model/paper';
import { PaperAuthor } from '../model/author';
import { ConferenceInstance } from '../model/conferenceInstance';
import { Journal } from '../model/journal';
import { PaperSource } from '../model/paperSource';
import { Collection } from '../model/collection';
import { Member } from '../model/member';

function getIdSafePaperAuthor(author: PaperAuthor): PaperAuthor {
  return {
    ...author,
    id: String(author.id),
    affiliation: author.affiliation ? { ...author.affiliation, id: String(author.affiliation.id) } : null,
  };
}

function getIdSafeConferenceInstance(conferenceInstance: ConferenceInstance | null) {
  if (!conferenceInstance) return null;

  return {
    ...conferenceInstance,
    id: String(conferenceInstance.id),
    conferenceSeries: conferenceInstance.conferenceSeries
      ? {
          ...conferenceInstance.conferenceSeries,
          id: String(conferenceInstance.conferenceSeries.id),
        }
      : null,
  };
}

function getIdSafeJournal(journal: Journal | null) {
  if (!journal) return null;

  return {
    ...journal,
    id: String(journal.id),
    fosList: journal.fosList ? journal.fosList.map(fos => ({ ...fos, id: String(fos.id) })) : [],
  };
}

function getIdSafePaperSource(paperSource: PaperSource): PaperSource {
  return {
    ...paperSource,
    id: String(paperSource.id),
    paperId: String(paperSource.paperId),
  };
}

function getIdSafeRelationField(
  relation?: {
    savedInCollections: SavedInCollection[];
  } | null
) {
  if (!relation) return null;

  return {
    ...relation,
    savedInCollections: relation.savedInCollections.map(c => ({ ...c, id: String(c.id) })),
  };
}

function getSafeMember(member: Member): Member {
  return {
    ...member,
    id: String(member.id),
    authorId: String(member.authorId),
  };
}

export function getSafeCollection(collection: Collection): Collection {
  return {
    ...collection,
    id: String(collection.id),
    createdBy: getSafeMember(collection.createdBy),
  };
}

export function getIdSafePaper(paper: Paper): Paper {
  return {
    ...paper,
    id: String(paper.id),
    fosList: paper.fosList.map(fos => ({ ...fos, id: String(fos.id) })),
    authors: paper.authors.map(getIdSafePaperAuthor),
    journal: getIdSafeJournal(paper.journal),
    conferenceInstance: getIdSafeConferenceInstance(paper.conferenceInstance),
    urls: paper.urls.map(getIdSafePaperSource),
    relation: getIdSafeRelationField(paper.relation),
  };
}
