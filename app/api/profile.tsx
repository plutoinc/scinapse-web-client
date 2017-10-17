import PlutoAxios from "./pluto";

class ProfileAPI extends PlutoAxios {
  public async getUserProfile(userId: string) {
    const result = await this.get(`members/${userId}`);

    return result.data;
  }
}

const apiHelper = new ProfileAPI();

export default apiHelper;
