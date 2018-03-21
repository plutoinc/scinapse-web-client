import * as React from "react";
import { Link } from "react-router-dom";
import { trackAndOpenLink, trackSearch } from "../../../../helpers/handleGA";
import Icon from "../../../../icons";
import { withStyles } from "../../../../helpers/withStylesHelper";
import DOIButton from "./dotButton";
const styles = require("./infoList.scss");

export interface InfoListProps {
  referenceCount: number;
  citedCount: number;
  citedPaperAvgIF: number;
  plutoScore: number;
  DOI: string;
  articleId: number;
  source: string;
  pdfSourceUrl: string;
}

function getRefButton(props: InfoListProps) {
  if (!props.referenceCount) {
    return null;
  } else {
    return (
      <Link
        to={`/papers/${props.articleId}/ref`}
        onClick={() => {
          trackSearch("reference", `${props.articleId}`);
        }}
        className={styles.referenceButton}
      >
        <Icon className={styles.referenceIconWrapper} icon="REFERENCE" />
        <span>{`Ref ${props.referenceCount}`}</span>
      </Link>
    );
  }
}

function getCitedButton(props: InfoListProps) {
  if (!props.citedCount) {
    return null;
  } else {
    return (
      <Link
        to={`/papers/${props.articleId}/cited`}
        onClick={() => {
          trackSearch("cited", `${props.articleId}`);
        }}
        className={styles.citedButton}
      >
        <Icon className={styles.citedIconWrapper} icon="CITED" />
        <span>{`Cited ${props.citedCount}`}</span>
      </Link>
    );
  }
}

const InfoList = (props: InfoListProps) => {
  const { referenceCount, citedCount, DOI, pdfSourceUrl, source } = props;
  const shouldBeEmptyInfoList = !referenceCount && !citedCount && !DOI && !pdfSourceUrl && !source;

  if (shouldBeEmptyInfoList) {
    return <div style={{ height: 16 }} />;
  }

  return (
    <div className={styles.infoList}>
      {getRefButton(props)}
      {getCitedButton(props)}
      <a
        href={pdfSourceUrl}
        target="_blank"
        onClick={() => {
          trackAndOpenLink("searchItemPdfButton");
        }}
        style={!pdfSourceUrl ? { display: "none" } : null}
        className={styles.pdfButton}
      >
        <Icon className={styles.pdfIconWrapper} icon="PDF_ICON" />
        <span>PDF</span>
      </a>
      <DOIButton
        DOI={DOI}
        style={{
          position: "absolute",
          right: 0,
        }}
      />
      <a className={styles.sourceButton} target="_blank" href={source}>
        <Icon className={styles.sourceButtonIcon} icon="SOURCE_LINK" />
        <span>Source</span>
      </a>
    </div>
  );
};

export default withStyles<typeof InfoList>(styles)(InfoList);
