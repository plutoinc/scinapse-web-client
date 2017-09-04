import * as React from "react";
import { RaisedButton } from "material-ui";

export default class Home extends React.PureComponent<null, null> {
  render() {
    return (
      <h1>
        Hello Pluto
        <RaisedButton label="Default" />
      </h1>
    );
  }
}
