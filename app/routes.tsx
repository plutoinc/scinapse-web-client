import * as React from "react";
import { Route } from "react-router-dom";
import Home from "./components/home";

const routesMap = (
  <div>
    <Route path="/" component={Home} exact />
  </div>
);

export default routesMap;
