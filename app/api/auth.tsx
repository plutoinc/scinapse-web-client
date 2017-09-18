import PlutoAxios from "./pluto";
import { ICreateNewAccountParams } from "../components/auth/signUp/actions";
import { ISignInParams } from "../components/auth/signIn/actions";

class AuthAPI extends PlutoAxios {
  public async signUp(userInfo: ICreateNewAccountParams) {
    const paramObj = {
      email: userInfo.email,
      password: userInfo.password,
    };

    await this.post("/members", paramObj);
  }

  public async signIn(userInfo: ISignInParams) {
    const paramObj = {
      email: userInfo.email,
      password: userInfo.password,
    };

    const result = await this.post("/auth/login", paramObj);
    return result.data;
  }

  public async refresh() {
    await this.get("auth/refresh");
  }

  public async signOut() {
    await this.post("auth/logout");
  }

  public async checkDuplicatedEmail(email: string) {
    const result = await this.get("members/checkDuplication", {
      params: {
        email,
      },
    });

    return result.data;
  }

  public async checkLoggedIn() {
    const result = await this.get("auth/login");

    return result.data;
  }
}

const apiHelper = new AuthAPI();

export default apiHelper;
