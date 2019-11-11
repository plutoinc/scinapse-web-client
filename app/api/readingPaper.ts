import { CancelToken } from 'axios';
import { Paper } from '../model/paper';
import PlutoAxios from './pluto';
import { camelCaseKeys } from '../helpers/camelCaseKeys';

export interface GetPaperParams {
  paperId: string;
  cancelToken: CancelToken;
}

class ReadingPaperAPI extends PlutoAxios {
  public async getReadingNowPapers(params: GetPaperParams): Promise<Paper[]> {
    const getPapersResponse = await this.get(`/papers/${params.paperId}/reading-now`, {
      cancelToken: params.cancelToken,
    });

    const camelizedRes = camelCaseKeys(getPapersResponse.data);
    const papers: Paper[] = camelizedRes.data.content;

    return papers;
  }
}

const readingPaperAPI = new ReadingPaperAPI();

export default readingPaperAPI;
