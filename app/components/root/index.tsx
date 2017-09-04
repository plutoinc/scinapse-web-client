import * as React from "react";
// components
import { Header, Footer } from './layouts';

// styles
export default class RootComponent extends React.PureComponent<null, null> {
  public render() {
    return (
      <div>
      dsdsds
        <Header />
        121
        {this.props.children}
        dsds
        <Footer />
      </div>
    );
  }
}
