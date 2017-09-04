import * as React from "react";
// components
import NavbarComponent from "../navbar";
// styles
export default class RootComponent extends React.PureComponent<null, null> {
  public render() {
    return (
      <div>
        <NavbarComponent />
        {this.props.children}
      </div>
    );
  }
}
