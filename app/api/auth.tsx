import PlutoAxios from "./pluto";
import { ICreateNewAccountParams } from "../components/auth/signUp/actions";
import { ISignInParams } from "../components/auth/signIn/actions";

class AuthAPI extends PlutoAxios {
  public async signUp(userInfo: ICreateNewAccountParams) {
    const paramObj = {
      email: userInfo.email,
      password: userInfo.password
    };

    await this.post("/members", paramObj);
  }

  public async signIn(userInfo: ISignInParams) {
    const paramObj = {
      email: userInfo.email,
      password: userInfo.password
    };
    await this.post("/auth/login", paramObj);
  }

  public async refresh() {
    await this.get("auth/refresh");
  }
}

const apiHelper = new AuthAPI();

export default apiHelper;
