import axios from "axios";
// Params Interfaces
import { ICreateNewAccountParams } from "../components/auth/signUp/actions";
import { ISignInParams } from "../components/auth/signIn/actions";

class APIHelper {
  private targetUrl: string = "http://localhost:8080";

  signUp(userInfo: ICreateNewAccountParams) {
    return new Promise((resolve, reject) => {
      const path = "members";
      const finalUrl = `${this.targetUrl}/${path}`;
      const paramObj = {
        member_id: userInfo.fullName,
        password: userInfo.password,
        email: userInfo.email
      };
      console.log("paramObj is ", paramObj);
      axios
        .post(finalUrl, paramObj)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  signIn(userInfo: ISignInParams) {
    return new Promise((resolve, reject) => {
      const path = "auth/token";
      const finalUrl = `${this.targetUrl}/${path}`;
      const paramObj = {
        email: userInfo.email,
        password: userInfo.password
      };
      console.log("paramObj is ", paramObj);
      axios
        .post(finalUrl, paramObj)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  refresh() {
    return new Promise((resolve, reject) => {
      const path = "auth/refresh";
      const finalUrl = `${this.targetUrl}/${path}`;
      axios
        .get(finalUrl)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

const apiHelper = new APIHelper();

export default apiHelper;
