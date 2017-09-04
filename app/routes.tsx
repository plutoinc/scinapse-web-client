import * as React from "react";
import { Route } from "react-router-dom";
// containers
import RootComponent from "./components/root";
import HomeComponent from "./components/home";

const routesMap = (
  <div>
    <Route path="/" component={RootComponent} />
    <Route exact path="/" component={HomeComponent} />
  </div>
);

export default routesMap;
