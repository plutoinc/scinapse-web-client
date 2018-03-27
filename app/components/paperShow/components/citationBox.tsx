import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./citationBox.scss");

export enum CitationBoxTab {
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
  activeTab: CitationBoxTab;
  isLoading: boolean;
  citationText: string;
  handleClickCitationTab: (tab: CitationBoxTab) => void;
}

function getTabs(props: CitationBoxProps) {
  return (
    <div className={styles.tabBoxWrapper}>
      <span
        onClick={() => {
          props.handleClickCitationTab(CitationBoxTab.BIBTEX);
        }}
        className={classNames({
          [`${styles.tabItem}`]: true,
          [`${styles.active}`]: props.activeTab === CitationBoxTab.BIBTEX,
        })}
      >
        BibTex
      </span>
      <span
        onClick={() => {
          props.handleClickCitationTab(CitationBoxTab.RIS);
        }}
        className={classNames({
          [`${styles.tabItem}`]: true,
          [`${styles.active}`]: props.activeTab === CitationBoxTab.RIS,
        })}
      >
        RIS
      </span>
      <span
        onClick={() => {
          props.handleClickCitationTab(CitationBoxTab.MLA);
        }}
        className={classNames({
          [`${styles.tabItem}`]: true,
          [`${styles.active}`]: props.activeTab === CitationBoxTab.MLA,
        })}
      >
        MLA
      </span>
      <span
        onClick={() => {
          props.handleClickCitationTab(CitationBoxTab.APA);
        }}
        className={classNames({
          [`${styles.tabItem}`]: true,
          [`${styles.active}`]: props.activeTab === CitationBoxTab.APA,
        })}
      >
        APA
      </span>
    </div>
  );
}

const CitationBox = (props: CitationBoxProps) => {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>Cite this paper</div>
        <div className={styles.copyButton}>Copy</div>
      </div>
      {getTabs(props)}
    </div>
  );
};

export default withStyles<typeof CitationBox>(styles)(CitationBox);
