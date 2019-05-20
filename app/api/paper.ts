import { normalize } from "normalizr";
import { AxiosResponse, CancelToken } from "axios";
import PlutoAxios from "./pluto";
import { Paper, paperSchema } from "../model/paper";
import { GetRefOrCitedPapersParams } from "./types/paper";
import { CommonPaginationResponsePart, PaginationResponseV2 } from "./types/common";
import { AvailableCitationType } from "../containers/paperShow/records";
import { PaperAuthor } from "../model/author";
import { camelCaseKeys } from "../helpers/camelCaseKeys";

interface GetRefOrCitedPapersBasicParams {
  size: number;
  filter: string;
  page: number;
  cognitive?: boolean;
}

export interface GetReferenceOrCitedPapersResult extends CommonPaginationResponsePart {
  entities: { papers: { [paperId: number]: Paper } };
  result: number[];
}

export interface GetPaperParams {
  paperId: number;
  cancelToken: CancelToken;
}

export interface GetCitationTextParams {
  type: AvailableCitationType;
  paperId: number;
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
  paperId: number;
  cancelToken: CancelToken;
}

export interface GetOtherPapersFromAuthorParams {
  paperId: number;
  authorId: number;
  cancelToken: CancelToken;
}

export interface GetAuthorsOfPaperParams {
  paperId: number;
  page: number;
  cancelToken: CancelToken;
}

interface RequestFullTextParams {
  paperId: number;
  email: string;
  name?: string;
  message?: string;
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
    filter,
    cancelToken,
  }: GetRefOrCitedPapersParams): Promise<GetReferenceOrCitedPapersResult> {
    const params: GetRefOrCitedPapersBasicParams = { size, page: page - 1, filter };

    const getCitedPapersResponse: AxiosResponse = await this.get(`/papers/${paperId}/cited`, {
      params,
      cancelToken,
    });

    const camelizedRes = camelCaseKeys(getCitedPapersResponse.data);
    const papers = camelizedRes.content as Paper[];
    const authorSlicedPapers = papers.map(paper => {
      return { ...paper, authors: paper.authors.slice(0, 10) };
    });

    const normalizedPapersData = normalize(authorSlicedPapers, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: camelizedRes.size,
      number: camelizedRes.number + 1,
      sort: camelizedRes.sort,
      first: camelizedRes.first,
      last: camelizedRes.last,
      numberOfElements: camelizedRes.numberOfElements,
      totalPages: camelizedRes.totalPages,
      totalElements: camelizedRes.totalElements,
    };
  }

  public async getReferencePapers({
    size = 10,
    page = 1,
    filter,
    paperId,
    cancelToken,
  }: GetRefOrCitedPapersParams): Promise<GetReferenceOrCitedPapersResult> {
    const params: GetRefOrCitedPapersBasicParams = { size, page: page - 1, filter };
    const getReferencePapersResponse: AxiosResponse = await this.get(`/papers/${paperId}/references`, {
      params,
      cancelToken,
    });
    const camelizedRes = camelCaseKeys(getReferencePapersResponse.data);
    const papers = camelizedRes.content as Paper[];
    const authorSlicedPapers = papers.map(paper => {
      return { ...paper, authors: paper.authors.slice(0, 10) };
    });
    const normalizedPapersData = normalize(authorSlicedPapers, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: camelizedRes.size,
      number: camelizedRes.number + 1,
      sort: camelizedRes.sort,
      first: camelizedRes.first,
      last: camelizedRes.last,
      numberOfElements: camelizedRes.numberOfElements,
      totalPages: camelizedRes.totalPages,
      totalElements: camelizedRes.totalElements,
    };
  }

  public async getPaper(
    params: GetPaperParams
  ): Promise<{
    entities: { papers: { [paperId: number]: Paper } };
    result: number;
  }> {
    const paperRes = await this.get(`/papers/${params.paperId}`, {
      cancelToken: params.cancelToken,
    });
    const camelizedRes = camelCaseKeys(paperRes.data);
    const paper: Paper = camelizedRes;
    return normalize(paper, paperSchema);
  }

  public async getRelatedPapers(params: GetRelatedPapersParams): Promise<Paper[]> {
    const getPapersResponse = await this.get(`/papers/${params.paperId}/related`, {
      cancelToken: params.cancelToken,
    });
    const camelizedRes = camelCaseKeys(getPapersResponse.data);
    const papers: Paper[] = camelizedRes.data;
    return papers;
  }

  public async getOtherPapersFromAuthor(
    params: GetOtherPapersFromAuthorParams
  ): Promise<{
    entities: { papers: { [paperId: number]: Paper } };
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

  public async getBestPdfOfPaper(params: { paperId: number }) {
    const res = await this.post(`/papers/${params.paperId}/pdf`);
    const rawResult = res.data.data.content;

    return camelCaseKeys(rawResult);
  }
}

const paperAPI = new PaperAPI();

export default paperAPI;
