import PlutoAxios from "./pluto";

export type ProfileParams = {
  affiliation_id: string;
  affiliation_name: string;
  bio: string;
  email: string;
  is_email_public: boolean;
  first_name: string;
  last_name: string;
  web_page: string;
}

class ProfileAPI extends PlutoAxios {
  public async getProfile(profileId: string) {
    const res = await this.get(`/profile/${profileId}`);
    console.log(res.data);
  }
}

const profileAPI = new ProfileAPI();

export default profileAPI;
