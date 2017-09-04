import * as React from "react";
import { Route, Switch } from "react-router-dom";
// containers
import RootComponent from "./components/root";
import HomeComponent from "./components/home";
import AuthComponent from "./components/auth";

const routesMap = (
  <div>
    <Route path="/" component={RootComponent} />
    <Switch>
      <Route exact path="/" component={HomeComponent} />
      <Route path="/auth" component={AuthComponent} />
    </Switch>
  </div>
);

export default routesMap;
