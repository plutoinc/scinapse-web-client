import PlutoAxios from './pluto';

class HomeAPI extends PlutoAxios {
  public async getPapersFoundCount() {
    const res = await this.get(`/papers/found-count`);

    return res.data;
  }
}

const homeAPI = new HomeAPI();

export default homeAPI;
