import { CancelToken } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { Profile, profileSchema, RawProfile, mapRawProfile, Award, Education, Experience } from "../model/profile";
import { RawPaginationResponseV2 } from "./types/common";

export interface CvBaseInfo {
  id?: string | undefined;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  institution_id: number | null;
  institution_name: string;
  department: string;
}

export interface AwardParams {
  id?: string | undefined;
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

  public postNewAwardInAuthor = async (authorId: number, params: AwardParams) => {
    const res = await this.post(`/authors/${authorId}/awards`, params);

    const successResponse: RawPaginationResponseV2<Award> = res.data;

    return successResponse.data.content;
  };

  public postNewEducationInAuthor = async (authorId: number, params: EducationParams) => {
    const finalParams = {
      ...params,
      end_date: params.is_current ? null : params.end_date,
    };

    const res = await this.post(`/authors/${authorId}/educations`, finalParams);

    const successResponse: RawPaginationResponseV2<Education> = res.data;

    return successResponse.data.content;
  };

  public postNewExperienceInAuthor = async (authorId: number, params: ExperienceParams) => {
    const finalParams = {
      ...params,
      end_date: params.is_current ? null : params.end_date,
      description: !params.description ? null : params.description,
    };

    const res = await this.post(`/authors/${authorId}/experiences`, finalParams);

    const successResponse: RawPaginationResponseV2<Experience> = res.data;

    return successResponse.data.content;
  };

  public deleteAwardInAuthor = async (awardId: string) => {
    const res = await this.delete(`/authors/awards/${awardId}`);

    const successResponse: RawPaginationResponseV2<Experience> = res.data;

    return successResponse.data.content;
  };

  public deleteEducationInAuthor = async (educationId: string) => {
    const res = await this.delete(`/authors/educations/${educationId}`);

    const successResponse: RawPaginationResponseV2<Experience> = res.data;

    return successResponse.data.content;
  };

  public deleteExperienceInAuthor = async (experienceId: string) => {
    const res = await this.delete(`/authors/experiences/${experienceId}`);

    const successResponse: RawPaginationResponseV2<Experience> = res.data;

    return successResponse.data.content;
  };

  public updateAwardInAuthor = async (params: AwardParams) => {
    const res = await this.put(`/authors/awards/${params.id}`, params);

    const successResponse: RawPaginationResponseV2<Award> = res.data;

    return successResponse.data.content;
  };

  public updateEducationInAuthor = async (params: EducationParams) => {
    const finalParams = {
      ...params,
      end_date: params.is_current ? null : params.end_date,
    };

    const res = await this.put(`/authors/educations/${finalParams.id}`, finalParams);

    const successResponse: RawPaginationResponseV2<Education> = res.data;

    return successResponse.data.content;
  };

  public updateExperienceInAuthor = async (params: ExperienceParams) => {
    const finalParams = {
      ...params,
      end_date: params.is_current ? null : params.end_date,
      description: !params.description ? null : params.description,
    };

    const res = await this.put(`/authors/experiences/${finalParams.id}`, finalParams);

    const successResponse: RawPaginationResponseV2<Experience> = res.data;

    return successResponse.data.content;
  };
}

const profileAPI = new ProfileAPI();

export default profileAPI;
