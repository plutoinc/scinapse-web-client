import * as React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./failedToLoadPaper.scss");

const FailedToLoadPaper: React.SFC = () => {
  return (
    <div className={styles.failedPage}>
      <div className={styles.failedContentWrapper}>
        <h1>Sorry, Failed to load the paper.</h1>
        <Link to="/">Go to Home</Link>
      </div>
    </div>
  );
};

export default withStyles<typeof FailedToLoadPaper>(styles)(FailedToLoadPaper);
