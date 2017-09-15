import * as React from "react";
import { Route } from "react-router-dom";

// containers
import { Header, Footer } from "./components/layouts";
import ArticleComponent from "./components/article";
import AuthComponent from "./components/auth";

// styles
import "normalize.css";
import "./root.scss";

const routesMap = (
  <div>
    <Header />
    <Route path="/" component={ArticleComponent} />
    <Route path="/users" component={AuthComponent} />
    <Footer />
  </div>
);

export default routesMap;
