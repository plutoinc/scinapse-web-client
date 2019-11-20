import PlutoAxios from './pluto';
import { Paper } from '../model/paper';
import { Collection } from '../model/collection';
import { RecommendationActionAPIParams } from './types/recommendation';

export interface BasedOnCollectionPapersParams {
  collection: Collection;
  recommendations: Paper[];
}

class RecommendationAPI extends PlutoAxios {
  public async addPaperToRecommendationPool(params: RecommendationActionAPIParams) {
    const res = await this.post(`/recommendations/log/paper-action`, {
      paper_id: String(params.paper_id),
      action: params.action,
    });
    return res.data.data.content;
  }

  public async syncRecommendationPool(params: RecommendationActionAPIParams[]) {
    const safeParams = params.map(param => ({ ...param, paper_id: param.paper_id }));
    await this.post(`/recommendations/log/paper-action-init`, safeParams);
  }
}

const recommendationAPI = new RecommendationAPI();

export default recommendationAPI;
