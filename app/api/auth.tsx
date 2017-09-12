import PlutoAxios from "./pluto";
import { ICreateNewAccountParams } from "../components/auth/signUp/actions";
import { ISignInParams } from "../components/auth/signIn/actions";
import { CurrentUserStateFactory } from "../model/auth";

class AuthAPI extends PlutoAxios {
  public async signUp(userInfo: ICreateNewAccountParams) {
    const paramObj = {
      member_id: userInfo.fullName,
      password: userInfo.password,
      email: userInfo.email,
    };

    const result = await this.post("/members", paramObj);
    console.log(result.data);
  }

  public async signIn(userInfo: ISignInParams) {
    const paramObj = {
      email: userInfo.email,
      password: userInfo.password,
    };
    const result = await this.post("/auth/token", paramObj);
    console.log(result.data);
    console.log(CurrentUserStateFactory(result.data).toJS());
    return CurrentUserStateFactory(result.data);
  }

  public async refresh() {
    const result = await this.get("auth/refresh");
    console.log(result);
  }
}

const apiHelper = new AuthAPI();

export default apiHelper;
