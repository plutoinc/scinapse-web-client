import { CancelToken } from 'axios';
import { normalize } from 'normalizr';
import PlutoAxios from '../pluto';
import { Author, authorSchema, authorListSchema } from '../../model/author/author';
import { GetAuthorPapersParams, AuthorPapersResponse, GetAuthorPaperResult } from './types';
import { paperSchema, Paper } from '../../model/paper';
import { PaginationResponseV2 } from '../types/common';
import { getSafeAuthor, getIdSafePaper } from '../../helpers/getIdSafeData';
import { profileEntitySchema } from '../../model/profile';

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

export interface ProfileParams {
  profileSlug: string;
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
    params: ProfileParams
  ): Promise<{
    entities: { authors: { [authorId: string]: Author } };
    result: string;
  }> => {
    const res = await this.post(`/authors/${params.profileSlug}/connect`, {
      affiliation_id: String(params.affiliationId),
      affiliation_name: params.affiliationName,
      bio: params.bio,
      email: params.email,
      name: params.name,
      web_page: params.webPage,
      is_email_hidden: params.isEmailHidden,
    });
    const rawAuthor = res.data.data.content;
    const camelizedAuthor: Author = getSafeAuthor(rawAuthor);
    const normalizedData = normalize(camelizedAuthor, authorSchema);
    return normalizedData;
  };

  public async removeAuthorPapers(authorId: string, paperIds: string[]) {
    const res = await this.post(`/authors/${authorId}/papers/remove`, {
      paper_ids: paperIds.map(id => String(id)),
    });

    const successResponse: PaginationResponseV2<{ success: true }> = res.data;

    return successResponse;
  }

  public async queryAuthorPapers(params: QueryAuthorPapersParams): Promise<PaginationResponseV2<Paper[]>> {
    const res = await this.get('/search/to-add', {
      params: {
        q: params.query,
        check_author_included: String(params.authorId),
        page: params.page - 1,
      },
      cancelToken: params.cancelToken,
    });

    const paperListResult: PaginationResponseV2<Paper[]> = res.data;
    const safePaperListResult = {
      ...paperListResult,
      data: {
        ...paperListResult.data,
        content: paperListResult.data.content.map(getIdSafePaper),
      },
    };

    return safePaperListResult;
  }

  public async addPapersToAuthorPaperList(authorId: string, paperIds: string[], cancelToken: CancelToken) {
    const res = await this.post(
      `/authors/${authorId}/papers/add`,
      {
        paper_ids: paperIds.map(id => String(id)),
      },
      { cancelToken }
    );
    const successResponse: PaginationResponseV2<{ success: true }> = res.data;

    return successResponse;
  }

  public async getAuthorPapers(params: GetAuthorPapersParams): Promise<GetAuthorPaperResult> {
    const { authorId, query, page, size, sort, cancelToken } = params;
    const res = await this.get(`/search/author-papers`, {
      params: {
        aid: String(authorId),
        q: query || null,
        page: page - 1,
        size: size || DEFAULT_AUTHOR_PAPERS_SIZE,
        sort,
      },
      cancelToken,
    });

    const paperResult: AuthorPapersResponse = res.data.data;
    const safePaperList = paperResult.content.map(getIdSafePaper);
    const pageResult = paperResult.page;

    const normalizedPapersData = normalize(safePaperList, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: pageResult.size,
      page: pageResult.page + 1,
      first: pageResult.first,
      last: pageResult.last,
      numberOfElements: pageResult.numberOfElements,
      totalPages: pageResult.totalPages,
      totalElements: pageResult.totalElements,
    };
  }

  public async getSelectedPapers(authorId: string) {
    const res = await this.get(`/authors/${authorId}/papers/all`);

    const simplePapersResponse: PaginationResponseV2<SimplePaper[]> = res.data;
    const simplePapers = {
      ...simplePapersResponse,
      data: {
        ...simplePapersResponse.data,
        content: simplePapersResponse.data.content.map(paper => ({ ...paper, paperId: String(paper.paperId) })),
      },
    };
    return simplePapers;
  }

  public async getAuthor(
    authorId: string,
    cancelToken?: CancelToken
  ): Promise<{
    entities: { authors: { [authorId: string]: Author } };
    result: string;
  }> {
    const res = await this.get(`/authors/${authorId}`, { cancelToken });
    const normalizedData = normalize(res.data.data, authorSchema);
    return normalizedData;
  }

  public async updateAuthorProfileImage(profileSlug: string, profileImageData: FormData) {
    const res = await this.put(`/profiles/${profileSlug}/profile-image`, profileImageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const normalizedData = normalize(res.data.data.content, profileEntitySchema);

    return normalizedData;
  }

  public async getCoAuthors(
    authorId: string,
    cancelToken?: CancelToken
  ): Promise<{
    entities: { authors: { [authorId: string]: Author } };
    result: string[];
  }> {
    const res = await this.get(`/authors/${authorId}/co-authors`, { cancelToken });
    const authors: Author[] = res.data.data.map(getSafeAuthor);
    const authorsArray = authors.slice(0, 10);
    const normalizedData = normalize(authorsArray, authorListSchema);
    return normalizedData;
  }

  public async updateRepresentativePapers(params: UpdateRepresentativePapersParams): Promise<Paper[]> {
    const res = await this.put(`/authors/${params.authorId}/papers/representative`, {
      paper_ids: params.paperIds.map(id => String(id)),
    });

    const paperResponse: PaginationResponseV2<Paper[]> = res.data;
    const papers = paperResponse.data.content.map(getIdSafePaper);

    return papers;
  }
}

const authorAPI = new AuthorAPI();

export default authorAPI;
