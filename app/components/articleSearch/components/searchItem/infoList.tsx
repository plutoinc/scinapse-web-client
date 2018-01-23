import * as React from "react";
import { trackAndOpenLink, trackSearch } from "../../../../helpers/handleGA";
import Icon from "../../../../icons";
import alertToast from "../../../../helpers/makePlutoToastAction";
import EnvChecker from "../../../../helpers/envChecker";
import papersQueryFormatter from "../../../../helpers/papersQueryFormatter";

const styles = require("./infoList.scss");

export interface IInfoListProps {
  referenceCount: number;
  citedCount: number;
  citedPaperAvgIF: number;
  plutoScore: number;
  DOI: string;
  articleId: number;
  searchQueryText: string;
  pdfSourceUrl: string;
}

const InfoList = (props: IInfoListProps) => {
  const { referenceCount, citedCount, DOI, articleId, searchQueryText, pdfSourceUrl } = props;
  const origin = EnvChecker.getOrigin();
  const shouldBeEmptyInfoList = !referenceCount && !citedCount && !DOI && !pdfSourceUrl;

  if (shouldBeEmptyInfoList) {
    return <div style={{ height: 16 }} />;
  }

  return (
    <div className={styles.infoList}>
      <a
        href={`${origin}/search?page=1&query=${papersQueryFormatter.formatPapersQuery({
          text: searchQueryText,
        })}&references=${articleId}`}
        target="_blank"
        onClick={() => {
          trackSearch("reference", `${articleId}`);
        }}
        style={!referenceCount ? { display: "none" } : null}
        className={styles.referenceButton}
      >
        Ref {referenceCount}
      </a>
      <a
        href={`${origin}/search?page=1&query=${papersQueryFormatter.formatPapersQuery({
          text: searchQueryText,
        })}&cited=${articleId}`}
        target="_blank"
        onClick={() => {
          trackSearch("cited", `${articleId}`);
        }}
        style={!citedCount ? { display: "none" } : null}
        className={styles.citedButton}
      >
        Cited {citedCount}
      </a>
      {/* <span className={styles.explanation}>Cited Paper Avg IF</span>
      <span className={styles.citedPaperAvgIF}>{citedPaperAvgIF}</span>
      <div className={styles.separatorLine} />
      <span className={styles.explanation}>Pltuo Score</span>
      <span className={styles.pltuoScore}>{plutoScore}</span> */}
      <div className={styles.rightBox}>
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
          PDF
        </a>
        <div
          onClick={() => {
            copyDOI(DOI);
          }}
          style={!DOI ? { visibility: "hidden" } : null}
          className={styles.copyDOIButton}
        >
          Copy DOI
        </div>
      </div>
    </div>
  );
};

function copyDOI(DOI: string) {
  const textField = document.createElement("textarea");
  textField.innerText = DOI;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  textField.remove();

  alertToast({
    type: "success",
    message: "Copied!",
  });
}

export default InfoList;
