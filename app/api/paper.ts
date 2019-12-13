import { AxiosResponse, CancelToken } from 'axios';
import PlutoAxios from './pluto';
import { Paper } from '../model/paper';
import { PaginationResponseV2, PageObjectV2 } from './types/common';
import { AvailableCitationType } from '../containers/paperShow/records';
import { PaperAuthor } from '../model/author';
import { getIdSafePaperAuthor } from '../helpers/getIdSafeData';

export interface GetReferenceOrCitedPapersResult extends PageObjectV2 {
  entities: { papers: { [paperId: string]: Paper } };
  result: string[];
}

export interface GetPaperParams {
  paperId: string;
  cancelToken?: CancelToken;
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
  cancelToken?: CancelToken;
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

  public async getBestPdfOfPaper(params: { paperId: string; cancelToken: CancelToken }) {
    const res = await this.post(`/papers/${params.paperId}/pdf`, null, {
      cancelToken: params.cancelToken,
    });

    return res.data.data.content;
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

  public async getSources(paperIds: string[]): Promise<PaperSource[]> {
    const res = await this.get('/papers/sources', {
      params: {
        paper_ids: paperIds.join(','),
      },
    });

    return res.data.data.content;
  }
}

const paperAPI = new PaperAPI();

export default paperAPI;
