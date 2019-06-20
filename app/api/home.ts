import PlutoAxios from './pluto';
import { camelCaseKeys } from '../helpers/camelCaseKeys';
import { Paper } from '../model/paper';
import { Collection } from '../model/collection';

export interface GetBasedOnCollectionPapersParams {
  collection: Collection;
  recommendations: Paper[];
}

class HomeAPI extends PlutoAxios {
  public async getPapersFoundCount() {
    const res = await this.get(`/papers/found-count`);

    return camelCaseKeys(res.data);
  }

  public async getBasedOnActivityPapers(): Promise<Paper[]> {
    const res = await this.get(`/recommendations/sample`);
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content;
  }

  public async getBasedOnCollectionPapers(): Promise<GetBasedOnCollectionPapersParams> {
    const res = await this.get(`/collections/recommendations`);
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content[0];
  }
}

const homeAPI = new HomeAPI();

export default homeAPI;
