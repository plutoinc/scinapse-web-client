import { AxiosResponse, CancelToken } from 'axios';
import { normalize } from 'normalizr';
import PlutoAxios from './pluto';
import { Paper, paperSchema } from '../model/paper';
import { Journal, journalSchema } from '../model/journal';
import { PageObjectV2 } from './types/common';
import { PAPER_LIST_SORT_TYPES } from '../components/common/sortBox';
import { getIdSafeJournal, getIdSafePaper } from '../helpers/getIdSafeData';

interface PapersResult extends PageObjectV2 {
  entities: { papers: { [paperId: string]: Paper } };
  result: string[];
}

export interface GetPapersParams {
  journalId: string;
  cancelToken?: CancelToken;
  size?: number;
  page?: number;
  query?: string;
  sort?: PAPER_LIST_SORT_TYPES;
}

class JournalAPI extends PlutoAxios {
  public async getJournal(
    journalId: string,
    cancelToken?: CancelToken
  ): Promise<{
    entities: { journals: { [journalId: string]: Journal } };
    result: string;
  }> {
    const res: AxiosResponse = await this.get(`/journals/${journalId}`, { cancelToken });
    const journal = getIdSafeJournal(res.data.data);
    const normalizedData = normalize(journal, journalSchema);

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
    const getPapersResponse: AxiosResponse = await this.get(`/search/journal-papers`, {
      params: {
        jid: String(journalId),
        size,
        page: page - 1,
        q: query,
        sort,
      },
      cancelToken,
    });

    const res = getPapersResponse.data.data;
    const papers: Paper[] = res.content.map(getIdSafePaper);
    const normalizedPapersData = normalize(papers, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: res.page.size,
      page: res.page.page + 1,
      first: res.page.first,
      last: res.page.last,
      numberOfElements: res.page.numberOfElements,
      totalPages: res.page.totalPages,
      totalElements: res.page.totalElements,
    };
  }
}

const journalApi = new JournalAPI();

export default journalApi;
