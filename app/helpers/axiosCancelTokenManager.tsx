import axios from "axios";

class AxiosCancelTokenManager {
  private cancelToken = axios.CancelToken;

  public getCancelTokenSource() {
    return this.cancelToken.source();
  }
}

export default AxiosCancelTokenManager;
