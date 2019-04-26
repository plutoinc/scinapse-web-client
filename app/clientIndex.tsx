import EnvChecker from "./helpers/envChecker";
import PlutoRenderer from "./client";
import { parse } from "qs";

if (!EnvChecker.isOnServer()) {
  function loadServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        const qp = parse(location.search, { ignoreQueryPrefix: true });
        let destination = "/sw.js";
        if (qp.branch) {
          console.log(qp.branch);
          destination = destination + `?branch=${qp.branch}`;
        }
        navigator.serviceWorker
          .register(destination)
          .then(registration => {
            console.log("SW registered: ", registration);
            console.log(registration.pushManager);
            registration.pushManager.subscribe({ userVisibleOnly: true });
          })
          .catch(registrationError => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }

  loadServiceWorker();

  // Prevent IE/Edge's Clicking SVG problem
  // https://stackoverflow.com/questions/38648307/add-blur-method-to-svg-elements-in-ie-edge
  if (typeof (SVGElement.prototype as any).blur === "undefined") {
    // tslint:disable-next-line:no-empty
    (SVGElement.prototype as any).blur = () => {};
  }
  const plutoRenderer = new PlutoRenderer();
  plutoRenderer.renderPlutoApp();
}
