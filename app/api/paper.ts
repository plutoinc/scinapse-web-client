import { normalize } from "normalizr";
import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { Paper, paperSchema } from "../model/paper";
import { GetPapersParams, GetPapersResult, GetAggregationParams, GetRefOrCitedPapersParams } from "./types/paper";
import { PaginationResponse, CommonPaginationResponsePart } from "./types/common";
import { GetAggregationRawResult, AggregationData } from "../model/aggregation";
import { AvailableCitationType } from "../components/paperShow/records";

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
  data: AggregationData;
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
      data: aggregationData,
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
    const papers: Paper[] = getPapersData.content;
    const authorSlicedPapers = papers.map(paper => {
      return { ...paper, authors: paper.authors.slice(0, 10) };
    });

    return {
      papers: authorSlicedPapers,
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
  }: GetRefOrCitedPapersParams): Promise<GetReferenceOrCitedPapersResult> {
    const params: GetRefOrCitedPapersBasicParams = { size, page: page - 1, filter };

    const getCitedPapersResponse: AxiosResponse = await this.get(`/papers/${paperId}/cited`, {
      params,
      cancelToken: cancelTokenSource ? cancelTokenSource.token : undefined,
    });

    const papers = getCitedPapersResponse.data.content as Paper[];
    const authorSlicedPapers = papers.map(paper => {
      return { ...paper, authors: paper.authors.slice(0, 10) };
    });

    const normalizedPapersData = normalize(authorSlicedPapers, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: getCitedPapersResponse.data.size,
      number: getCitedPapersResponse.data.number + 1,
      sort: getCitedPapersResponse.data.sort,
      first: getCitedPapersResponse.data.first,
      last: getCitedPapersResponse.data.last,
      numberOfElements: getCitedPapersResponse.data.numberOfElements,
      totalPages: getCitedPapersResponse.data.totalPages,
      totalElements: getCitedPapersResponse.data.totalElements,
    };
  }

  public async getReferencePapers({
    size = 10,
    page = 1,
    filter,
    paperId,
    cancelTokenSource,
  }: GetRefOrCitedPapersParams): Promise<GetReferenceOrCitedPapersResult> {
    const params: GetRefOrCitedPapersBasicParams = { size, page: page - 1, filter };

    const getReferencePapersResponse: AxiosResponse = await this.get(`/papers/${paperId}/references`, {
      params,
      cancelToken: cancelTokenSource ? cancelTokenSource.token : undefined,
    });

    const papers = getReferencePapersResponse.data.content as Paper[];
    const authorSlicedPapers = papers.map(paper => {
      return { ...paper, authors: paper.authors.slice(0, 10) };
    });

    const normalizedPapersData = normalize(authorSlicedPapers, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: getReferencePapersResponse.data.size,
      number: getReferencePapersResponse.data.number + 1,
      sort: getReferencePapersResponse.data.sort,
      first: getReferencePapersResponse.data.first,
      last: getReferencePapersResponse.data.last,
      numberOfElements: getReferencePapersResponse.data.numberOfElements,
      totalPages: getReferencePapersResponse.data.totalPages,
      totalElements: getReferencePapersResponse.data.totalElements,
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
    const authorSlicedPaper = { ...paper, authors: paper.authors.slice(0, 10) };

    const normalizedData = normalize(authorSlicedPaper, paperSchema);

    return normalizedData;
  }

  public async getRelatedPapers(
    params: GetRelatedPapersParams,
  ): Promise<{
    entities: { papers: { [paperId: number]: Paper } };
    result: number[];
  }> {
    const getPapersResponse = await this.get(`/papers/${params.paperId}/related`);
    const rawPapers: Paper[] = getPapersResponse.data.data;
    const authorSlicedPapers = rawPapers.map(paper => {
      return { ...paper, authors: paper.authors.slice(0, 10) };
    });

    const normalizedData = normalize(authorSlicedPapers, [paperSchema]);

    return normalizedData;
  }

  public async getOtherPapersFromAuthor(
    params: GetOtherPapersFromAuthorParams,
  ): Promise<{
    entities: { papers: { [paperId: number]: Paper } };
    result: number[];
  }> {
    const getPapersResponse = await this.get(`/papers/${params.paperId}/authors/${params.authorId}/related`);
    const rawPapers: Paper[] = getPapersResponse.data.data;
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
