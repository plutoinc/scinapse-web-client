import { AxiosResponse } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { Paper, paperSchema } from "../model/paper";
import { Journal, journalSchema } from "../model/journal";
import { CommonPaginationResponsePart } from "./types/common";
import { PAPER_LIST_SORT_TYPES } from "../components/common/sortBox";

interface PapersResult extends CommonPaginationResponsePart {
  entities: { papers: { [paperId: number]: Paper } };
  result: number[];
}

export interface GetPapersParams {
  journalId: number;
  size?: number;
  page?: number;
  query?: string;
  sort?: PAPER_LIST_SORT_TYPES;
}

class JournalAPI extends PlutoAxios {
  public async getJournal(
    journalId: number
  ): Promise<{
    entities: { journals: { [journalId: number]: Journal } };
    result: number;
  }> {
    const getJournalResponse: AxiosResponse = await this.get(`/journals/${journalId}`);
    const normalizedData = normalize(getJournalResponse.data.data, journalSchema);

    return normalizedData;
  }

  public async getPapers({ size = 10, page = 1, journalId, query, sort }: GetPapersParams): Promise<PapersResult> {
    const getPapersResponse: AxiosResponse = await this.get(`/journals/${journalId}/papers`, {
      params: {
        size,
        page: page - 1,
        query,
        sort,
      },
    });

    const papers: Paper[] | undefined = getPapersResponse.data.data.content;

    const authorSlicedPapers = papers
      ? papers.map(paper => {
          return { ...paper, authors: paper.authors.slice(0, 10) };
        })
      : [];

    const normalizedPapersData = normalize(authorSlicedPapers, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: getPapersResponse.data.data.size,
      number: getPapersResponse.data.data.number + 1,
      sort: getPapersResponse.data.data.sort,
      first: getPapersResponse.data.data.first,
      last: getPapersResponse.data.data.last,
      numberOfElements: getPapersResponse.data.data.numberOfElements,
      totalPages: getPapersResponse.data.data.totalPages,
      totalElements: getPapersResponse.data.data.totalElements,
    };
  }
}

const journalApi = new JournalAPI();

export default journalApi;
