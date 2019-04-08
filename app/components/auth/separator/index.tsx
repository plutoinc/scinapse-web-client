import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./separator.scss");

const ORSeparator: React.FunctionComponent = React.memo(() => {
  return (
    <div className={styles.orSeparatorBox}>
      <div className={styles.dashedSeparator} />
      <div className={styles.orContent}>or</div>
      <div className={styles.dashedSeparator} />
    </div>
  );
});

export default withStyles<typeof ORSeparator>(styles)(ORSeparator);
