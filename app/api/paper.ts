import { normalize } from 'normalizr';
import { AxiosResponse, CancelToken } from 'axios';
import PlutoAxios from './pluto';
import { Paper, paperSchema } from '../model/paper';
import { GetRefOrCitedPapersParams } from './types/paper';
import { PaginationResponseV2, PageObjectV2 } from './types/common';
import { AvailableCitationType } from '../containers/paperShow/records';
import { PaperAuthor } from '../model/author';
import { camelCaseKeys } from '../helpers/camelCaseKeys';

export interface GetReferenceOrCitedPapersResult extends PageObjectV2 {
  entities: { papers: { [paperId: string]: Paper } };
  result: string[];
}

export interface GetPaperParams {
  paperId: string;
  cancelToken: CancelToken;
}

export interface GetCitationTextParams {
  type: AvailableCitationType;
  paperId: string;
}

export interface GetCitationTextResult {
  citationText: string;
  format: string;
}

export interface GetCitationTextRawResult {
  citation_text: string | null;
  format: string | null;
}

export interface GetRelatedPapersParams {
  paperId: string;
  cancelToken: CancelToken;
}

export interface GetOtherPapersFromAuthorParams {
  paperId: string;
  authorId: number;
  cancelToken: CancelToken;
}

export interface GetAuthorsOfPaperParams {
  paperId: string;
  page: number;
  cancelToken: CancelToken;
}

interface RequestFullTextParams {
  paperId: string;
  email: string;
  name?: string;
  message?: string;
}

export interface PaperSource {
  paperId: string;
  doi: string | null;
  source: string | null;
  host: string | null;
}

class PaperAPI extends PlutoAxios {
  public async getAuthorsOfPaper({
    paperId,
    page,
    cancelToken,
  }: GetAuthorsOfPaperParams): Promise<PaginationResponseV2<PaperAuthor[]>> {
    const res = await this.get(`/papers/${paperId}/authors`, { params: { page: page - 1 }, cancelToken });
    const rawData: PaginationResponseV2<PaperAuthor[]> = camelCaseKeys(res.data);

    return rawData;
  }

  public async getCitedPapers({
    size = 10,
    page = 1,
    paperId,
    query,
    sort,
  }: GetRefOrCitedPapersParams): Promise<GetReferenceOrCitedPapersResult> {
    const getCitedPapersResponse: AxiosResponse = await this.get(`/search/citations`, {
      params: {
        pid: paperId,
        size,
        page: page - 1,
        q: query,
        sort,
      },
    });

    const camelizedRes = camelCaseKeys(getCitedPapersResponse.data.data);
    const papers = camelizedRes.content as Paper[];
    const authorSlicedPapers = papers.map(paper => {
      return { ...paper, authors: paper.authors.slice(0, 10) };
    });

    const normalizedPapersData = normalize(authorSlicedPapers, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: camelizedRes.page.size,
      page: camelizedRes.page.page + 1,
      first: camelizedRes.page.first,
      last: camelizedRes.page.last,
      numberOfElements: camelizedRes.page.numberOfElements,
      totalPages: camelizedRes.page.totalPages,
      totalElements: camelizedRes.page.totalElements,
    };
  }

  public async getReferencePapers({
    size = 10,
    page = 1,
    query,
    sort,
    paperId,
  }: GetRefOrCitedPapersParams): Promise<GetReferenceOrCitedPapersResult> {
    const getReferencePapersResponse: AxiosResponse = await this.get(`/search/references`, {
      params: {
        pid: paperId,
        size,
        page: page - 1,
        q: query,
        sort,
      },
    });
    const camelizedRes = camelCaseKeys(getReferencePapersResponse.data.data);
    const papers = camelizedRes.content as Paper[];
    const authorSlicedPapers = papers.map(paper => {
      return { ...paper, authors: paper.authors.slice(0, 10) };
    });
    const normalizedPapersData = normalize(authorSlicedPapers, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: camelizedRes.page.size,
      page: camelizedRes.page.page + 1,
      first: camelizedRes.page.first,
      last: camelizedRes.page.last,
      numberOfElements: camelizedRes.page.numberOfElements,
      totalPages: camelizedRes.page.totalPages,
      totalElements: camelizedRes.page.totalElements,
    };
  }

  public async getPaper(
    params: GetPaperParams
  ): Promise<{
    entities: { papers: { [paperId: string]: Paper } };
    result: string;
  }> {
    const paperRes = await this.get(`/papers/${params.paperId}`, {
      cancelToken: params.cancelToken,
    });
    const camelizedRes = camelCaseKeys(paperRes.data);
    const paper: Paper = camelizedRes;
    return normalize(paper, paperSchema);
  }

  public async getRelatedPapers(
    params: GetRelatedPapersParams
  ): Promise<{
    entities: { papers: { [paperId: string]: Paper } };
    result: string[];
  }> {
    const getPapersResponse = await this.get(`/papers/${params.paperId}/related`, {
      cancelToken: params.cancelToken,
    });
    const camelizedRes = camelCaseKeys(getPapersResponse.data);
    const papers: Paper[] = camelizedRes.data;
    return normalize(papers, [paperSchema]);
  }

  public async getOtherPapersFromAuthor(
    params: GetOtherPapersFromAuthorParams
  ): Promise<{
    entities: { papers: { [paperId: string]: Paper } };
    result: number[];
  }> {
    const getPapersResponse = await this.get(`/papers/${params.paperId}/authors/${params.authorId}/related`, {
      cancelToken: params.cancelToken,
    });
    const camelizedRes = camelCaseKeys(getPapersResponse.data);
    const rawPapers: Paper[] = camelizedRes.data;
    const authorSlicedPapers = rawPapers.map(paper => {
      return { ...paper, authors: paper.authors.slice(0, 10) };
    });

    const normalizedData = normalize(authorSlicedPapers, [paperSchema]);

    return normalizedData;
  }

  public async getCitationText(params: GetCitationTextParams): Promise<GetCitationTextResult> {
    const enumValue = AvailableCitationType[params.type];
    const res: AxiosResponse = await this.get(`/papers/${params.paperId}/citation?format=${enumValue}`);

    const rawResult: GetCitationTextRawResult = res.data.data;

    return camelCaseKeys(rawResult);
  }

  public async requestFullText(params: RequestFullTextParams) {
    const res = await this.post(`/papers/${params.paperId}/request`, {
      email: params.email,
      message: params.message || null,
      name: params.name || null,
    });
    return res;
  }

  public async getBestPdfOfPaper(params: { paperId: string; cancelToken: CancelToken }) {
    const res = await this.post(`/papers/${params.paperId}/pdf`, null, {
      cancelToken: params.cancelToken,
    });
    const rawResult = res.data.data.content;

    return camelCaseKeys(rawResult);
  }

  public async getPDFBlob(targetURL: string, cancelToken: CancelToken) {
    const res = await this.get(`/proxy/pdf`, {
      params: {
        url: targetURL,
      },
      responseType: 'blob',
      cancelToken,
    });

    return { data: res.data as Blob };
  }

  public async getSources(paperIds: string[]) {
    const res = await this.get('/papers/sources', {
      params: {
        paper_ids: paperIds.join(','),
      },
    });

    return camelCaseKeys(res.data.data.content) as PaperSource[];
  }

  public async getLastRequestDate(paperId: string) {
    const res = await this.get(`/papers/${paperId}/request`);

    return camelCaseKeys(res.data.data.content);
  }
}

const paperAPI = new PaperAPI();

export default paperAPI;
