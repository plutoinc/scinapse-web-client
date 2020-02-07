import PlutoAxios from './pluto';
import { Paper } from '../model/paper';
import { Profile } from '../model/profile';
import { PendingPaper } from '../reducers/profilePendingPaperList';

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
  successPapers: Paper[];
  pendingPapers: PendingPaper[];
};

class ProfileAPI extends PlutoAxios {
  public async createProfile(token: string, params: ProfileParams) {
    const res = await this.post(`/profiles/me?token=${token}`, {
      ...params,
    });
    if (res) {
      return res.data.data.content;
    }
  }

  public async importFromGSC(params: { profileId: string; url: string }): Promise<ImportedPaperListResponse> {
    const res = await this.post(`/profiles/${params.profileId}/import-papers/gs`, {
      gs_uri: params.url,
    });
    return res.data.data.content;
  }

  public async importFromBIBTEX(params: {
    profileId: string;
    bibtexString: string;
  }): Promise<ImportedPaperListResponse> {
    const res = await this.post(`/profiles/${params.profileId}/import-papers/bibtex`, {
      bibtex_string: params.bibtexString,
    });

    return res.data.data.content;
  }
}

const profileAPI = new ProfileAPI();

export default profileAPI;
