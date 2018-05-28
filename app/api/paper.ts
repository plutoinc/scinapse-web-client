import { List } from "immutable";
import { normalize } from "normalizr";
import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { PaperRecord, Paper, PaperListFactory, paperSchema } from "../model/paper";
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
  citation_text: string | null;
  format: string | null;
}

interface AggregationFetchingResult {
  data: AggregationDataRecord;
  meta: {
    available: boolean;
  };
}

export interface GetRelatedPapersParams {
  paperId: number;
}

export interface GetOtherPapersFromAuthorParams {
  paperId: number;
  authorId: number;
}

class PaperAPI extends PlutoAxios {
  public async getAggregation(params: GetAggregationParams): Promise<AggregationFetchingResult> {
    const getAggregationResponse: AxiosResponse = await this.get("/papers/aggregate", {
      params: {
        filter: params.filter,
        query: params.query,
      },
      cancelToken: params.cancelTokenSource && params.cancelTokenSource.token,
    });

    const aggregationRawResult: GetAggregationRawResult = getAggregationResponse.data.data;
    const aggregationData = this.setRawAggregationDataWithState(aggregationRawResult);
    return {
      data: AggregationFactory(aggregationData)!,
      meta: {
        available: getAggregationResponse.data.meta.available,
      },
    };
  }

  public async getPapers({
    size = 10,
    page = 0,
    sort,
    query,
    filter,
    cancelTokenSource,
  }: GetPapersParams): Promise<GetPapersResult> {
    const getPapersResponse: AxiosResponse = await this.get("/papers", {
      params: {
        size,
        page,
        sort,
        filter,
        query,
      },
      cancelToken: cancelTokenSource ? cancelTokenSource.token : undefined,
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
    page = 1,
    paperId,
    filter,
    cancelTokenSource,
  }: GetRefOrCitedPapersParams): Promise<GetPapersResult> {
    const params: GetRefOrCitedPapersBasicParams = { size, page: page - 1, filter };

    const getCitedPapersResponse: AxiosResponse = await this.get(`/papers/${paperId}/cited`, {
      params,
      cancelToken: cancelTokenSource ? cancelTokenSource.token : undefined,
    });

    const getCitedPapersData: PaginationResponse = getCitedPapersResponse.data;
    const rawPapers: Paper[] = getCitedPapersData.content;

    return {
      papers: PaperListFactory(rawPapers),
      first: getCitedPapersData.first,
      last: getCitedPapersData.last,
      number: getCitedPapersData.number + 1,
      numberOfElements: getCitedPapersData.numberOfElements,
      size: getCitedPapersData.size,
      sort: getCitedPapersData.sort,
      totalElements: getCitedPapersData.totalElements,
      totalPages: getCitedPapersData.totalPages,
    };
  }

  public async getReferencePapers({
    size = 10,
    page = 1,
    filter,
    paperId,
    cancelTokenSource,
  }: GetRefOrCitedPapersParams): Promise<GetPapersResult> {
    const params: GetRefOrCitedPapersBasicParams = { size, page: page - 1, filter };

    const getReferencePapersResponse: AxiosResponse = await this.get(`/papers/${paperId}/references`, {
      params,
      cancelToken: cancelTokenSource ? cancelTokenSource.token : undefined,
    });

    const getReferencePapersData: PaginationResponse = getReferencePapersResponse.data;
    const rawPapers: Paper[] = getReferencePapersData.content;

    return {
      papers: PaperListFactory(rawPapers),
      first: getReferencePapersData.first,
      last: getReferencePapersData.last,
      number: getReferencePapersData.number + 1,
      numberOfElements: getReferencePapersData.numberOfElements,
      size: getReferencePapersData.size,
      sort: getReferencePapersData.sort,
      totalElements: getReferencePapersData.totalElements,
      totalPages: getReferencePapersData.totalPages,
    };
  }

  public async getPaper(
    params: GetPaperParams,
  ): Promise<{
    entities: { papers: { [paperId: number]: Paper } };
    result: number;
  }> {
    const getPaperResponse = await this.get(`/papers/${params.paperId}`, {
      cancelToken: params.cancelTokenSource && params.cancelTokenSource.token,
    });
    const paper: Paper = getPaperResponse.data;

    const normalizedData = normalize(paper, paperSchema);

    return normalizedData;
  }

  public async getRelatedPapers(params: GetRelatedPapersParams): Promise<List<PaperRecord | null>> {
    const getPapersResponse = await this.get(`/papers/${params.paperId}/related`);
    const rawPapers: Paper[] = getPapersResponse.data.data;
    const paperList = PaperListFactory(rawPapers);

    return paperList;
  }

  public async getOtherPapersFromAuthor(params: GetOtherPapersFromAuthorParams): Promise<List<PaperRecord | null>> {
    const getPapersResponse = await this.get(`/papers/${params.paperId}/authors/${params.authorId}/related`);
    const rawPapers: Paper[] = getPapersResponse.data.data;
    const paperList = PaperListFactory(rawPapers);

    return paperList;
  }

  public async getCitationText(params: GetCitationTextParams): Promise<GetCitationTextResult> {
    const enumValue = AvailableCitationType[params.type];
    const res: AxiosResponse = await this.get(`/papers/${params.paperId}/citation?format=${enumValue}`);

    const rawResult: GetCitationTextRawResult = res.data.data;

    return {
      citationText: rawResult.citation_text || "",
      format: rawResult.format || "",
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
