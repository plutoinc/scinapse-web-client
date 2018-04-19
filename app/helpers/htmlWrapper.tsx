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
      ${helmet.title.toString()}
      ${helmet.script.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
        <style type="text/css">${css}</style>
      </head>
      <body>
        <script>window.__INITIAL_STATE__="${encodeURIComponent(initialState)}"</script>
        <div id="react-app">${reactDom}</div>
        <script src="${scriptPath}"></script>

        <script type="text/javascript">
        (function(w, d, a){
          w.__beusablerumclient__ = {
            load : function(src){
              var b = d.createElement("script");
              b.src = src; b.async=true; b.type = "text/javascript";
              d.getElementsByTagName("head")[0].appendChild(b);
            }
          };w.__beusablerumclient__.load(a);
        })(window, document, '//rum.beusable.net/script/b180228e114128u581/1b076471b1');
        </script>

      </body>
    </html>
  `;
}
