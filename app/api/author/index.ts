import { CancelToken } from 'axios';
import { normalize } from 'normalizr';
import PlutoAxios from '../pluto';
import { Author, authorSchema, authorListSchema } from '../../model/author/author';
import { GetAuthorPapersParams, AuthorPapersResponse, GetAuthorPaperResult } from './types';
import { paperSchema, Paper } from '../../model/paper';
import { RawPaginationResponseV2 } from '../types/common';
import { camelCaseKeys } from '../../helpers/camelCaseKeys';

export const DEFAULT_AUTHOR_PAPERS_SIZE = 10;

export interface SimplePaper {
  paperId: string;
  title: string;
  isRepresentative: boolean;
}

export interface UpdateRepresentativePapersParams {
  authorId: string;
  paperIds: string[];
}

export interface ConnectAuthorParams {
  authorId: string;
  bio: string | null;
  email: string;
  name: string;
  affiliationId: string | null;
  affiliationName: string;
  webPage: string | null;
  isEmailHidden: boolean;
}

interface QueryAuthorPapersParams {
  query: string;
  authorId: string;
  page: number;
  cancelToken: CancelToken;
}

class AuthorAPI extends PlutoAxios {
  public connectAuthor = async (
    params: ConnectAuthorParams
  ): Promise<{
    entities: { authors: { [authorId: string]: Author } };
    result: string;
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
    const rawAuthor = res.data.data.content;
    const camelizedAuthor: Author = camelCaseKeys(rawAuthor);
    const normalizedData = normalize(camelizedAuthor, authorSchema);
    return normalizedData;
  };

  public async removeAuthorPapers(authorId: string, paperIds: string[]) {
    const res = await this.post(`/authors/${authorId}/papers/remove`, {
      paper_ids: paperIds,
    });

    const successResponse: RawPaginationResponseV2<{ success: true }> = res.data;

    return successResponse;
  }

  public async queryAuthorPapers(params: QueryAuthorPapersParams): Promise<RawPaginationResponseV2<Paper[]>> {
    const res = await this.get('/search/to-add', {
      params: {
        q: params.query,
        check_author_included: params.authorId,
        page: params.page - 1,
      },
      cancelToken: params.cancelToken,
    });

    const paperListResult: RawPaginationResponseV2<Paper[]> = camelCaseKeys(res.data);

    return paperListResult;
  }

  public async addPapersToAuthorPaperList(authorId: string, paperIds: string[], cancelToken: CancelToken) {
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
    const { authorId, query, page, size, sort, cancelToken } = params;
    const res = await this.get(`/search/author-papers`, {
      params: {
        aid: authorId,
        q: query || null,
        page: page - 1,
        size: size || DEFAULT_AUTHOR_PAPERS_SIZE,
        sort,
      },
      cancelToken,
    });

    const paperResponse: AuthorPapersResponse = res.data.data;
    const authorSlicedResult = paperResponse.content.map(rawPaper => {
      return camelCaseKeys({ ...rawPaper, authors: rawPaper.authors.slice(0, 10) });
    });
    const camelizedPageRes = camelCaseKeys(paperResponse.page);

    const normalizedPapersData = normalize(authorSlicedResult, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: camelizedPageRes.size,
      page: camelizedPageRes.page + 1,
      first: camelizedPageRes.first,
      last: camelizedPageRes.last,
      numberOfElements: camelizedPageRes.numberOfElements,
      totalPages: camelizedPageRes.totalPages,
      totalElements: camelizedPageRes.totalElements,
    };
  }

  public async getSelectedPapers(authorId: string) {
    const res = await this.get(`/authors/${authorId}/papers/all`);

    const simplePapersResponse: RawPaginationResponseV2<SimplePaper[]> = camelCaseKeys(res.data);

    return simplePapersResponse;
  }

  public async getAuthor(
    authorId: string,
    cancelToken: CancelToken
  ): Promise<{
    entities: { authors: { [authorId: string]: Author } };
    result: string;
  }> {
    const res = await this.get(`/authors/${authorId}`, { cancelToken });
    const author: Author = camelCaseKeys(res.data.data);
    const normalizedData = normalize(author, authorSchema);
    return normalizedData;
  }

  public async updateAuthor(
    params: ConnectAuthorParams
  ): Promise<{
    entities: { authors: { [authorId: string]: Author } };
    result: string;
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
    const author: Author = camelCaseKeys(res.data.data.content);
    const normalizedData = normalize(author, authorSchema);
    return normalizedData;
  }

  public async updateAuthorProfileImage(authorId: string, profileImageData: FormData) {
    const res = await this.put(`/authors/${authorId}/profile-image`, profileImageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return camelCaseKeys(res.data);
  }

  public async getCoAuthors(
    authorId: string,
    cancelToken: CancelToken
  ): Promise<{
    entities: { authors: { [authorId: string]: Author } };
    result: string[];
  }> {
    const res = await this.get(`/authors/${authorId}/co-authors`, { cancelToken });
    const authors: Author[] = camelCaseKeys(res.data.data);

    const authorsArray = authors.slice(0, 10);
    const normalizedData = normalize(authorsArray, authorListSchema);
    return normalizedData;
  }

  public async updateRepresentativePapers(params: UpdateRepresentativePapersParams): Promise<Paper[]> {
    const res = await this.put(`/authors/${params.authorId}/papers/representative`, {
      paper_ids: params.paperIds,
    });

    const paperResponse: RawPaginationResponseV2<Paper[]> = camelCaseKeys(res.data);
    const papers = paperResponse.data.content;

    return papers;
  }
}

const authorAPI = new AuthorAPI();

export default authorAPI;
