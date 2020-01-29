import PlutoAxios from './pluto';
import { Award, Education, Experience } from '../model/profileInfo';
import { PaginationResponseV2 } from './types/common';

export interface CvBaseInfo {
  id?: string | undefined;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  institutionId: string | null;
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

class ProfileInfoAPI extends PlutoAxios {
  public postNewAwardInAuthor = async (authorId: string, params: AwardParams) => {
    const res = await this.post(`/profiles/${authorId}/awards`, {
      id: params.id,
      title: params.title,
      received_date: params.receivedDate,
      related_link: params.relatedLink ? params.relatedLink : null,
    });
    const successResponse: PaginationResponseV2<Award> = res.data;
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
    const res = await this.post(`/profiles/${authorId}/educations`, finalParams);
    const data: PaginationResponseV2<Education> = res.data;
    const education = data.data.content;
    const safeEducation = { ...education, institutionId: String(education.institutionId) };
    return safeEducation;
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
    const res = await this.post(`/profiles/${authorId}/experiences`, finalParams);
    const data: PaginationResponseV2<Experience> = res.data;
    const experience = data.data.content;
    const safeExperience = { ...experience, institutionId: String(experience.institutionId) };
    return safeExperience;
  };

  public deleteAwardInAuthor = async (awardId: string) => {
    const res = await this.delete(`/profiles/awards/${awardId}`);
    const successResponse: PaginationResponseV2<Experience> = res.data;
    return successResponse.data.content;
  };

  public deleteEducationInAuthor = async (educationId: string) => {
    const res = await this.delete(`/profiles/educations/${educationId}`);
    const data: PaginationResponseV2<Education> = res.data;
    const education = data.data.content;
    const safeEducation = { ...education, institutionId: String(education.institutionId) };
    return safeEducation;
  };

  public deleteExperienceInAuthor = async (experienceId: string) => {
    const res = await this.delete(`/profiles/experiences/${experienceId}`);
    const data: PaginationResponseV2<Experience> = res.data;
    const experience = data.data.content;
    const safeExperience = { ...experience, institutionId: String(experience.institutionId) };
    return safeExperience;
  };

  public updateAwardInAuthor = async (params: AwardParams) => {
    const res = await this.put(`/profiles/awards/${params.id}`, {
      id: params.id,
      title: params.title,
      received_date: params.receivedDate,
      related_link: !params.relatedLink ? null : params.relatedLink,
    });
    const successResponse: PaginationResponseV2<Award> = res.data;
    return successResponse.data.content;
  };

  public updateEducationInAuthor = async (params: EducationParams) => {
    const finalParams = {
      id: params.id,
      start_date: params.startDate,
      is_current: params.isCurrent,
      institution_id: String(params.institutionId),
      institution_name: params.institutionName,
      department: params.department,
      degree: params.degree,
      end_date: params.isCurrent ? null : params.endDate,
    };
    const res = await this.put(`/profiles/educations/${finalParams.id}`, finalParams);
    const data: PaginationResponseV2<Education> = res.data;
    const education = data.data.content;
    const safeEducation = { ...education, institutionId: String(education.institutionId) };
    return safeEducation;
  };

  public updateExperienceInAuthor = async (params: ExperienceParams) => {
    const finalParams = {
      id: params.id,
      start_date: params.startDate,
      is_current: params.isCurrent,
      institution_id: String(params.institutionId),
      institution_name: params.institutionName,
      department: !params.department ? null : params.department,
      position: params.position,
      end_date: params.isCurrent ? null : params.endDate,
      description: !params.description ? null : params.description,
    };
    const res = await this.put(`/profiles/experiences/${finalParams.id}`, finalParams);
    const data: PaginationResponseV2<Experience> = res.data;
    const experience = data.data.content;
    const safeExperience = { ...experience, institutionId: String(experience.institutionId) };
    return safeExperience;
  };
}

const profileInfoAPI = new ProfileInfoAPI();

export default profileInfoAPI;
