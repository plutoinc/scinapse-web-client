import PlutoAxios from './pluto';
import { camelCaseKeys } from '../helpers/camelCaseKeys';

class CommonAPI extends PlutoAxios {
  public async getSearchCount() {
    const res = await this.get(`https://api.scinapse.io/search/count`);

    return camelCaseKeys(res.data);
  }
}

const commonAPI = new CommonAPI();

export default commonAPI;
