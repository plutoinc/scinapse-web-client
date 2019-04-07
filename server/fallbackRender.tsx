import { Helmet } from "react-helmet";
import { initialState } from "../app/reducers";
import { generateFullHTML } from "../app/helpers/htmlWrapper";

export default function fallbackJSOnlyRender(scriptTags: string, version: string) {
  const helmet = Helmet.renderStatic();
  const fullHTML: string = generateFullHTML({
    reactDom: "",
    scriptTags,
    helmet,
    initialState: JSON.stringify(initialState),
    css: "",
    version,
  });

  return fullHTML;
}
