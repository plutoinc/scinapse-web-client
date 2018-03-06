import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { PaperRecord, Paper, PaperFactory, PaperListFactory } from "../model/paper";
import { IGetPapersParams, IGetPapersResult, IGetRefOrCitedPapersAPIParams } from "./types/paper";
import { IPaginationResponse } from "./types/common";

interface GetRefOrCitedPapersBasicParams {
  size: number;
  filter: string;
  page: number;
  cognitive?: boolean;
}

export interface GetPaperParams {
  paperId: number;
  cancelTokenSource?: CancelTokenSource;
  cognitiveId?: number;
}

class PaperAPI extends PlutoAxios {
  public async getPapers({
    size = 10,
    page = 0,
    query,
    filter,
    cancelTokenSource,
  }: IGetPapersParams): Promise<IGetPapersResult> {
    const getPapersResponse: AxiosResponse = await this.get("papers", {
      params: {
        size,
        filter,
        page,
        query,
      },
      cancelToken: cancelTokenSource ? cancelTokenSource.token : null,
    });

    const getPapersData: IPaginationResponse = getPapersResponse.data;
    const rawPapers: Paper[] = getPapersData.content;

    return {
      papers: PaperListFactory(rawPapers),
      first: getPapersData.first,
      last: getPapersData.last,
      number: getPapersData.number,
      numberOfElements: getPapersData.numberOfElements,
      size: getPapersData.size,
      sort: getPapersData.sort,
      totalElements: getPapersData.totalElements,
      totalPages: getPapersData.totalPages,
    };
  }

  public async getCitedPapers({
    size = 10,
    page = 0,
    cognitive = false,
    paperId,
    filter,
    cancelTokenSource,
  }: IGetRefOrCitedPapersAPIParams): Promise<IGetPapersResult> {
    const params: GetRefOrCitedPapersBasicParams = { size, page, filter };

    if (cognitive) {
      params.cognitive = true;
    }

    const getCitedPapersResponse: AxiosResponse = await this.get(`papers/${paperId}/cited`, {
      params,
      cancelToken: cancelTokenSource ? cancelTokenSource.token : null,
    });

    const getCitedPapersData: IPaginationResponse = getCitedPapersResponse.data;
    const rawPapers: Paper[] = getCitedPapersData.content;

    return {
      papers: PaperListFactory(rawPapers),
      first: getCitedPapersData.first,
      last: getCitedPapersData.last,
      number: getCitedPapersData.number,
      numberOfElements: getCitedPapersData.numberOfElements,
      size: getCitedPapersData.size,
      sort: getCitedPapersData.sort,
      totalElements: getCitedPapersData.totalElements,
      totalPages: getCitedPapersData.totalPages,
    };
  }

  public async getReferencePapers({
    size = 10,
    page = 0,
    filter,
    cognitive = false,
    paperId,
    cancelTokenSource,
  }: IGetRefOrCitedPapersAPIParams): Promise<IGetPapersResult> {
    const params: GetRefOrCitedPapersBasicParams = { size, page, filter };

    if (cognitive) {
      params.cognitive = true;
    }

    const getReferencePapersResponse: AxiosResponse = await this.get(`papers/${paperId}/references`, {
      params,
      cancelToken: cancelTokenSource ? cancelTokenSource.token : null,
    });

    const getReferencePapersData: IPaginationResponse = getReferencePapersResponse.data;
    const rawPapers: Paper[] = getReferencePapersData.content;

    return {
      papers: PaperListFactory(rawPapers),
      first: getReferencePapersData.first,
      last: getReferencePapersData.last,
      number: getReferencePapersData.number,
      numberOfElements: getReferencePapersData.numberOfElements,
      size: getReferencePapersData.size,
      sort: getReferencePapersData.sort,
      totalElements: getReferencePapersData.totalElements,
      totalPages: getReferencePapersData.totalPages,
    };
  }

  public async getPaper(params: GetPaperParams): Promise<PaperRecord> {
    const requestId = this.bringGetPaperDestinationId(params);
    const options = this.buildGetPaperRequestOptions(params);
    const getPaperResponse = await this.get(`papers/${requestId}`, options);
    const rawPaper: Paper = getPaperResponse.data;

    return PaperFactory(rawPaper);
  }

  private bringGetPaperDestinationId(params: GetPaperParams) {
    if (params.cognitiveId) {
      return params.cognitiveId;
    } else {
      return params.paperId;
    }
  }

  private buildGetPaperRequestOptions(params: GetPaperParams) {
    if (params.cognitiveId) {
      return {
        cancelToken: params.cancelTokenSource ? params.cancelTokenSource.token : null,
        params: {
          cognitive: true,
        },
      };
    } else {
      return {
        cancelToken: params.cancelTokenSource ? params.cancelTokenSource.token : null,
      };
    }
  }
}

const apiHelper = new PaperAPI();

export default apiHelper;
