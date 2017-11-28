import * as React from "react";
const styles = require("./articleSpinner.scss");

interface IArticleSpinnerParams {
  className?: string;
}

const ArticleSpinner = (params: IArticleSpinnerParams) => {
  let className = styles.spinner;
  if (params.className) {
    className = `${className} ${params.className}`;
  }

  return (
    <div className={className}>
      <div className={styles.bounce1} />
      <div className={styles.bounce2} />
      <div className={styles.bounce3} />
    </div>
  );
};

export default ArticleSpinner;
