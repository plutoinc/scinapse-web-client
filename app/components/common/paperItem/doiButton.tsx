import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import copySelectedTextToClipboard from "../../../helpers/copySelectedTextToClipboard";
import { TrackEventParams } from "../../../helpers/handleGA";
const styles = require("./doiButton.scss");

interface DOIButtonProps {
  DOI?: string;
  style?: React.CSSProperties;
  trackEventParams: TrackEventParams;
}

function copyDOI(DOI: string) {
  copySelectedTextToClipboard(`https://doi.org/${DOI}`);
}

const DOIButton = ({ DOI, style }: DOIButtonProps) => {
  if (!DOI) {
    return null;
  }

  return (
    <div
      onClick={() => {
        copyDOI(DOI!);
      }}
      style={style}
      className={styles.copyDOIButton}
    >
      {`DOI : ${DOI}`}
    </div>
  );
};

export default withStyles<typeof DOIButton>(styles)(DOIButton);
