import Axios, { AxiosResponse, CancelToken } from 'axios';
import PlutoAxios from './pluto';

export interface CompletionKeyword
  extends Readonly<{
      keyword: string;
      type: string;
    }> {}

export interface FOSSuggestion {
  keyword: string;
  type: 'FOS';
  fosId: string;
}

export interface JournalSuggestion {
  keyword: string;
  type: string;
  journalId: string;
  impactFactor: number;
  abbrev: string | null;
  sci: boolean;
  jc: 'JOURNAL' | 'CONFERENCE';
}

const CancelToken = Axios.CancelToken;
class CompletionAPI extends PlutoAxios {
  public async fetchSuggestionKeyword(query: string, cancelToken: CancelToken) {
    const getCompleteKeywordResponse: AxiosResponse = await this.get('/complete', {
      params: {
        q: query,
      },
      cancelToken,
    });

    const completionKeywords: CompletionKeyword[] = getCompleteKeywordResponse.data.data;
    return completionKeywords;
  }

  public async fetchFOSSuggestion(query: string, cancelToken: CancelToken) {
    const res: AxiosResponse = await this.get('/complete/fos', {
      params: {
        q: query,
      },
      cancelToken,
    });

    const fosList: FOSSuggestion[] = res.data.data.content.map((fos: FOSSuggestion) => ({
      ...fos,
      fosId: String(fos.fosId),
    }));
    return fosList;
  }

  public async fetchJournalSuggestion(query: string, cancelToken: CancelToken) {
    const res: AxiosResponse = await this.get('/complete/journal', {
      params: {
        q: query,
      },
      cancelToken,
    });

    const journalList: JournalSuggestion[] = res.data.data.content.map((journal: JournalSuggestion) => ({
      ...journal,
      journalId: journal.journalId,
    }));
    return journalList;
  }
}

const completionAPI = new CompletionAPI();

export default completionAPI;
