import { AxiosResponse } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";

class ProfileAPI extends PlutoAxios {
  public async getProfile(
    profileId: string
  ): Promise<{
    entities: { journals: { [profileId: number]: Profile } };
    result: number;
  }> {
    const getJournalResponse: AxiosResponse = await this.get(`/journals/${journalId}`);
    const normalizedData = normalize(getJournalResponse.data.data, journalSchema);

    return normalizedData;
  }
}

const profileAPI = new ProfileAPI();

export default profileAPI;
