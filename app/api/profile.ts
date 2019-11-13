import { CancelToken } from 'axios';
import { normalize } from 'normalizr';
import PlutoAxios from './pluto';
import { Profile, profileSchema, Award, Education, Experience } from '../model/profile';
import { RawPaginationResponseV2 } from './types/common';
import { camelCaseKeys } from '../helpers/camelCaseKeys';

export interface CvBaseInfo {
  id?: string | undefined;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  institutionId: number | null;
  institutionName: string;
}

export interface AwardParams {
  id?: string | undefined;
  title: string;
  receivedDate: string;
  relatedLink: string | null;
}

export interface EducationParams extends CvBaseInfo {
  degree: string;
  department: string;
}

export interface ExperienceParams extends CvBaseInfo {
  description: string | null;
  department: string | null;
  position: string;
}

class ProfileAPI extends PlutoAxios {
  public async getProfile(
    authorId: string,
    cancelToken: CancelToken
  ): Promise<{
    entities: { profiles: { [authorId: string]: Profile } };
    result: string;
  }> {
    const res = await this.get(`/authors/${authorId}/information`, { cancelToken });
    const profile: Profile = camelCaseKeys(res.data.data.content);
    const normalizedData = normalize(profile, profileSchema);
    return normalizedData;
  }

  public postNewAwardInAuthor = async (authorId: string, params: AwardParams) => {
    const res = await this.post(`/authors/${authorId}/awards`, {
      id: params.id,
      title: params.title,
      received_date: params.receivedDate,
      related_link: params.relatedLink ? params.relatedLink : null,
    });
    const successResponse: RawPaginationResponseV2<Award> = camelCaseKeys(res.data);
    return successResponse.data.content;
  };

  public postNewEducationInAuthor = async (authorId: string, params: EducationParams) => {
    const finalParams = {
      id: params.id,
      start_date: params.startDate,
      is_current: params.isCurrent,
      institution_id: params.institutionId,
      institution_name: params.institutionName,
      department: params.department,
      degree: params.degree,
      end_date: params.isCurrent ? null : params.endDate,
    };
    const res = await this.post(`/authors/${authorId}/educations`, finalParams);
    const successResponse: RawPaginationResponseV2<Education> = camelCaseKeys(res.data);
    return successResponse.data.content;
  };

  public postNewExperienceInAuthor = async (authorId: string, params: ExperienceParams) => {
    const finalParams = {
      id: params.id,
      start_date: params.startDate,
      is_current: params.isCurrent,
      institution_id: params.institutionId,
      institution_name: params.institutionName,
      department: params.department ? params.department : null,
      position: params.position,
      end_date: params.isCurrent ? null : params.endDate,
      description: params.description ? params.description : null,
    };
    const res = await this.post(`/authors/${authorId}/experiences`, finalParams);
    const successResponse: RawPaginationResponseV2<Experience> = camelCaseKeys(res.data);
    return successResponse.data.content;
  };

  public deleteAwardInAuthor = async (awardId: string) => {
    const res = await this.delete(`/authors/awards/${awardId}`);
    const successResponse: RawPaginationResponseV2<Experience> = camelCaseKeys(res.data);
    return successResponse.data.content;
  };

  public deleteEducationInAuthor = async (educationId: string) => {
    const res = await this.delete(`/authors/educations/${educationId}`);
    const successResponse: RawPaginationResponseV2<Experience> = camelCaseKeys(res.data);
    return successResponse.data.content;
  };

  public deleteExperienceInAuthor = async (experienceId: string) => {
    const res = await this.delete(`/authors/experiences/${experienceId}`);
    const successResponse: RawPaginationResponseV2<Experience> = camelCaseKeys(res.data);
    return successResponse.data.content;
  };

  public updateAwardInAuthor = async (params: AwardParams) => {
    const res = await this.put(`/authors/awards/${params.id}`, {
      id: params.id,
      title: params.title,
      received_date: params.receivedDate,
      related_link: !params.relatedLink ? null : params.relatedLink,
    });
    const successResponse: RawPaginationResponseV2<Award> = camelCaseKeys(res.data);
    return successResponse.data.content;
  };

  public updateEducationInAuthor = async (params: EducationParams) => {
    const finalParams = {
      id: params.id,
      start_date: params.startDate,
      is_current: params.isCurrent,
      institution_id: params.institutionId,
      institution_name: params.institutionName,
      department: params.department,
      degree: params.degree,
      end_date: params.isCurrent ? null : params.endDate,
    };
    const res = await this.put(`/authors/educations/${finalParams.id}`, finalParams);
    const successResponse: RawPaginationResponseV2<Education> = camelCaseKeys(res.data);
    return successResponse.data.content;
  };

  public updateExperienceInAuthor = async (params: ExperienceParams) => {
    const finalParams = {
      id: params.id,
      start_date: params.startDate,
      is_current: params.isCurrent,
      institution_id: params.institutionId,
      institution_name: params.institutionName,
      department: !params.department ? null : params.department,
      position: params.position,
      end_date: params.isCurrent ? null : params.endDate,
      description: !params.description ? null : params.description,
    };
    const res = await this.put(`/authors/experiences/${finalParams.id}`, finalParams);
    const successResponse: RawPaginationResponseV2<Experience> = camelCaseKeys(res.data);
    return successResponse.data.content;
  };
}

const profileAPI = new ProfileAPI();

export default profileAPI;
