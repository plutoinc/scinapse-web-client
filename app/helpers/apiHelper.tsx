import axios from 'axios';

class APIHelper {
  private targetUrl:string = 'http://localhost:8080';

  signUp (userInfo:any) {
    return new Promise((resolve, reject) => {
      const path = 'members';
      const finalUrl = `${this.targetUrl}/${path}`;
      const paramObj = {
        member_id: userInfo.fullName,
        password: userInfo.password,
        email: userInfo.email,
      }
      console.log('paramObj is ', paramObj);
      axios.post(finalUrl, paramObj).then(result => {
        resolve(result);
      }).catch(err => {
        reject(err);
      });
    });
  }

  signIn (userInfo:any) {
    return new Promise((resolve, reject) => {
      const path = 'members';
      const finalUrl = `${this.targetUrl}/${path}`;
      const paramObj = {
        member_id: userInfo.fullName,
        password: userInfo.password,
        email: userInfo.email,
      }
      console.log('paramObj is ', paramObj);
      axios.post(finalUrl, paramObj).then(result => {
        resolve(result);
      }).catch(err => {
        reject(err);
      });
    });
  }
}

const apiHelper = new APIHelper();

export default apiHelper;
