import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { trackEvent } from "../../../helpers/handleGA";
import copySelectedTextToClipboard from "../../../helpers/copySelectedTextToClipboard";
const styles = require("./DOI.scss");

interface PaperShowDOIProps {
  DOI?: string;
}

const PaperShowDOI: React.SFC<PaperShowDOIProps> = props => {
  const { DOI } = props;

  const clickDOIButton = () => {
    copySelectedTextToClipboard(`https://doi.org/${props.DOI}`);
    trackEvent({ category: "Additional Action", action: "Copy DOI" });
  };

  return (
    <div className={styles.doi}>
      <div className={styles.paperContentBlockHeader}>
        DOI
        {DOI ? (
          <button className={styles.tinyButton} onClick={clickDOIButton}>
            <Icon icon="COPY_DOI" />
            <span>Copy DOI</span>
          </button>
        ) : (
          <div> - </div>
        )}
      </div>
      <ul className={styles.doiContent}>{DOI || ""}</ul>
    </div>
  );
};

export default withStyles<typeof PaperShowDOI>(styles)(PaperShowDOI);
