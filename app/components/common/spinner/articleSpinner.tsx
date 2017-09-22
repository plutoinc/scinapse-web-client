import * as React from "react";
const styles = require("./articleSpinner.scss");

const ArticleSpinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.bounce1} />
      <div className={styles.bounce2} />
      <div className={styles.bounce3} />
    </div>
  );
};

export default ArticleSpinner;
