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

const InfoList = (props: IInfoListProps) => {
  const origin = EnvChecker.getOrigin();

  return (
    <div className={styles.infoList}>
      <a
        href={`${origin}/search?page=1&query=${papersQueryFormatter.formatPapersQuery({
          text: props.searchQueryText,
        })}&references=${props.articleId}`}
        target="_blank"
        onClick={() => {
          trackSearch("reference", `${props.articleId}`);
        }}
        style={!props.referenceCount ? { display: "none" } : null}
        className={styles.referenceButton}
      >
        Ref {props.referenceCount}
      </a>
      <a
        href={`${origin}/search?page=1&query=${papersQueryFormatter.formatPapersQuery({
          text: props.searchQueryText,
        })}&cited=${props.articleId}`}
        target="_blank"
        onClick={() => {
          trackSearch("cited", `${props.articleId}`);
        }}
        style={!props.citedCount ? { display: "none" } : null}
        className={styles.citedButton}
      >
        Cited {props.citedCount}
      </a>
      {/* <span className={styles.explanation}>Cited Paper Avg IF</span>
      <span className={styles.citedPaperAvgIF}>{props.citedPaperAvgIF}</span>
      <div className={styles.separatorLine} />
      <span className={styles.explanation}>Pltuo Score</span>
      <span className={styles.pltuoScore}>{props.plutoScore}</span> */}
      <div className={styles.rightBox}>
        <a
          href={props.pdfSourceUrl}
          target="_blank"
          onClick={() => {
            trackAndOpenLink("searchItemPdfButton");
          }}
          style={!props.pdfSourceUrl ? { visibility: "hidden" } : null}
          className={styles.pdfButton}
        >
          <Icon className={styles.pdfIconWrapper} icon="PDF_ICON" />
          PDF
        </a>
        <div
          onClick={() => {
            copyDOI(props.DOI);
          }}
          style={!props.DOI ? { visibility: "hidden" } : null}
          className={styles.copyDOIButton}
        >
          Copy DOI
        </div>
      </div>
    </div>
  );
};

export default InfoList;
