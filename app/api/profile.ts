import { AxiosResponse } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { Profile, RawProfile, profileSchema } from "../model/profile";
import { CommonError } from "../model/error";

interface GetProfileResult {
  data: {
    content: RawProfile;
    paging: null;
  };
  error: null | CommonError;
}

class ProfileAPI extends PlutoAxios {
  public async getProfile(
    profileId: string
  ): Promise<{
    entities: { profiles: { [profileId: number]: Profile } };
    result: number;
  }> {
    const response: AxiosResponse = await this.get(`/profiles/${profileId}`);
    const resData: GetProfileResult = response.data;

    const normalizedData = normalize(resData.data.content, profileSchema);

    return normalizedData;
  }
}

const profileAPI = new ProfileAPI();

export default profileAPI;
