import * as React from "react";
import { trackAndOpenLink, trackSearch } from "../../../../helpers/handleGA";
import Icon from "../../../../icons";
import UserAgentHelper from "../../../../helpers/userAgentHelper";
import alertToast from "../../../../helpers/makePlutoToastAction";
import EnvChecker from "../../../../helpers/envChecker";
import papersQueryFormatter from "../../../../helpers/papersQueryFormatter";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./infoList.scss");

export interface InfoListProps {
  referenceCount: number;
  citedCount: number;
  citedPaperAvgIF: number;
  plutoScore: number;
  DOI: string;
  articleId: number;
  cognitiveId: number;
  searchQueryText: string;
  pdfSourceUrl: string;
}

const InfoList = (props: InfoListProps) => {
  const { referenceCount, citedCount, DOI, articleId, searchQueryText, pdfSourceUrl, cognitiveId } = props;
  const origin = EnvChecker.getOrigin();
  const shouldBeEmptyInfoList = !referenceCount && !citedCount && !DOI && !pdfSourceUrl;

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
      <div
        onClick={() => {
          copyDOI(DOI);
        }}
        style={!DOI ? { visibility: "hidden" } : null}
        className={styles.copyDOIButton}
      >
        {`DOI : ${DOI}`}
      </div>
    </div>
  );
};

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

export default withStyles<typeof InfoList>(styles)(InfoList);
