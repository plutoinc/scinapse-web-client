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
          .then(reg => {
            if (reg.installing) {
              console.log("Service worker installing");
            } else if (reg.waiting) {
              console.log("Service worker installed");
            } else if (reg.active) {
              console.log("Service worker active");
              // reg.pushManager
              //   .subscribe({ userVisibleOnly: true })
              //   .then(() => {
              //     console.log("go PUSH");
              //   })
              //   .catch(err => {
              //     console.log("Failed to get permission to notification");
              //     console.error(err);
              //     console.log(err.message);
              //   });
            }
          })
          .catch(registrationError => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }

  if (EnvChecker.isProdBrowser() || EnvChecker.isDev()) {
    loadServiceWorker();
  }

  // Prevent IE/Edge's Clicking SVG problem
  // https://stackoverflow.com/questions/38648307/add-blur-method-to-svg-elements-in-ie-edge
  if (typeof (SVGElement.prototype as any).blur === "undefined") {
    // tslint:disable-next-line:no-empty
    (SVGElement.prototype as any).blur = () => {};
  }
  const plutoRenderer = new PlutoRenderer();
  plutoRenderer.renderPlutoApp();
}
