import { normalize } from 'normalizr';
import PlutoAxios from '../pluto';
import { Journal, journalSchema } from '../../model/journal';
import { RAW } from '../../__mocks__';
import { Paper, paperSchema } from '../../model/paper';
import { GetPapersParams } from '../journal';
import { PageObjectV2 } from '../types/common';

interface PapersResult extends PageObjectV2 {
  entities: { papers: { [paperId: string]: Paper } };
  result: number[];
}

class JournalAPI extends PlutoAxios {
  public async getJournal(
    journalId: number
  ): Promise<{
    entities: { journals: { [journalId: number]: Journal } };
    result: number;
  }> {
    if (!journalId) {
      throw new Error('FAKE ERROR');
    }
    const normalizedData = normalize(RAW.JOURNAL, journalSchema);

    return normalizedData;
  }

  public async getPapers(params: GetPapersParams): Promise<PapersResult> {
    const getPapersResponse = RAW.JOURNAL_PAPERS_RESPONSE;

    if (!params.journalId) {
      throw new Error('FAKE ERROR');
    }

    const papers: Paper[] | undefined = getPapersResponse.data.content;

    const authorSlicedPapers = papers
      ? papers.map(paper => {
          return { ...paper, authors: paper.authors.slice(0, 10) };
        })
      : [];

    const normalizedPapersData = normalize(authorSlicedPapers, [paperSchema]);

    return {
      entities: normalizedPapersData.entities,
      result: normalizedPapersData.result,
      size: getPapersResponse.data.size,
      page: getPapersResponse.data.page + 1,
      first: getPapersResponse.data.first,
      last: getPapersResponse.data.last,
      numberOfElements: getPapersResponse.data.numberOfElements,
      totalPages: getPapersResponse.data.totalPages,
      totalElements: getPapersResponse.data.totalElements,
    };
  }
}

const apiHelper = new JournalAPI();

export default apiHelper;
