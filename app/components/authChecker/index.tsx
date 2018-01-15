import * as React from "react";
import ArticleSpinner from "../common/spinner/articleSpinner";

const styles = require("./authCheckerContainer.scss");

const AuthCheckerContainer = () => (
  <div className={styles.authCheckerContainer}>
    <ArticleSpinner className={styles.spinner} />
  </div>
);

export default AuthCheckerContainer;
