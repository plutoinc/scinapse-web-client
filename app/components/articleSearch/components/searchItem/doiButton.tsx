import * as React from "react";
import { withStyles } from "../../../../helpers/withStylesHelper";
import copySelectedTextToClipboard from "../../../../helpers/copySelectedTextToClipboard";
import { TrackEventParams } from "../../../../helpers/handleGA";
const styles = require("./doiButton.scss");

interface DOIButtonProps {
  DOI?: string;
  style?: React.CSSProperties;
  trackEventParams: TrackEventParams;
}

function copyDOI(DOI: string) {
  copySelectedTextToClipboard(`https://dx.doi.org/${DOI}`);
}

const DOIButton = ({ DOI, style }: DOIButtonProps) => {
  let buttonStyle: React.CSSProperties = {};
  if (style) {
    buttonStyle = DOI ? style : { ...style, visibility: "hidden" };
  }

  return (
    <div
      onClick={() => {
        copyDOI(DOI!);
      }}
      style={buttonStyle}
      className={styles.copyDOIButton}
    >
      {`DOI : ${DOI}`}
    </div>
  );
};

export default withStyles<typeof DOIButton>(styles)(DOIButton);
