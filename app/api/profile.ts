import PlutoAxios from './pluto';
import { Paper } from '../model/paper';
import { Profile } from '../model/profile';
import { PendingPaper } from '../reducers/profilePendingPaperList';
import { PageObjectV2, PaginationResponseV2 } from './types/common';
import { CreateMemberProfileResponse } from './member';

export type ProfileParams = {
  affiliation_id: string | null;
  affiliation_name: string;
  bio: string | null;
  email: string;
  is_email_public: boolean;
  first_name: string;
  last_name: string;
  web_page: string | null;
};

export type ImportedPaperListResponse = {
  profileDto: Profile;
  totalImportedCount: number;
  successCount: number;
  pendingCount: number;
  allPapers: Paper[];
  allPaperPage: PageObjectV2;
  pendingPapers: PendingPaper[];
  representativePapers: Paper[];
  representativePaperPage: PageObjectV2;
};

interface ProfileRequestParams {
  affiliation_id: string | null;
  affiliation_name: string | null;
  author_id: string;
  email: string;
  first_name: string;
  last_name: string;
}

class ProfileAPI extends PlutoAxios {
  public async requestProfile(params: ProfileRequestParams) {
    const res = await this.post('/profiles/request', params);

    return res.data;
  }

  public async createProfile(token: string, params: ProfileParams) {
    const res = await this.post(`/profiles/me?token=${token}`, {
      ...params,
    });

    return res.data.data.content as CreateMemberProfileResponse;
  }

  public async confirmedPaper(params: { profileSlug: string; paperId: string }) {
    await this.post(`/profiles/${params.profileSlug}/papers/confirm`, {
      paper_id: params.paperId,
    });
  }

  public async declinedPaper(params: { profileSlug: string; paperId: string }) {
    await this.post(`/profiles/${params.profileSlug}/papers/decline`, {
      paper_id: params.paperId,
    });
  }

  public async getRepresentativePapers(params: { profileSlug: string; size?: number; page?: number }) {
    const { profileSlug, page, size = 10 } = params;
    const res = await this.get(`/profiles/${profileSlug}/papers/representative`, {
      params: { page: page, size: size },
    });
    const result: PaginationResponseV2<Paper[]> = res.data;

    return result;
  }
}

const profileAPI = new ProfileAPI();

export default profileAPI;
