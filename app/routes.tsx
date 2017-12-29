import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { Header, Footer } from "./components/layouts";
import ArticleSearch from "./components/articleSearch";
import ArticleFeed from "./components/articleFeed";
import ArticleShow from "./components/articleShow";
import ArticleCreate from "./components/articleCreate";
import AuthComponent from "./components/auth";
import DialogComponent from "./components/dialog";
import ErrorPage from "./components/error/errorPage";
import FAQContainer from "./components/faq";
import LocationListener from "./components/locationListener";
import "normalize.css";
import "./root.scss";

const routesMap = (
  <div>
    <Header />
    <LocationListener />
    <Switch>
      <Route exact path="/" component={ArticleSearch} />
      <Route path="/search" component={ArticleSearch} />
      <Route exact path="/faq" component={FAQContainer} />
      <Route exact path="/articles" component={ArticleFeed} />
      <Route exact path="/articles/new" component={ArticleCreate} />
      <Route path="/articles/:articleId" component={ArticleShow} />
      <Route path="/users" component={AuthComponent} />
      <Route path="/:errorNum" component={ErrorPage} />
    </Switch>
    <DialogComponent />
    <Footer />
  </div>
);

export default routesMap;
