import PlutoAxios from './pluto';
import { camelCaseKeys } from '../helpers/camelCaseKeys';
import { Paper } from '../model/paper';
import { Collection } from '../model/collection';
import { RecommendationActionAPIParams } from './types/recommendation';

export interface BasedOnCollectionPapersParams {
  collection: Collection;
  recommendations: Paper[];
}

class RecommendationAPI extends PlutoAxios {
  public async addPaperToRecommendationPool(param: RecommendationActionAPIParams) {
    const res = await this.post(`/recommendations/log/paper-action`, param);
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content;
  }

  public async syncRecommendationPool(params: RecommendationActionAPIParams[]) {
    await this.post(`/recommendations/log/paper-action-init`, params);
  }
}

const recommendationAPI = new RecommendationAPI();

export default recommendationAPI;
