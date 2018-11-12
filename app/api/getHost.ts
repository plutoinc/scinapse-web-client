import EnvChecker from "../helpers/envChecker";

const PROD_API_HOST = "https://api.scinapse.io"; // This API HOST is used for a REAL service.
const DEV_API_HOST = "https://dev-api.scinapse.io"; // This API Host is used for DEV, Stage service.

export default function getAPIHost() {
  if (EnvChecker.isLocal() || EnvChecker.isLocalServer()) {
    return DEV_API_HOST;
  } else if (EnvChecker.isDev()) {
    return DEV_API_HOST;
  } else {
    return PROD_API_HOST;
  }
}
