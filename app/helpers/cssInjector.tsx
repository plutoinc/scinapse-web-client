import * as React from "react";
import * as PropTypes from "prop-types";

class CssInjector extends React.PureComponent<CssInjector> {
  public static childContextTypes = {
    insertCss: PropTypes.func,
  };

  public getChildContext() {
    return { ...this.props.context };
  }

  public render() {
    return <>{this.props.children}</>;
  }
}

export default CssInjector as React.ComponentClass<any>;
