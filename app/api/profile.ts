import { CancelToken } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { Profile, profileSchema, RawProfile, mapRawProfile } from "../model/profile";
import { CommonPaginationResponseV2 } from "./types/common";

export interface AwardParams {
  title: string;
  received_date: string;
}

export interface EducationParams {
  degree: string;
  department: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  institution_id: number | null;
  institution_name: string;
}

export interface ExperienceParams {
  department: string;
  description: string | null;
  start_date: string;
  end_date: string;
  position: string;
  institution_id: number | null;
  institution_name: string;
  is_current: boolean;
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
    const res = await this.post(`/authors/${authorId}/awards`, {
      title: params.title,
      received_date: params.received_date,
    });

    const successResponse: CommonPaginationResponseV2<{ success: true }> = res.data;

    return successResponse;
  };

  public addEducationInAuthor = async (authorId: number, params: EducationParams) => {
    const res = await this.post(`/authors/${authorId}/educations`, {
      degree: params.degree,
      department: params.department,
      start_date: params.start_date,
      end_date: params.end_date,
      is_current: params.is_current,
      institution_id: params.institution_id,
      institution_name: params.institution_name,
    });

    const successResponse: CommonPaginationResponseV2<{ success: true }> = res.data;

    return successResponse;
  };

  public addExperienceInAuthor = async (authorId: number, params: ExperienceParams) => {
    const res = await this.post(`/authors/${authorId}/experiences`, {
      description: params.description,
      department: params.department,
      start_date: params.start_date,
      end_date: params.end_date,
      position: params.position,
      is_current: params.is_current,
      institution_id: params.institution_id,
      institution_name: params.institution_name,
    });

    const successResponse: CommonPaginationResponseV2<{ success: true }> = res.data;

    return successResponse;
  };

  public deleteAwardInAuthor = async (awardId: number) => {
    const res = await this.delete(`/authors/awards/${awardId}`);

    return res.data;
  };

  public deleteEducationInAuthor = async (educationId: number) => {
    const res = await this.delete(`/authors/educations/${educationId}`);

    return res.data;
  };

  public deleteExperienceInAuthor = async (experienceId: number) => {
    const res = await this.delete(`/authors/experiences/${experienceId}`);

    return res.data;
  };
}

const profileAPI = new ProfileAPI();

export default profileAPI;
