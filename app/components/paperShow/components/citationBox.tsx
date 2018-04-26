import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import copySelectedTextToClipboard from "../../../helpers/copySelectedTextToClipboard";
import { AvailableCitationType } from "../records";
import { trackEvent } from "../../../helpers/handleGA";
const styles = require("./citationBox.scss");

export interface CitationBoxProps {
  paperId: number;
  activeTab: AvailableCitationType;
  isLoading: boolean;
  citationText: string | null;
  toggleCitationDialog: () => void;
  handleClickCitationTab: (tab: AvailableCitationType, paperId?: number) => void;
  setActiveCitationDialogPaperId?: (paperId: number) => void;
}

function getFullFeatureTabs(props: CitationBoxProps) {
  return (
    <span>
      <span
        onClick={() => {
          props.handleClickCitationTab(AvailableCitationType.IEEE, props.paperId);
        }}
        className={classNames({
          [`${styles.tabItem}`]: true,
          [`${styles.active}`]: props.activeTab === AvailableCitationType.IEEE,
        })}
      >
        IEEE
      </span>
      <span
        onClick={() => {
          props.handleClickCitationTab(AvailableCitationType.HARVARD, props.paperId);
        }}
        className={classNames({
          [`${styles.tabItem}`]: true,
          [`${styles.active}`]: props.activeTab === AvailableCitationType.HARVARD,
        })}
      >
        HARVARD
      </span>
      <span
        onClick={() => {
          props.handleClickCitationTab(AvailableCitationType.VANCOUVER, props.paperId);
        }}
        className={classNames({
          [`${styles.tabItem}`]: true,
          [`${styles.active}`]: props.activeTab === AvailableCitationType.VANCOUVER,
        })}
      >
        VANCOUVER
      </span>
      <span
        onClick={() => {
          props.handleClickCitationTab(AvailableCitationType.CHICAGO, props.paperId);
        }}
        className={classNames({
          [`${styles.tabItem}`]: true,
          [`${styles.active}`]: props.activeTab === AvailableCitationType.CHICAGO,
        })}
      >
        CHICAGO
      </span>
    </span>
  );
}

function getTabs(props: CitationBoxProps) {
  return (
    <div className={styles.tabBoxWrapper}>
      <div className={styles.normalTabWrapper}>
        <span
          onClick={() => {
            props.handleClickCitationTab(AvailableCitationType.BIBTEX, props.paperId);
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: props.activeTab === AvailableCitationType.BIBTEX,
          })}
        >
          BibTex
        </span>
        <span
          onClick={() => {
            props.handleClickCitationTab(AvailableCitationType.RIS, props.paperId);
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: props.activeTab === AvailableCitationType.RIS,
          })}
        >
          RIS
        </span>
        <span
          onClick={() => {
            props.handleClickCitationTab(AvailableCitationType.MLA, props.paperId);
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: props.activeTab === AvailableCitationType.MLA,
          })}
        >
          MLA
        </span>
        <span
          onClick={() => {
            props.handleClickCitationTab(AvailableCitationType.APA, props.paperId);
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: props.activeTab === AvailableCitationType.APA,
          })}
        >
          APA
        </span>
        {getFullFeatureTabs(props)}
      </div>
    </div>
  );
}

function getTextBox(props: CitationBoxProps) {
  if (props.isLoading) {
    return (
      <div
        className={styles.textBoxWrapper}
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ButtonSpinner />
      </div>
    );
  } else {
    return (
      <div
        style={{ borderTopLeftRadius: props.activeTab === AvailableCitationType.BIBTEX ? "0" : "3px" }}
        className={styles.textBoxWrapper}
      >
        <textarea value={props.citationText} className={styles.textArea} readOnly={true} />
      </div>
    );
  }
}

function handleClickCopyButton(citationText: string) {
  copySelectedTextToClipboard(citationText);
}

const CitationBox = (props: CitationBoxProps) => {
  return (
    <div>
      <div style={{ marginTop: 0 }} className={styles.header}>
        <div className={styles.title}>Cite</div>
        <div
          onClick={() => {
            handleClickCopyButton(props.citationText);
            trackEvent({
              category: "citation-modal",
              action: "copy-citation-text",
              label: props.paperId.toString(),
            });
          }}
          className={styles.copyButton}
        >
          Copy
        </div>
      </div>
      {getTabs(props)}
      {getTextBox(props)}
    </div>
  );
};

export default withStyles<typeof CitationBox>(styles)(CitationBox);
