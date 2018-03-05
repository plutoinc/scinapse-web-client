import * as React from "react";
import UserAgentHelper from "../../../../helpers/userAgentHelper";
import alertToast from "../../../../helpers/makePlutoToastAction";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./doiButton.scss");

interface DOIButtonProps {
  DOI?: string;
  style?: React.CSSProperties;
}

function copyDOI(DOI: string) {
  const browser = UserAgentHelper.getBrowser();

  try {
    if (browser && browser.name.match(/IE/i)) {
      (window as any).clipboardData.setData("Text", `https://dx.doi.org/${DOI}`);
    } else {
      const textField = document.createElement("textarea");
      textField.innerText = `https://dx.doi.org/${DOI}`;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();
    }

    alertToast({
      type: "success",
      message: "Copied!",
    });
  } catch (err) {
    alertToast({
      type: "error",
      message: "There was an error to copy DOI. Please use other browser(Chrome recommended)",
    });
  }
}

const DOIButton = ({ DOI, style }: DOIButtonProps) => {
  const buttonStyle = DOI ? style : { ...style, ...{ visibility: "hidden" } };

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
