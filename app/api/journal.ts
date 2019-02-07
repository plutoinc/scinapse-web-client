import { AxiosResponse, CancelToken } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { Paper, paperSchema } from "../model/paper";
import { Journal, journalSchema } from "../model/journal";
import { CommonPaginationResponsePart } from "./types/common";
import { PAPER_LIST_SORT_TYPES } from "../components/common/sortBox";
import { camelCaseKeys } from "../helpers/camelCaseKeys";

interface PapersResult extends CommonPaginationResponsePart {
  entities: { papers: { [paperId: number]: Paper } };
  result: number[];
}

export interface GetPapersParams {
  journalId: number;
  cancelToken: CancelToken;
  size?: number;
  page?: number;
  query?: string;
  sort?: PAPER_LIST_SORT_TYPES;
}

class JournalAPI extends PlutoAxios {
  public async getJournal(
    journalId: number,
    cancelToken: CancelToken
  ): Promise<{
    entities: { journals: { [journalId: number]: Journal } };
    result: number;
  }> {
    const getJournalResponse: AxiosResponse = await this.get(`/journals/${journalId}`, { cancelToken });
    const camelizedRes = camelCaseKeys(getJournalResponse.data.data);
    const normalizedData = normalize(camelizedRes, journalSchema);

    return normalizedData;
  }

  public async getPapers({
    size = 10,
    page = 1,
    journalId,
    query,
    sort,
    cancelToken,
  }: GetPapersParams): Promise<PapersResult> {
    const getPapersResponse: AxiosResponse = await this.get(`/journals/${journalId}/papers`, {
      params: {
        size,
        page: page - 1,
        query,
        sort,
      },
      cancelToken,
    });

    const camelizedRes = camelCaseKeys(getPapersResponse.data.data);
    const papers: Paper[] | undefined = camelizedRes.content;

    const authorSlicedPapers = papers
      ? papers.map(paper => {
          return { ...paper, authors: paper.authors.slice(0, 10) };
        })
      : [];

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
}

const journalApi = new JournalAPI();

export default journalApi;
