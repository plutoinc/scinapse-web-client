import EnvChecker from "./helpers/envChecker";
import PlutoRenderer from "./client";

if (!EnvChecker.isServer()) {
  const plutoRenderer = new PlutoRenderer();
  plutoRenderer.renderPlutoApp();
}
