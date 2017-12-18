import EnvChecker from "../helpers/envChecker";

const DEV_API_HOST = "https://dev-api.pluto.network";
const ALPHA_API_HOST = "https://alpha-api.pluto.network";

export default function getAPIHost() {
  if (EnvChecker.isDev()) {
    return ALPHA_API_HOST;
  } else if (EnvChecker.isStage()) {
    return ALPHA_API_HOST;
  } else {
    return DEV_API_HOST;
  }
}
