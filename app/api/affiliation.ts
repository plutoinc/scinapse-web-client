import PlutoAxios from './pluto';
import { ProfileAffiliation } from '../model/profileAffiliation';

type VerificationParams = {
  affiliation_id: string;
  affiliation_domain_id: number;
  email: string;
}

class AffiliationAPI extends PlutoAxios {
  public async getAffiliation(affiliationId: string): Promise<ProfileAffiliation> {
    const { data } = await this.get(`/affiliations/${affiliationId}`);
    return data.data.content as ProfileAffiliation;
  }

  public async verifyAffiliation(params: VerificationParams) {
    const { data } = await this.post(`/affiliation-verification/token`, params);
    return data.data.content;
  }
}

const affiliationAPI = new AffiliationAPI();

export default affiliationAPI;
