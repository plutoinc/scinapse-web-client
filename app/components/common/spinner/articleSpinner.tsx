import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./articleSpinner.scss");

interface ArticleSpinnerProps {
  className?: string;
  style?: React.CSSProperties;
}

const ArticleSpinner = (props: ArticleSpinnerProps) => {
  let className = styles.spinner;
  if (props.className) {
    className = `${className} ${props.className}`;
  }

  return (
    <div style={props.style} className={className}>
      <div className={styles.bounce1} />
      <div className={styles.bounce2} />
      <div className={styles.bounce3} />
    </div>
  );
};

export default withStyles<typeof ArticleSpinner>(styles)(ArticleSpinner);
