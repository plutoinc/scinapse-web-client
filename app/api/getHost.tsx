import EnvChecker from "../helpers/envChecker";

export default function getAPIHost() {
  if (EnvChecker.isDev()) {
    return "http://devapi.pluto.network/";
  } else {
    // Production
    return "";
  }
}
