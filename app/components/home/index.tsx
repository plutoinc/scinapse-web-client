import * as React from "react";
import { Header, Footer } from '../layouts';
import { RaisedButton } from "material-ui";
export default class HomeComponent extends React.PureComponent<null, null> {
  render() {
    return (
      <div>
        <Header />
        <h1>Hello Pluto</h1>
        <RaisedButton label="Default" />
        <Footer />
      </div>
    );
  }
}
