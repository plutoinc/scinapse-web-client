import { AxiosResponse } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { Profile, RawProfile, profileSchema, Education, Experience, Award } from "../model/profile";
import { CommonPaginationResponseV2 } from "./types/common";
import { Author } from "../model/author/author";

interface PostEducationParams {
  degree: string;
  department: string;
  institution: string;
  isCurrent: boolean;
  profileId: string;
  endDate: string; // yyyy-MM
  startDate: string; // yyyy-MM
}

interface PostExperienceParams {
  position: string;
  department: string;
  institution: string;
  isCurrent: boolean;
  profileId: string;
  endDate: string; // yyyy-MM
  startDate: string; // yyyy-MM
}

interface PostAwardParams {
  profileId: string;
  title: string;
  receivedDate: string; // yyyy-MM
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

  public async makeProfile(authorIds: number[]) {
    const response = await this.post("profiles/me", { author_ids: authorIds });
    const resData: CommonPaginationResponseV2<RawProfile> = response.data;
    const normalizedData = normalize(this.mapProfileData(resData.data.content), profileSchema);

    return normalizedData;
  }

  public async getProfile(
    profileId: string
  ): Promise<{
    entities: { profiles: { [profileId: number]: Profile } };
    result: number;
  }> {
    const response: AxiosResponse = await this.get(`/profiles/${profileId}`);
    const resData: CommonPaginationResponseV2<RawProfile> = response.data;
    const normalizedData = normalize(this.mapProfileData(resData.data.content), profileSchema);

    return normalizedData;
  }

  public async getPapersFromAuthor(authorName: string) {
    const response: AxiosResponse = await this.get(`/authors`, {
      params: {
        query: authorName,
      },
    });

    const resData: CommonPaginationResponseV2<Author[]> = response.data;

    return resData;
  }

  public async postEducation(params: PostEducationParams) {
    const response: AxiosResponse = await this.post(`/profiles/${params.profileId}/educations`, {
      degree: params.degree,
      department: params.department,
      institution: params.institution,
      is_current: params.isCurrent,
      profile_id: params.profileId,
      end_date: params.endDate,
      start_date: params.startDate,
    });
    const resData: CommonPaginationResponseV2<Education> = response.data;

    return resData;
  }

  public async postExperience(params: PostExperienceParams) {
    const response: AxiosResponse = await this.post(`/profiles/${params.profileId}/experiences`, {
      position: params.position,
      department: params.department,
      institution: params.institution,
      is_current: params.isCurrent,
      profile_id: params.profileId,
      end_date: params.endDate,
      start_date: params.startDate,
    });
    const resData: CommonPaginationResponseV2<Experience> = response.data;

    return resData;
  }

  public async postAward(params: PostAwardParams) {
    const response: AxiosResponse = await this.post(`/profiles/${params.profileId}/awards`, {
      title: params.title,
      profile_id: params.profileId,
      received_date: params.receivedDate,
    });

    const resData: CommonPaginationResponseV2<Award> = response.data;

    return resData;
  }
}

const profileAPI = new ProfileAPI();

export default profileAPI;
