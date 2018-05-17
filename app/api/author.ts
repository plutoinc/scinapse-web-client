import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { RawAuthorResponse, Author, authorSchema, authorListSchema } from "../model/author/author";
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

  public async getAuthor(
    authorId: number,
  ): Promise<{
    entities: { authors: { [authorId: number]: Author } };
    result: number;
  }> {
    const res = await this.get(`/authors/${authorId}`);
    const rawAuthor: RawAuthorResponse = res.data.data;

    const normalizedData = normalize(
      {
        id: rawAuthor.id,
        name: rawAuthor.name,
        hIndex: rawAuthor.hindex,
        lastKnownAffiliation: rawAuthor.last_known_affiliation,
        paperCount: rawAuthor.paper_count,
        citationCount: rawAuthor.citation_count,
      },
      authorSchema,
    );
    return normalizedData;
  }

  public async getCoAuthors(
    authorId: number,
  ): Promise<{
    entities: { authors: { [authorId: number]: Author } };
    result: number[];
  }> {
    const res = await this.get(`/authors/${authorId}/co-authors`);
    const rawAuthors: RawAuthorResponse[] = res.data.data;

    const authorsArray = rawAuthors.map(rawAuthor => ({
      id: rawAuthor.id,
      name: rawAuthor.name,
      hIndex: rawAuthor.hindex,
      lastKnownAffiliation: rawAuthor.last_known_affiliation,
      paperCount: rawAuthor.paper_count,
      citationCount: rawAuthor.citation_count,
    }));

    const normalizedData = normalize(authorsArray, authorListSchema);

    return normalizedData;
  }
}

const authorAPI = new AuthorAPI();

export default authorAPI;
