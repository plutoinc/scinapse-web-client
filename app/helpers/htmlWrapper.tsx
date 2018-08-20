import { HelmetData } from "react-helmet";
import EnvChecker from "./envChecker";
const sprite = require("svg-sprite-loader/runtime/sprite.build");

interface GenerateFullHTMLParams {
  reactDom: string;
  scriptPath: string;
  helmet: HelmetData;
  initialState: string;
  css: string;
  version?: string;
}

export function generateFullHTML({ reactDom, scriptPath, helmet, initialState, css, version }: GenerateFullHTMLParams) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
      ${helmet.title.toString()}
      <script type="text/javascript">window._script_version_ = { version: '${version}' };</script>
      ${getTrackJS()}
      ${helmet.script.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" />
        <style id="jss-server-side" type="text/css">${css}</style>
      </head>
      <body>
        ${sprite.stringify()}
        <script>window.__INITIAL_STATE__="${encodeURIComponent(initialState)}"</script>
        <div id="react-app">${reactDom}</div>
        <script src="${scriptPath}"></script>
      </body>
    </html>
  `;
}

function getTrackJS() {
  if (!EnvChecker.isDev() && !EnvChecker.isLocal()) {
    return `<!-- BEGIN TRACKJS -->
    <script type="text/javascript">window._trackJs = { token: 'b96e5fcd407648ffb37c5228780fbb71' };</script>
    <script type="text/javascript" src="https://cdn.trackjs.com/releases/current/tracker.js"></script>
  <!-- END TRACKJS -->`;
  } else {
    return "";
  }
}
