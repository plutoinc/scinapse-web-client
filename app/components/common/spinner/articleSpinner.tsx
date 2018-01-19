import * as React from "react";
const styles = require("./articleSpinner.scss");

interface IArticleSpinnerProps {
  className?: string;
}

const ArticleSpinner = (props: IArticleSpinnerProps) => {
  let className = styles.spinner;
  if (props.className) {
    className = `${className} ${props.className}`;
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
