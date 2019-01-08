import { CancelToken } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { Profile, profileSchema, RawProfile, mapRawProfile, Award, Education, Experience } from "../model/profile";
import { CommonPaginationResponseV2 } from "./types/common";

export interface CvBaseInfo {
  id?: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  institution_id: number | null;
  institution_name: string;
  department: string;
}

export interface AwardParams {
  id?: string;
  title: string;
  received_date: string;
}

export interface EducationParams extends CvBaseInfo {
  degree: string;
}

export interface ExperienceParams extends CvBaseInfo {
  description: string | null;
  position: string;
}

class ProfileAPI extends PlutoAxios {
  public async getProfile(
    authorId: number,
    cancelToken: CancelToken
  ): Promise<{
    entities: { profiles: { [authorId: number]: Profile } };
    result: number;
  }> {
    const res = await this.get(`/authors/${authorId}/information`, { cancelToken });
    const rawProfile: RawProfile = res.data.data.content;

    const normalizedData = normalize(mapRawProfile(rawProfile), profileSchema);
    return normalizedData;
  }

  public addAwardInAuthor = async (authorId: number, params: AwardParams) => {
    const res = await this.post(`/authors/${authorId}/awards`, params);

    const successResponse: CommonPaginationResponseV2<Award> = res.data;

    return successResponse.data.content;
  };

  public addEducationInAuthor = async (authorId: number, params: EducationParams) => {
    if (params.is_current) {
      params.end_date = null;
    }

    const res = await this.post(`/authors/${authorId}/educations`, params);

    const successResponse: CommonPaginationResponseV2<Education> = res.data;

    return successResponse.data.content;
  };

  public addExperienceInAuthor = async (authorId: number, params: ExperienceParams) => {
    if (params.is_current) {
      params.end_date = null;
    }

    const res = await this.post(`/authors/${authorId}/experiences`, params);

    const successResponse: CommonPaginationResponseV2<Experience> = res.data;

    return successResponse.data.content;
  };

  public deleteAwardInAuthor = async (awardId: string) => {
    const res = await this.delete(`/authors/awards/${awardId}`);

    const successResponse: CommonPaginationResponseV2<Experience> = res.data;

    return successResponse.data.content;
  };

  public deleteEducationInAuthor = async (educationId: string) => {
    const res = await this.delete(`/authors/educations/${educationId}`);

    const successResponse: CommonPaginationResponseV2<Experience> = res.data;

    return successResponse.data.content;
  };

  public deleteExperienceInAuthor = async (experienceId: string) => {
    const res = await this.delete(`/authors/experiences/${experienceId}`);

    const successResponse: CommonPaginationResponseV2<Experience> = res.data;

    return successResponse.data.content;
  };

  public updateAwardInAuthor = async (params: AwardParams) => {
    const res = await this.put(`/authors/awards/${params.id}`, params);

    const successResponse: CommonPaginationResponseV2<Award> = res.data;

    return successResponse.data.content;
  };

  public updateEducationInAuthor = async (params: EducationParams) => {
    const res = await this.put(`/authors/educations/${params.id}`, params);

    const successResponse: CommonPaginationResponseV2<Education> = res.data;

    return successResponse.data.content;
  };

  public updateExperienceInAuthor = async (params: ExperienceParams) => {
    const res = await this.put(`/authors/experiences/${params.id}`, params);

    const successResponse: CommonPaginationResponseV2<Experience> = res.data;

    return successResponse.data.content;
  };
}

const profileAPI = new ProfileAPI();

export default profileAPI;
