import EnvChecker from "../helpers/envChecker";

const DEV_API_HOST = "https://devapi.pluto.network/";

export default function getAPIHost() {
  if (EnvChecker.isDev()) {
    return DEV_API_HOST;
  } else if (EnvChecker.isStage()) {
    return DEV_API_HOST;
  } else {
    // TODO: Add Production API Host
    return "";
  }
}
