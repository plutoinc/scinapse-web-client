import { CancelToken } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "../pluto";
import { RawAuthor, Author, authorSchema, authorListSchema, mapRawAuthor } from "../../model/author/author";
import { GetAuthorPapersParams, AuthorPapersResponse, GetAuthorPaperResult } from "./types";
import { paperSchema, Paper } from "../../model/paper";
import { CommonPaginationResponseV2 } from "../types/common";

export const DEFAULT_AUTHOR_PAPERS_SIZE = 10;

export interface SimplePaper {
  paper_id: number;
  title: string;
  is_representative: boolean;
}

export interface UpdateRepresentativePapersParams {
  authorId: number;
  paperIds: number[];
}

export interface ConnectAuthorParams {
  authorId: number;
  bio: string | null;
  email: string;
  name: string;
  affiliationId: number | null;
  affiliationName: string | null;
  webPage: string | null;
}

interface QueryAuthorPapersParams {
  query: string;
  authorId: number;
  page: number;
  cancelToken: CancelToken;
}

class AuthorAPI extends PlutoAxios {
  public connectAuthor = async (
    params: ConnectAuthorParams
  ): Promise<{
    entities: { authors: { [authorId: number]: Author } };
    result: number;
  }> => {
    const res = await this.post(`/authors/${params.authorId}/connect`, {
      affiliation_id: params.affiliationId,
      bio: params.bio,
      email: params.email,
      name: params.name,
      web_page: params.webPage,
    });
    const rawAuthor: RawAuthor = res.data.data.content;

    const normalizedData = normalize(mapRawAuthor(rawAuthor), authorSchema);
    return normalizedData;
  };

  public async removeAuthorPapers(authorId: number, paperIds: number[]) {
    const res = await this.post(`/authors/${authorId}/papers/remove`, {
      paper_ids: paperIds,
    });

    const successResponse: CommonPaginationResponseV2<{ success: true }> = res.data;

    return successResponse;
  }

  public async queryAuthorPapers(params: QueryAuthorPapersParams): Promise<CommonPaginationResponseV2<Paper[]>> {
    const res = await this.get("/papers", {
      params: {
        query: params.query,
        check_author_included: params.authorId,
        page: params.page - 1,
      },
      cancelToken: params.cancelToken,
    });

    const paperListResult: CommonPaginationResponseV2<Paper[]> = res.data;

    return paperListResult;
  }

  public async addPapersToAuthorPaperList(authorId: number, paperIds: number[], cancelToken: CancelToken) {
    const res = await this.post(
      `/authors/${authorId}/papers/add`,
      {
        paper_ids: paperIds,
      },
      { cancelToken }
    );
    const successResponse: CommonPaginationResponseV2<{ success: true }> = res.data;

    return successResponse;
  }

  public async getAuthorPapers(params: GetAuthorPapersParams): Promise<GetAuthorPaperResult> {
    const res = await this.get(`/authors/${params.authorId}/papers`, {
      params: {
        query: params.query || null,
        page: params.page - 1,
        size: params.size || DEFAULT_AUTHOR_PAPERS_SIZE,
        sort: params.sort,
      },
      cancelToken: params.cancelToken,
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

  public async getSelectedPapers(authorId: number) {
    const res = await this.get(`/authors/${authorId}/papers/all`);

    const simplePapersResponse: CommonPaginationResponseV2<SimplePaper[]> = res.data;

    return simplePapersResponse;
  }

  public async getAuthor(
    authorId: number,
    cancelToken: CancelToken
  ): Promise<{
    entities: { authors: { [authorId: number]: Author } };
    result: number;
  }> {
    const res = await this.get(`/authors/${authorId}`, { cancelToken });
    const rawAuthor: RawAuthor = res.data.data;

    const normalizedData = normalize(mapRawAuthor(rawAuthor), authorSchema);
    return normalizedData;
  }

  public async updateAuthor(
    params: ConnectAuthorParams
  ): Promise<{
    entities: { authors: { [authorId: number]: Author } };
    result: number;
  }> {
    const res = await this.put(`/authors/${params.authorId}`, {
      affiliation_id: params.affiliationId,
      affiliation_name: params.affiliationName,
      bio: params.bio,
      email: params.email,
      name: params.name,
      web_page: params.webPage,
    });
    const rawAuthor: RawAuthor = res.data.data.content;

    const normalizedData = normalize(mapRawAuthor(rawAuthor), authorSchema);
    return normalizedData;
  }

  public async getCoAuthors(
    authorId: number,
    cancelToken: CancelToken
  ): Promise<{
    entities: { authors: { [authorId: number]: Author } };
    result: number[];
  }> {
    const res = await this.get(`/authors/${authorId}/co-authors`, { cancelToken });
    const rawAuthors: RawAuthor[] = res.data.data;

    const authorsArray = rawAuthors.slice(0, 10).map(rawAuthor => mapRawAuthor(rawAuthor));
    const normalizedData = normalize(authorsArray, authorListSchema);
    return normalizedData;
  }

  public async updateRepresentativePapers(params: UpdateRepresentativePapersParams): Promise<Paper[]> {
    const res = await this.put(`/authors/${params.authorId}/papers/representative`, {
      paper_ids: params.paperIds,
    });

    const paperResponse: CommonPaginationResponseV2<Paper[]> = res.data;
    const papers = paperResponse.data.content;

    return papers;
  }
}

const authorAPI = new AuthorAPI();

export default authorAPI;
