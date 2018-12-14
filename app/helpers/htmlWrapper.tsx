import { HelmetData } from "react-helmet";
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
      ${helmet.script.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet" />
        <style id="jss-server-side" type="text/css">${css}</style>
      </head>
      <body>
        ${sprite.stringify()}
        <script>window.__INITIAL_STATE__="${encodeURIComponent(initialState)}"</script>
        <div id="react-app">${reactDom}</div>
        <script type="application/javascript" src="${scriptPath}"></script>
      </body>
    </html>
  `;
}
