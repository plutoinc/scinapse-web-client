import * as React from "react";
import { Route, Switch } from "react-router-dom";

// containers
import { Header, Footer } from "./components/layouts";
import ArticleComponent from "./components/article";
import AuthComponent from "./components/auth";
import DialogComponent from "./components/dialog";

// styles
import "normalize.css";
import "./root.scss";

// TODO: Make NotFound component and extract it
const NotFound = () => {
  return (
    <div style={{ marginTop: 75 }}>
      <h1>404, PAGE NOT FOUND</h1>
    </div>
  );
};

const routesMap = (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={ArticleComponent} />
      <Route path="/users" component={AuthComponent} />
      <Route path="/articles" component={ArticleComponent} />
      <Route path="*" component={NotFound} />
    </Switch>
    <DialogComponent />
    <Footer />
  </div>
);

export default routesMap;
