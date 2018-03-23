import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { PaperRecord, Paper, PaperFactory, PaperListFactory } from "../model/paper";
import { GetPapersParams, GetPapersResult, GetRefOrCitedPapersAPIParams, GetAggregationParams } from "./types/paper";
import { IPaginationResponse } from "./types/common";
import {
  AggregationDataRecord,
  GetAggregationRawResult,
  AggregationFactory,
  AggregationData,
} from "../model/aggregation";

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
  public async getAggregation(params: GetAggregationParams): Promise<AggregationDataRecord> {
    const getAggregationResponse: AxiosResponse = await this.get("papers/aggregate", {
      params: {
        filter: params.filter,
        query: params.query,
      },
      cancelToken: params.cancelTokenSource && params.cancelTokenSource.token,
    });

    const aggregationRawResult: GetAggregationRawResult = getAggregationResponse.data.data;
    const aggregationData = this.setRawAggregationDataWithState(aggregationRawResult);
    return AggregationFactory(aggregationData);
  }

  public async getPapers({
    size = 10,
    page = 0,
    query,
    filter,
    cancelTokenSource,
  }: GetPapersParams): Promise<GetPapersResult> {
    const getPapersResponse: AxiosResponse = await this.get("papers", {
      params: {
        size,
        page,
        filter,
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
  }: GetRefOrCitedPapersAPIParams): Promise<GetPapersResult> {
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
  }: GetRefOrCitedPapersAPIParams): Promise<GetPapersResult> {
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

  private setRawAggregationDataWithState(rawAggregationResult: GetAggregationRawResult): AggregationData {
    const fosList = rawAggregationResult.fos_list.map(fos => {
      return { ...fos, ...{ isSelected: false } };
    });

    const journals = rawAggregationResult.journals.map(journal => {
      return { ...journal, ...{ isSelected: false } };
    });

    return {
      journals,
      fosList,
      impactFactors: rawAggregationResult.impact_factors,
      years: rawAggregationResult.years,
    };
  }
}

const apiHelper = new PaperAPI();

export default apiHelper;
