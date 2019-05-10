import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./relatedPaperInCollectionShow.scss");

const RelatedPaperInCollectionShow: React.FunctionComponent<{}> = () => {
  return (
    <div className={styles.relatedPaperContainer}>
      <div className={styles.titleContext}>📄 How about these papers?</div>
    </div>
  );
};

export default withStyles<typeof styles>(styles)(RelatedPaperInCollectionShow);
