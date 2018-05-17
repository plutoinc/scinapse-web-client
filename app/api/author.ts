import { List } from "immutable";
import PlutoAxios from "./pluto";
import { RawAuthorResponse, AuthorFactory, AuthorRecord, AuthorListFactory } from "../model/author/author";
import { CommonPaginationResponsePart } from "./types/common";
import { Paper, PaperListFactory, PaperList } from "../model/paper";

export type AUTHOR_PAPERS_SORT_TYPES = "MOST_CITATION" | "NEWEST_FIRST" | "OLDEST_FIRST";

interface GetAuthorPapersParams {
  authorId: number;
  page: number;
  size: number;
  sort: AUTHOR_PAPERS_SORT_TYPES;
}

interface RawAuthorPapersResponse extends CommonPaginationResponsePart {
  content: Paper[];
}

interface GetAuthorPaperResult extends CommonPaginationResponsePart {
  content: PaperList;
}

class AuthorAPI extends PlutoAxios {
  public async getAuthorPapers(params: GetAuthorPapersParams): Promise<GetAuthorPaperResult> {
    const res = await this.get(`/authors/${params.authorId}/papers`);
    const rawPapersResponse: RawAuthorPapersResponse = res.data;
    const afterRecordifyPapers = { ...rawPapersResponse, ...{ content: PaperListFactory(rawPapersResponse.content) } };

    return afterRecordifyPapers;
  }

  public async getAuthor(authorId: number): Promise<AuthorRecord> {
    const res = await this.get(`/authors/${authorId}`);
    const rawAuthor: RawAuthorResponse = res.data.data;

    return AuthorFactory({
      id: rawAuthor.id,
      name: rawAuthor.name,
      hIndex: rawAuthor.hindex,
      lastKnownAffiliation: rawAuthor.last_known_affiliation,
      paperCount: rawAuthor.paper_count,
      citationCount: rawAuthor.citation_count,
    });
  }

  public async getCoAuthors(authorId: number): Promise<List<AuthorRecord>> {
    const res = await this.get(`/authors/${authorId}/co-authors`);
    const rawAuthors: RawAuthorResponse[] = res.data.data;
    const authors = rawAuthors.map(rawAuthor => ({
      id: rawAuthor.id,
      name: rawAuthor.name,
      hIndex: rawAuthor.hindex,
      lastKnownAffiliation: rawAuthor.last_known_affiliation,
      paperCount: rawAuthor.paper_count,
      citationCount: rawAuthor.citation_count,
    }));

    return AuthorListFactory(authors);
  }
}

const authorAPI = new AuthorAPI();

export default authorAPI;
