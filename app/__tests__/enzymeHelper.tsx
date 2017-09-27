import * as React from "react";
import { getMuiTheme } from "material-ui/styles";
import { shallow } from "enzyme";

const muiTheme = getMuiTheme();

export function shallowWithMuiThemeContext<P>(node: React.ReactElement<P>) {
  return shallow(node, { context: { muiTheme } });
}
