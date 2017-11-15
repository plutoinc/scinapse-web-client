import * as React from "react";
import { Route, Switch } from "react-router-dom";

// containers
import { Header, Footer } from "./components/layouts";
import ArticleFeed from "./components/articleFeed";
import ArticleShow from "./components/articleShow";
import ArticleCreate from "./components/articleCreate";
import AuthComponent from "./components/auth";
import DialogComponent from "./components/dialog";
import ErrorPage from "./components/error/errorPage";
import FAQContainer from "./components/faq";

// styles
import "normalize.css";
import "./root.scss";

const routesMap = (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={ArticleFeed} />
      <Route exact path="/faq" component={FAQContainer} />
      <Route exact path="/articles" component={ArticleFeed} />
      <Route exact path="/articles/new" component={ArticleCreate} />
      <Route path="/articles/:articleId" component={ArticleShow} />
      <Route path="/users" component={AuthComponent} />
      <Route path="/:errorNum" component={ErrorPage} />
    </Switch>
    <DialogComponent />
    <div
      style={{
        // for footer upper space
        height: 20,
      }}
    />
    <Footer />
  </div>
);

export default routesMap;
