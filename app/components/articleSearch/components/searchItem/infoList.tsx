import * as React from "react";
import { trackAndOpenLink } from "../../../../helpers/handleGA";
import Icon from "../../../../icons";
import alertToast from "../../../../helpers/makePlutoToastAction";
import EnvChecker from "../../../../helpers/envChecker";

const styles = require("./infoList.scss");

export interface IInfoListProps {
  referenceCount: number;
  citedCount: number;
  citedPaperAvgIF: number;
  plutoScore: number;
  source: string;
  DOI: string;
  articleId: number;
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
  let openOrigin: string;
  if (EnvChecker.isDev()) {
    openOrigin = `${window.location.origin}/?#`;
  } else {
    openOrigin = window.location.origin;
  }

  return (
    <div className={styles.infoList}>
      <div
        onClick={() => {
          trackAndOpenLink(`${openOrigin}/search?page=1&references=${props.articleId}`, "searchItemReference");
        }}
        className={styles.referenceButton}
      >
        Ref {props.referenceCount}
      </div>
      <div
        onClick={() => {
          trackAndOpenLink(`${openOrigin}/search?page=1&cited=${props.articleId}`, "searchItemCited");
        }}
        className={styles.citedButton}
      >
        Cited {props.citedCount}
      </div>
      <span className={styles.explanation}>Cited Paper Avg IF</span>
      <span className={styles.citedPaperAvgIF}>{props.citedPaperAvgIF}</span>
      {/* <div className={styles.separatorLine} />
      <span className={styles.explanation}>Pltuo Score</span>
      <span className={styles.pltuoScore}>{props.plutoScore}</span> */}
      <div className={styles.rightBox}>
        <div
          onClick={() => {
            trackAndOpenLink(props.source, "searchItemSource");
          }}
          className={styles.sourceButton}
        >
          <Icon className={styles.articleSourceIconWrapper} icon="ARTICLE_SOURCE" />
          Source
        </div>
        <div
          onClick={() => {
            copyDOI(props.DOI);
          }}
          className={styles.copyDOIButton}
        >
          Copy DOI
        </div>
      </div>
    </div>
  );
};

export default InfoList;
