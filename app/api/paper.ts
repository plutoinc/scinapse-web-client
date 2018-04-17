import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { PaperRecord, Paper, PaperFactory, PaperListFactory } from "../model/paper";
import { GetPapersParams, GetPapersResult, GetAggregationParams, GetRefOrCitedPapersParams } from "./types/paper";
import { PaginationResponse } from "./types/common";
import {
  AggregationDataRecord,
  GetAggregationRawResult,
  AggregationFactory,
  AggregationData,
} from "../model/aggregation";
import { AvailableCitationType } from "../components/paperShow/records";

interface GetRefOrCitedPapersBasicParams {
  size: number;
  filter: string;
  page: number;
  cognitive?: boolean;
}

export interface GetPaperParams {
  paperId: number;
  cancelTokenSource?: CancelTokenSource;
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
  citation_text: string;
  format: string;
}

interface AggregationFetchingResult {
  data: AggregationDataRecord;
  meta: {
    available: boolean;
  };
}

class PaperAPI extends PlutoAxios {
  public async getAggregation(params: GetAggregationParams): Promise<AggregationFetchingResult> {
    const getAggregationResponse: AxiosResponse = await this.get("papers/aggregate", {
      params: {
        filter: params.filter,
        query: params.query,
      },
      cancelToken: params.cancelTokenSource && params.cancelTokenSource.token,
    });

    const aggregationRawResult: GetAggregationRawResult = getAggregationResponse.data.data;
    const aggregationData = this.setRawAggregationDataWithState(aggregationRawResult);
    return {
      data: AggregationFactory(aggregationData),
      meta: {
        available: getAggregationResponse.data.meta.available,
      },
    };
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

    const getPapersData: PaginationResponse = getPapersResponse.data;
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
    paperId,
    filter,
    cancelTokenSource,
  }: GetRefOrCitedPapersParams): Promise<GetPapersResult> {
    const params: GetRefOrCitedPapersBasicParams = { size, page, filter };

    const getCitedPapersResponse: AxiosResponse = await this.get(`papers/${paperId}/cited`, {
      params,
      cancelToken: cancelTokenSource ? cancelTokenSource.token : null,
    });

    const getCitedPapersData: PaginationResponse = getCitedPapersResponse.data;
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
    paperId,
    cancelTokenSource,
  }: GetRefOrCitedPapersParams): Promise<GetPapersResult> {
    const params: GetRefOrCitedPapersBasicParams = { size, page, filter };

    const getReferencePapersResponse: AxiosResponse = await this.get(`papers/${paperId}/references`, {
      params,
      cancelToken: cancelTokenSource ? cancelTokenSource.token : null,
    });

    const getReferencePapersData: PaginationResponse = getReferencePapersResponse.data;
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
    const getPaperResponse = await this.get(`papers/${params.paperId}`, {
      cancelToken: params.cancelTokenSource && params.cancelTokenSource.token,
    });
    const rawPaper: Paper = getPaperResponse.data;

    return PaperFactory(rawPaper);
  }

  public async getCitationText(params: GetCitationTextParams): Promise<GetCitationTextResult> {
    const enumValue = AvailableCitationType[params.type];
    const res: AxiosResponse = await this.get(`/papers/${params.paperId}/citation?format=${enumValue}`);

    const rawResult: GetCitationTextRawResult = res.data.data;

    return {
      citationText: rawResult.citation_text,
      format: rawResult.format,
    };
  }

  private setRawAggregationDataWithState(rawAggregationResult: GetAggregationRawResult): AggregationData {
    return {
      journals: rawAggregationResult.journals,
      fosList: rawAggregationResult.fos_list,
      impactFactors: rawAggregationResult.impact_factors,
      years: rawAggregationResult.years,
    };
  }
}

const apiHelper = new PaperAPI();

export default apiHelper;
