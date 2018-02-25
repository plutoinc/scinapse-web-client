import EnvChecker from "./helpers/envChecker";
import { handler as lambdaHandler } from "./server";
import PlutoRenderer from "./client";

if (!EnvChecker.isServer()) {
  const plutoRenderer = new PlutoRenderer();
  plutoRenderer.renderPlutoApp();
}

export const ssr = lambdaHandler;
