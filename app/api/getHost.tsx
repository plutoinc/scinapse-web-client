import EnvChecker from "../helpers/envChecker";

export default function getAPIHost() {
  if (EnvChecker.isDev()) {
    return "http://localhost:8080";
    // } else if (EnvChecker.isStage()) {
    // return "";
  } else {
    // Production
    return "";
  }
}
