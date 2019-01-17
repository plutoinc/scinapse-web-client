import { CancelToken } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "../pluto";
import { RawAuthor, Author, authorSchema, authorListSchema } from "../../model/author/author";
import { GetAuthorPapersParams, AuthorPapersResponse, GetAuthorPaperResult } from "./types";
import { paperSchema, Paper } from "../../model/paper";
import { RawPaginationResponseV2 } from "../types/common";
const camelcaseKeys = require("camelcase-keys");

export const DEFAULT_AUTHOR_PAPERS_SIZE = 10;

export interface SimplePaper {
  paperId: number;
  title: string;
  isRepresentative: boolean;
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
  affiliationName: string;
  webPage: string | null;
  isEmailHidden: boolean;
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
      affiliation_name: params.affiliationName,
      bio: params.bio,
      email: params.email,
      name: params.name,
      web_page: params.webPage,
      is_email_hidden: params.isEmailHidden,
    });
    const rawAuthor: RawAuthor = res.data.data.content;
    const camelizedAuthor: Author = camelcaseKeys(rawAuthor, { deep: true });
    const normalizedData = normalize(camelizedAuthor, authorSchema);
    return normalizedData;
  };

  public async removeAuthorPapers(authorId: number, paperIds: number[]) {
    const res = await this.post(`/authors/${authorId}/papers/remove`, {
      paper_ids: paperIds,
    });

    const successResponse: RawPaginationResponseV2<{ success: true }> = res.data;

    return successResponse;
  }

  public async queryAuthorPapers(params: QueryAuthorPapersParams): Promise<RawPaginationResponseV2<Paper[]>> {
    const res = await this.get("/papers", {
      params: {
        query: params.query,
        check_author_included: params.authorId,
        page: params.page - 1,
      },
      cancelToken: params.cancelToken,
    });

    const paperListResult: RawPaginationResponseV2<Paper[]> = camelcaseKeys(res.data, { deep: true });

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
    const successResponse: RawPaginationResponseV2<{ success: true }> = res.data;

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
      return camelcaseKeys({ ...rawPaper, authors: rawPaper.authors.slice(0, 10) }, { deep: true });
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

    const simplePapersResponse: RawPaginationResponseV2<SimplePaper[]> = camelcaseKeys(res.data, { deep: true });

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
    const author: Author = camelcaseKeys(res.data.data, { deep: true });
    const normalizedData = normalize(author, authorSchema);
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
      is_email_hidden: params.isEmailHidden,
    });
    const author: Author = camelcaseKeys(res.data.data.content, { deep: true });
    const normalizedData = normalize(author, authorSchema);
    return normalizedData;
  }

  public async updateAuthorProfileImage(authorId: number, profileImageData: FormData) {
    const res = await this.put(`/authors/${authorId}/profile-image`, profileImageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return camelcaseKeys(res.data, { deep: true });
  }

  public async getCoAuthors(
    authorId: number,
    cancelToken: CancelToken
  ): Promise<{
    entities: { authors: { [authorId: number]: Author } };
    result: number[];
  }> {
    const res = await this.get(`/authors/${authorId}/co-authors`, { cancelToken });
    const authors: Author[] = camelcaseKeys(res.data.data, { deep: true });

    const authorsArray = authors.slice(0, 10);
    const normalizedData = normalize(authorsArray, authorListSchema);
    return normalizedData;
  }

  public async updateRepresentativePapers(params: UpdateRepresentativePapersParams): Promise<Paper[]> {
    const res = await this.put(`/authors/${params.authorId}/papers/representative`, {
      paper_ids: params.paperIds,
    });

    const paperResponse: RawPaginationResponseV2<Paper[]> = camelcaseKeys(res.data, { deep: true });
    const papers = paperResponse.data.content;

    return papers;
  }
}

const authorAPI = new AuthorAPI();

export default authorAPI;
