import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import copySelectedTextToClipboard from "../../../helpers/copySelectedTextToClipboard";
const styles = require("./citationBox.scss");

export enum AvailableCitationType {
  BIBTEX,
  RIS,
  APA,
  IEEE,
  HARVARD,
  MLA,
  VANCOUVER,
  CHICAGO,
}

interface CitationBoxProps {
  activeTab: AvailableCitationType;
  isLoading: boolean;
  citationText: string;
  handleClickCitationTab: (tab: AvailableCitationType) => void;
}

function getTabs(props: CitationBoxProps) {
  return (
    <div className={styles.tabBoxWrapper}>
      <div className={styles.normalTabWrapper}>
        <span
          onClick={() => {
            props.handleClickCitationTab(AvailableCitationType.BIBTEX);
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
            props.handleClickCitationTab(AvailableCitationType.RIS);
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
            props.handleClickCitationTab(AvailableCitationType.MLA);
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
            props.handleClickCitationTab(AvailableCitationType.APA);
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: props.activeTab === AvailableCitationType.APA,
          })}
        >
          APA
        </span>
      </div>
      {/* <span className={`${styles.plusIconWrapper}`}>
        <Icon icon="SMALL_PLUS" className={styles.plusIcon} />
      </span> */}
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
      <div className={styles.textBoxWrapper}>
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
      <div className={styles.header}>
        <div className={styles.title}>Cite this paper</div>
        <div
          onClick={() => {
            handleClickCopyButton(props.citationText);
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
