import PlutoAxios from './pluto';
import { camelCaseKeys } from '../helpers/camelCaseKeys';
import { Paper } from '../model/paper';
import { Collection } from '../model/collection';

export interface BasedOnCollectionPapersParams {
  collection: Collection;
  recommendations: Paper[];
}

class RecommendationAPI extends PlutoAxios {
  public async getPapersFromUserAction(paperIds?: number[]): Promise<Paper[]> {
    let res;
    if (!!paperIds) {
      res = await this.get(`/recommendations/sample`, {
        params: {
          pids: String(paperIds),
        },
      });
    } else {
      res = await this.get(`/recommendations/sample`);
    }
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content;
  }

  public async getPapersFromCollection(): Promise<BasedOnCollectionPapersParams> {
    const res = await this.get(`/collections/recommendations`);
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content[0];
  }

  public async addPaperToRecommendationPool(paperId: number) {
    const res = await this.put(`/recommendations/base`, {
      paper_id: paperId,
    });
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content;
  }

  public async syncRecommendationPool(paperIds: number[]) {
    await this.put(`/recommendations/base/init`, {
      paper_ids: paperIds,
    });
  }
}

const recommendationAPI = new RecommendationAPI();

export default recommendationAPI;
