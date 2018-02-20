import EnvChecker from "./helpers/envChecker";
import { handler as lambdaHandler } from "./server";
import PlutoRenderer from "./client";

if (!EnvChecker.isServer()) {
  const plutoRenderer = new PlutoRenderer();
  plutoRenderer.renderPlutoApp();
}
//  else {
//   serverSideRender("/search?query=paper&filter=year%3D%3A%2Cif%3D%3A&page=1", "SCRIPT_PATH")
//     .then(res => {
//       console.log(res);
//     })
//     .catch(err => console.error(err));
// }

export const handler = lambdaHandler;
