import PlutoAxios from './pluto';
import { ProfileAffiliation } from '../model/profileAffiliation';

class AffiliationAPI extends PlutoAxios {
  public async getAffiliation(affiliationId: string): Promise<ProfileAffiliation> {
    const { data } = await this.get(`/affiliations/${affiliationId}`);

    return data.data.content as ProfileAffiliation;
  }
}

const affiliationAPI = new AffiliationAPI();

export default affiliationAPI;
