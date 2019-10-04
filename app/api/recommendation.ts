import PlutoAxios from './pluto';
import { camelCaseKeys } from '../helpers/camelCaseKeys';
import { Paper } from '../model/paper';
import { Collection } from '../model/collection';

export type RecommendationActionTag =
  | 'paperShow'
  | 'copyDoi'
  | 'downloadPdf'
  | 'citePaper'
  | 'clickRequestFullTextBtn'
  | 'addToCollection'
  | 'source'
  | 'viewMorePDF';

export interface RecommendationAction {
  paperId: number;
  action: RecommendationActionTag;
}

export interface BasedOnCollectionPapersParams {
  collection: Collection;
  recommendations: Paper[];
}

class RecommendationAPI extends PlutoAxios {
  public async getPapersFromUserAction(): Promise<Paper[]> {
    const res = await this.get(`/recommendations/sample`);
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content;
  }

  public async getPapersFromCollection(): Promise<BasedOnCollectionPapersParams> {
    const res = await this.get(`/collections/recommendations`);
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content[0];
  }

  public async addPaperToRecommendationPool(param: RecommendationAction) {
    const res = await this.post(`/recommendations/log/paper-action`, {
      paper_id: param.paperId,
      action: param.action,
    });
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content;
  }

  public async syncRecommendationPool(params: RecommendationAction[]) {
    await this.post(`/recommendations/log/paper-action-init`, params);
  }
}

const recommendationAPI = new RecommendationAPI();

export default recommendationAPI;
