import PlutoAxios from "./pluto";
import { RawAuthorResponse, Author } from "../model/author/author";
import { CommonPaginationResponsePart } from "./types/common";
import { Paper } from "../model/paper";

export type AUTHOR_PAPERS_SORT_TYPES = "MOST_CITATION" | "NEWEST_FIRST" | "OLDEST_FIRST";

interface GetAuthorPapersParams {
  authorId: number;
  page: number;
  size: number;
  sort: AUTHOR_PAPERS_SORT_TYPES;
}

interface AuthorPapersResponse extends CommonPaginationResponsePart {
  content: Paper[];
}

class AuthorAPI extends PlutoAxios {
  public async getAuthorPapers(params: GetAuthorPapersParams): Promise<AuthorPapersResponse> {
    const res = await this.get(`/authors/${params.authorId}/papers`);
    const paperResponse: AuthorPapersResponse = res.data;

    return paperResponse;
  }

  public async getAuthor(authorId: number): Promise<Author> {
    const res = await this.get(`/authors/${authorId}`);
    const rawAuthor: RawAuthorResponse = res.data.data;

    return {
      id: rawAuthor.id,
      name: rawAuthor.name,
      hIndex: rawAuthor.hindex,
      lastKnownAffiliation: rawAuthor.last_known_affiliation,
      paperCount: rawAuthor.paper_count,
      citationCount: rawAuthor.citation_count,
    };
  }

  public async getCoAuthors(authorId: number): Promise<Author[]> {
    const res = await this.get(`/authors/${authorId}/co-authors`);
    const rawAuthors: RawAuthorResponse[] = res.data.data;

    return rawAuthors.map(rawAuthor => ({
      id: rawAuthor.id,
      name: rawAuthor.name,
      hIndex: rawAuthor.hindex,
      lastKnownAffiliation: rawAuthor.last_known_affiliation,
      paperCount: rawAuthor.paper_count,
      citationCount: rawAuthor.citation_count,
    }));
  }
}

const authorAPI = new AuthorAPI();

export default authorAPI;
