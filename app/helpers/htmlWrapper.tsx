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
    <html lang="en">
      <head>
      <!-- Google Tag Manager -->
      <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-NMPJ7CC');</script>
      <!-- End Google Tag Manager -->
      ${helmet.title.toString()}
      ${helmet.script.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
        <style type="text/css">${css}</style>
      </head>
      <body>
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NMPJ7CC"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
        <script>window.__INITIAL_STATE__="${encodeURIComponent(initialState)}"</script>
        <div id="react-app">${reactDom}</div>
        <script src="${scriptPath}"></script>
      </body>
    </html>
  `;
}
