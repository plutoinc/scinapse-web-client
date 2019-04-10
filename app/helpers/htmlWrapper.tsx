import { HelmetData } from "react-helmet";
import EnvChecker from "./envChecker";
const sprite = require("svg-sprite-loader/runtime/sprite.build");

interface GenerateFullHTMLParams {
  reactDom: string;
  scriptTags: string;
  linkTags: string;
  helmet: HelmetData;
  initialState: string;
  css: string;
  version?: string;
}

export function generateFullHTML({
  reactDom,
  linkTags,
  scriptTags,
  helmet,
  initialState,
  css,
  version,
}: GenerateFullHTMLParams) {
  let gTagScript: string = "";
  if (EnvChecker.isOnServer() && !EnvChecker.isDev() && !EnvChecker.isLocal()) {
    gTagScript = `
    <!-- Global site tag (gtag.js) - Google Ads: 817738370 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-817738370"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'AW-817738370');
</script>`;
  }

  return `
    <!doctype html>
    <html lang="en">
      <head>
      ${helmet.title.toString()}
      <script type="text/javascript">window._script_version_ = { version: '${version}' };</script>
      ${helmet.script.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${linkTags}
      ${gTagScript}
        <style id="jss-server-side" type="text/css">${css}</style>
        <link rel="stylesheet" href=" https://missive.github.io/emoji-mart/emoji-mart.css" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css" integrity="sha384-dbVIfZGuN1Yq7/1Ocstc1lUEm+AT+/rCkibIcC/OmWo5f0EA48Vf8CytHzGrSwbQ" crossorigin="anonymous">
        integrity="sha384-xNwWFq3SIvM4dq/1RUyWumk8nj/0KFg4TOnNcfzUU4X2gNn3WoRML69gO7waf3xh" crossorigin="anonymous">
        <script src="https://browser.sentry-cdn.com/5.0.6/bundle.min.js" crossorigin="anonymous"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.js" integrity="sha384-2BKqo+exmr9su6dir+qCw08N2ZKRucY4PrGQPPWU1A7FtlCGjmEGFqXCv5nyM5Ij" crossorigin="anonymous"></script>
      </head>
      <body>
        <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
        <script>
          WebFont.load({
            custom: {
              families: ['Roboto'],
              urls: ['https://assets.pluto.network/font/roboto.css']
            }
          });
        </script>
        ${sprite.stringify()}
        <script>window.__INITIAL_STATE__="${encodeURIComponent(initialState)}"</script>
        <div id="react-app">${reactDom}</div>
        ${scriptTags}
      </body>
    </html>
  `;
}
