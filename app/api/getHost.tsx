import EnvChecker from "../helpers/envChecker";

const DEV_API_HOST = "https://devapi.pluto.network/";
const ALPHA_API_HOST = "https://alpha-api.pluto.network";

export default function getAPIHost() {
  if (EnvChecker.isDev()) {
    return ALPHA_API_HOST;
  } else if (EnvChecker.isStage()) {
    return DEV_API_HOST;
  } else {
    // TODO: Add Production API Host
    return DEV_API_HOST;
  }
}
