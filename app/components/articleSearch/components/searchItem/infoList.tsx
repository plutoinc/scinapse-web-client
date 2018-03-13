import * as React from "react";
import { trackAndOpenLink, trackSearch } from "../../../../helpers/handleGA";
import Icon from "../../../../icons";
import EnvChecker from "../../../../helpers/envChecker";
import papersQueryFormatter from "../../../../helpers/papersQueryFormatter";
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
  cognitiveId: number;
  searchQueryText: string;
  pdfSourceUrl: string;
}

const InfoList = (props: InfoListProps) => {
  const { referenceCount, citedCount, DOI, articleId, searchQueryText, pdfSourceUrl, cognitiveId, source } = props;
  const origin = EnvChecker.getOrigin();
  const shouldBeEmptyInfoList = !referenceCount && !citedCount && !DOI && !pdfSourceUrl && !source;

  if (shouldBeEmptyInfoList) {
    return <div style={{ height: 16 }} />;
  }

  return (
    <div className={styles.infoList}>
      <a
        href={`${origin}/search?${papersQueryFormatter.stringifyPapersQuery({
          query: searchQueryText,
          filter: {},
          page: 1,
          references: articleId,
          cognitiveId,
        })}`}
        target="_blank"
        onClick={() => {
          trackSearch("reference", `${articleId}`);
        }}
        style={!referenceCount ? { display: "none" } : null}
        className={styles.referenceButton}
      >
        <Icon className={styles.referenceIconWrapper} icon="REFERENCE" />
        <span>{`Ref ${referenceCount}`}</span>
      </a>
      <a
        href={`${origin}/search?${papersQueryFormatter.stringifyPapersQuery({
          query: searchQueryText,
          filter: {},
          page: 1,
          cited: articleId,
          cognitiveId,
        })}`}
        target="_blank"
        onClick={() => {
          trackSearch("cited", `${articleId}`);
        }}
        style={!citedCount ? { display: "none" } : null}
        className={styles.citedButton}
      >
        <Icon className={styles.citedIconWrapper} icon="CITED" />
        <span>{`Cited ${citedCount}`}</span>
      </a>
      <a
        href={pdfSourceUrl}
        target="_blank"
        onClick={() => {
          trackAndOpenLink("searchItemPdfButton");
        }}
        style={!pdfSourceUrl ? { visibility: "hidden" } : null}
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
