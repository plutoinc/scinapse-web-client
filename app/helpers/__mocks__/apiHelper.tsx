import { ICreateNewAccountParams } from "../../components/auth/signUp/actions";
import { ISignInParams } from "../../components/auth/signIn/actions";

class APIHelper {
  signUp(params: ICreateNewAccountParams) {
    if (params.fullName === "fakeError") {
      return Promise.reject(true);
    } else {
      return Promise.resolve(true);
    }
  }

  signIn(params: ISignInParams) {
    if (params.email === "fakeError") {
      return Promise.reject(true);
    } else {
      return Promise.resolve(true);
    }
  }
}

const apiHelper = new APIHelper();

export default apiHelper;
