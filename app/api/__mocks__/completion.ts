import PlutoAxios from '../pluto';
import { RawSuggestion } from '../../model/suggestion';
import { CompletionKeyword } from '../completion';

class CompletionAPI extends PlutoAxios {
  public async getSuggestionKeyword(): Promise<RawSuggestion> {
    return {
      highlighted: '<b>para</b>',
      keyword: 'papre',
      original_query: 'papre',
      suggest_query: 'para',
      suggestion: 'para',
    };
  }

  public async getKeywordCompletion() {
    const completionKeywords: CompletionKeyword[] = [
      { keyword: 'paprec', type: 'KEYWORD' },
      { keyword: 'papreg', type: 'KEYWORD' },
      { keyword: 'paprent', type: 'KEYWORD' },
      { keyword: 'parents', type: 'KEYWORD' },
      { keyword: 'papreen', type: 'KEYWORD' },
      { keyword: 'papreddy kashireddy', type: 'KEYWORD' },
      { keyword: 'papreen nahar', type: 'KEYWORD' },
      { keyword: 'papreck', type: 'KEYWORD' },
      { keyword: 'papreck justin', type: 'KEYWORD' },
      { keyword: 'papreckiene', type: 'KEYWORD' },
    ];

    return completionKeywords;
  }
}

const completionAPI = new CompletionAPI();

export default completionAPI;
