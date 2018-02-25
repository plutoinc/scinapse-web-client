import EnvChecker from "../helpers/envChecker";

const DEV_API_HOST = "https://dev-api.pluto.network"; // This API HOST is used for a REAL service.
const ALPHA_API_HOST = "https://alpha-api.pluto.network"; // This API Host is used for DEV, Stage service.

export default function getAPIHost() {
  if (EnvChecker.isDev() || EnvChecker.isDevServer()) {
    return ALPHA_API_HOST;
  } else if (EnvChecker.isStage()) {
    return ALPHA_API_HOST;
  } else {
    return DEV_API_HOST;
  }
}
