import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./searchingPDFBtn.scss");

interface SearchingPDFBtnProps {
  hasLoadingOaCheck: boolean;
}

const SearchingPDFBtn: React.FunctionComponent<SearchingPDFBtnProps> = props => {
  const { hasLoadingOaCheck } = props;

  return (
    <button className={styles.loadingBtnStyle} disabled={hasLoadingOaCheck}>
      <div className={styles.spinnerWrapper}>
        <CircularProgress color="inherit" disableShrink={true} size={14} thickness={4} />
      </div>
      Searching PDF
    </button>
  );
};

export default withStyles<typeof SearchingPDFBtn>(styles)(SearchingPDFBtn);
