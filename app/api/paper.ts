import { normalize } from 'normalizr';
import { AxiosResponse, CancelToken } from 'axios';
import PlutoAxios from './pluto';
import { Paper, paperSchema, PaperPdf } from '../model/paper';
import { GetRefOrCitedPapersParams } from './types/paper';
import { PaginationResponseV2, PageObjectV2 } from './types/common';
import { AvailableCitationType } from '../containers/paperShow/records';
import { PaperAuthor } from '../model/author';
import { getIdSafePaperAuthor, getIdSafePaper } from '../helpers/getIdSafeData';

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
  authorId: string;
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
    const rawData: PaginationResponseV2<PaperAuthor[]> = res.data;

    return {
      ...rawData,
      data: {
        ...rawData.data,
        content: rawData.data.content.map(getIdSafePaperAuthor),
      },
    };
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
        pid: String(paperId),
        size,
        page: page - 1,
        q: query,
        sort,
      },
    });

    const res = getCitedPapersResponse.data.data;
    const papers: Paper[] = res.content.map(getIdSafePaper);
    const normalizedPapersData = normalize(papers, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: res.page.size,
      page: res.page.page + 1,
      first: res.page.first,
      last: res.page.last,
      numberOfElements: res.page.numberOfElements,
      totalPages: res.page.totalPages,
      totalElements: res.page.totalElements,
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
        pid: String(paperId),
        size,
        page: page - 1,
        q: query,
        sort,
      },
    });
    const res = getReferencePapersResponse.data.data;
    const papers: Paper[] = res.content.map(getIdSafePaper);
    const normalizedPapersData = normalize(papers, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: res.page.size,
      page: res.page.page + 1,
      first: res.page.first,
      last: res.page.last,
      numberOfElements: res.page.numberOfElements,
      totalPages: res.page.totalPages,
      totalElements: res.page.totalElements,
    };
  }

  public async getPaper(
    params: GetPaperParams
  ): Promise<{
    entities: { papers: { [paperId: string]: Paper } };
    result: string;
  }> {
    const res = await this.get(`/papers/${params.paperId}`, {
      cancelToken: params.cancelToken,
    });
    const paper: Paper = getIdSafePaper(res.data);
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
    const papers = getPapersResponse.data.data.map(getIdSafePaper);
    return normalize(papers, [paperSchema]);
  }

  public async getCitationText(params: GetCitationTextParams): Promise<GetCitationTextResult> {
    const enumValue = AvailableCitationType[params.type];
    const res: AxiosResponse = await this.get(`/papers/${params.paperId}/citation?format=${enumValue}`);

    return res.data.data;
  }

  public async requestFullText(params: RequestFullTextParams) {
    const res = await this.post(`/papers/${params.paperId}/request`, {
      email: params.email,
      message: params.message || null,
      name: params.name || null,
    });
    return res;
  }

  public async getBestPdfOfPaper(params: { paperId: string }) {
    const res = await this.post(`/papers/${params.paperId}/pdf`, null);

    return res.data.data.content as PaperPdf;
  }

  public async getPDFBlob(targetURL: string) {
    const res = await this.get(`/proxy/pdf`, {
      params: {
        url: targetURL,
      },
      responseType: 'arraybuffer',
    });

    return { data: res.data as ArrayBuffer };
  }

  public async getSources(paperIds: string[]): Promise<PaperSource[]> {
    const res = await this.get('/papers/sources', {
      params: {
        paper_ids: paperIds.join(','),
      },
    });

    return res.data.data.content;
  }

  public async getLastRequestDate(paperId: string) {
    const res = await this.get(`/papers/${paperId}/request`);

    return res.data.data.content;
  }
}

const paperAPI = new PaperAPI();

export default paperAPI;
