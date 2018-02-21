import { HelmetData } from "react-helmet";

export function staticHTMLWrapper(
  reactDom: string,
  scriptPath: string,
  helmet: HelmetData,
  initialState: string,
  css: string,
) {
  return `
    <!doctype html>
    <html>
      <head>
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
        <style type="text/css">${css}</style>
      </head>
      <body>
        <script>window.__INITIAL_STATE__="${encodeURIComponent(initialState)}"</script>
        <div id="react-app">
          ${reactDom}
        </div>
        <script src="${scriptPath}"></script>
      </body>
    </html>
  `;
}
