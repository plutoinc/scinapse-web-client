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
  public mapProfileData(rawProfile: RawProfile) {
    return {
      id: rawProfile.id,
      authorIds: rawProfile.author_ids,
      affiliation: rawProfile.affiliation,
      email: rawProfile.email,
      firstName: rawProfile.first_name,
      lastName: rawProfile.last_name,
      awards: rawProfile.awards,
      educations: rawProfile.educations,
      experiences: rawProfile.experiences,
      selectedPublications: rawProfile.selected_publications,
      member: rawProfile.member,
    };
  }

  public async getProfile(
    profileId: string
  ): Promise<{
    entities: { profiles: { [profileId: number]: Profile } };
    result: number;
  }> {
    const response: AxiosResponse = await this.get(`/profiles/${profileId}`);
    const resData: GetProfileResult = response.data;
    const normalizedData = normalize(this.mapProfileData(resData.data.content), profileSchema);

    return normalizedData;
  }

  public async getPapersFromAuthor(authorName: string) {
    const response: AxiosResponse = await this.get(`/authors`, {
      params: {
        query: authorName,
      },
    });
  }
}

const profileAPI = new ProfileAPI();

export default profileAPI;
