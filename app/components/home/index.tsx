import * as React from "react";
import { Header, Footer } from '../layouts';
export default class HomeComponent extends React.PureComponent<null, null> {
  render() {
    return (
      <div>
        <Header />
        <h1>Hello Pluto</h1>
        <Footer />
      </div>
    );
  }
}
