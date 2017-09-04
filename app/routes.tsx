import * as React from "react";
import { Route } from "react-router-dom";
// containers
import HomeComponent from "./components/home";
import AuthComponent from "./components/auth";

const routesMap = (
  <div>

      <Route exact path="/" component={HomeComponent} />
      <Route path="/auth" component={AuthComponent} />

  </div>
);

export default routesMap;
