import * as React from "react";
import { Paper } from "../../../model/paper";
import { trackAndOpenLink, trackEvent } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./pdfSourceButton.scss");

interface PdfSourceButtonProps {
  paper: Paper;
  wrapperStyle?: React.CSSProperties;
}

const handleClickPDFButton = (paper: Paper) => {
  if (paper) {
    trackEvent({
      category: "paper-show",
      action: "click-pdf-button",
      label: `${paper.id}`,
    });
  }
};

const PdfSourceButton = (props: PdfSourceButtonProps) => {
  const { paper, wrapperStyle } = props;

  if (!paper) {
    return null;
  }

  const pdfSourceRecord =
    paper.urls &&
    paper.urls.find(paperSource => {
      if (paperSource && paperSource.url) {
        return paperSource.url.includes(".pdf");
      } else {
        return false;
      }
    });

  if (pdfSourceRecord) {
    return (
      <a
        onClick={() => {
          handleClickPDFButton(paper);
        }}
        style={wrapperStyle}
        className={styles.pdfOrSourceButtonWrapper}
        href={pdfSourceRecord.url}
        target="_blank"
      >
        <Icon className={styles.sourceIcon} icon="DOWNLOAD" />
        <span>DOWNLOAD PDF</span>
      </a>
    );
  } else {
    let source: string;
    if (paper.doi) {
      source = `https://doi.org/${paper.doi}`;
    } else if (paper.urls && paper.urls[0]) {
      source = paper.urls[0].url;
    } else {
      source = "";
    }

    if (source && source.length > 0) {
      return (
        <a
          style={wrapperStyle}
          className={styles.pdfOrSourceButtonWrapper}
          href={source}
          onClick={() => {
            trackAndOpenLink("View In Source(paperShow)");
          }}
          target="_blank"
        >
          <Icon className={styles.sourceIcon} icon="EXTERNAL_SOURCE" />
          <span>VIEW IN SOURCE</span>
        </a>
      );
    }
  }

  return null;
};

export default withStyles<typeof PdfSourceButton>(styles)(PdfSourceButton);
