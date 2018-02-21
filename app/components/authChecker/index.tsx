import * as React from "react";
import ArticleSpinner from "../common/spinner/articleSpinner";

const AuthCheckerContainer = () => (
  <div
    style={{
      display: "flex",
      height: "100vh",
      alignItems: "center",
    }}
  >
    <ArticleSpinner />
  </div>
);

export default AuthCheckerContainer;
