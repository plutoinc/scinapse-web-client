import { normalize } from "normalizr";
import PlutoAxios from "../pluto";
import { RawAuthorResponse, Author, authorSchema, authorListSchema } from "../../model/author/author";
import { GetAuthorPapersParams, AuthorPapersResponse, GetAuthorPaperResult } from "./types";
import { paperSchema } from "../../model/paper";

export const DEFAULT_AUTHOR_PAPERS_SIZE = 10;

class AuthorAPI extends PlutoAxios {
  public async getAuthorPapers(params: GetAuthorPapersParams): Promise<GetAuthorPaperResult> {
    const res = await this.get(`/authors/${params.authorId}/papers`, {
      params: {
        page: params.page - 1,
        size: params.size || DEFAULT_AUTHOR_PAPERS_SIZE,
        sort: params.sort,
      },
    });
    const paperResponse: AuthorPapersResponse = res.data;
    const authorSlicedResult = paperResponse.content.map(rawPaper => {
      return { ...rawPaper, authors: rawPaper.authors.slice(0, 10) };
    });

    const normalizedPapersData = normalize(authorSlicedResult, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: paperResponse.size,
      number: paperResponse.number + 1,
      sort: paperResponse.sort,
      first: paperResponse.first,
      last: paperResponse.last,
      numberOfElements: paperResponse.numberOfElements,
      totalPages: paperResponse.totalPages,
      totalElements: paperResponse.totalElements,
    };
  }

  public async getAuthor(
    authorId: number
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
      authorSchema
    );
    return normalizedData;
  }

  public async getCoAuthors(
    authorId: number
  ): Promise<{
    entities: { authors: { [authorId: number]: Author } };
    result: number[];
  }> {
    const res = await this.get(`/authors/${authorId}/co-authors`);
    const rawAuthors: RawAuthorResponse[] = res.data.data;

    const authorsArray = rawAuthors.slice(0, 10).map(rawAuthor => ({
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
