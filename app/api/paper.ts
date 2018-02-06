import { List } from "immutable";
import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { IPaperRecord, IPaper, recordifyPaper } from "../model/paper";
import { IGetPapersParams, IGetPapersResult, IGetRefOrCitedPapersAPIParams } from "./types/paper";
import { IPaginationResponse } from "./types/common";

class PaperAPI extends PlutoAxios {
  public async getPapers({
    size = 10,
    page = 0,
    query,
    cancelTokenSource,
  }: IGetPapersParams): Promise<IGetPapersResult> {
    const getPapersResponse: AxiosResponse = await this.get("papers", {
      params: {
        size,
        page,
        query,
      },
      cancelToken: cancelTokenSource.token,
    });
    const getPapersData: IPaginationResponse = getPapersResponse.data;
    const rawPapers: IPaper[] = getPapersData.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
    });

    return {
      papers: List(recordifiedPapersArray),
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
    const params: { size: number; filter: string; page: number; cognitive?: boolean } = { size, page, filter };

    if (cognitive) {
      params.cognitive = true;
    }

    const getCitedPapersResponse: AxiosResponse = await this.get(`papers/${paperId}/cited`, {
      params,
      cancelToken: cancelTokenSource.token,
    });

    const getCitedPapersData: IPaginationResponse = getCitedPapersResponse.data;
    const rawPapers: IPaper[] = getCitedPapersData.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
    });

    return {
      papers: List(recordifiedPapersArray),
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
    cognitive = false,
    paperId,
    cancelTokenSource,
  }: IGetRefOrCitedPapersAPIParams): Promise<IGetPapersResult> {
    const params: { size: number; page: number; cognitive?: boolean } = { size, page };

    if (cognitive) {
      params.cognitive = true;
    }

    const getReferencePapersResponse: AxiosResponse = await this.get(`papers/${paperId}/references`, {
      params,
      cancelToken: cancelTokenSource.token,
    });
    const getReferencePapersData: IPaginationResponse = getReferencePapersResponse.data;
    const rawPapers: IPaper[] = getReferencePapersData.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
    });

    return {
      papers: List(recordifiedPapersArray),
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

  public async getPaper(paperId: number, cancelTokenSource: CancelTokenSource): Promise<IPaperRecord> {
    const getPaperResponse = await this.get(`papers/${paperId}`, {
      cancelToken: cancelTokenSource.token,
    });
    const rawPaper: IPaper = getPaperResponse.data;
    return recordifyPaper(rawPaper);
  }
}

const apiHelper = new PaperAPI();

export default apiHelper;
