import EnvChecker from "./helpers/envChecker";
import PlutoRenderer from "./client";

if (!EnvChecker.isServer()) {
  // Prevent IE/Edge's Clicking SVG problem
  // https://stackoverflow.com/questions/38648307/add-blur-method-to-svg-elements-in-ie-edge
  if (typeof (SVGElement.prototype as any).blur === "undefined") {
    // tslint:disable-next-line:no-empty
    (SVGElement.prototype as any).blur = () => {};
  }
  const plutoRenderer = new PlutoRenderer();
  plutoRenderer.renderPlutoApp();
}
