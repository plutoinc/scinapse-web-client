import * as React from "react";
import { withStyles } from "../../../../helpers/withStylesHelper";
import copySelectedTextToClipboard from "../../../../helpers/copySelectedTextToClipboard";
const styles = require("./doiButton.scss");

interface DOIButtonProps {
  DOI?: string;
  style?: React.CSSProperties;
}

function copyDOI(DOI: string) {
  copySelectedTextToClipboard(`https://dx.doi.org/${DOI}`);
}

const DOIButton = ({ DOI, style }: DOIButtonProps) => {
  const buttonStyle: React.CSSProperties = DOI ? style : { ...style, ...{ visibility: "hidden" } };

  return (
    <div
      onClick={() => {
        copyDOI(DOI);
      }}
      style={buttonStyle}
      className={styles.copyDOIButton}
    >
      {`DOI : ${DOI}`}
    </div>
  );
};

export default withStyles<typeof DOIButton>(styles)(DOIButton);
