import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import copySelectedTextToClipboard from "../../../helpers/copySelectedTextToClipboard";
import { AvailableCitationType } from "../records";
import { trackEvent } from "../../../helpers/handleGA";
import Icon from "../../../icons";
const styles = require("./citationBox.scss");

export interface CitationBoxProps {
  paperId: number;
  activeTab: AvailableCitationType;
  isLoading: boolean;
  citationText: string;
  handleClickCitationTab: (tab: AvailableCitationType) => void;
  fetchCitationText: () => void;
  closeCitationDialog: () => void;
}

class CitationBox extends React.PureComponent<CitationBoxProps> {
  public componentDidMount() {
    this.props.fetchCitationText();
  }

  public render() {
    const { closeCitationDialog, citationText, paperId } = this.props;

    return (
      <div className={styles.boxWrapper}>
        <div style={{ marginTop: 0 }} className={styles.header}>
          <div className={styles.title}>Cite</div>
          <div onClick={closeCitationDialog} className={styles.iconWrapper}>
            <Icon icon="X_BUTTON" />
          </div>
        </div>
        {this.getTabs()}
        {this.getTextBox()}
        <div className={styles.copyButtonWrapper}>
          <div
            onClick={() => {
              this.handleClickCopyButton(citationText);
              trackEvent({
                category: "citation-modal",
                action: "copy-citation-text",
                label: paperId.toString(),
              });
            }}
            className={styles.copyButton}
          >
            Copy
          </div>
        </div>
      </div>
    );
  }

  private getFullFeatureTabs = () => {
    const { handleClickCitationTab, activeTab } = this.props;

    return (
      <span>
        <span
          onClick={() => {
            handleClickCitationTab(AvailableCitationType.IEEE);
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: activeTab === AvailableCitationType.IEEE,
          })}
        >
          IEEE
        </span>
        <span
          onClick={() => {
            handleClickCitationTab(AvailableCitationType.HARVARD);
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: activeTab === AvailableCitationType.HARVARD,
          })}
        >
          HARVARD
        </span>
        <span
          onClick={() => {
            handleClickCitationTab(AvailableCitationType.VANCOUVER);
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: activeTab === AvailableCitationType.VANCOUVER,
          })}
        >
          VANCOUVER
        </span>
        <span
          onClick={() => {
            handleClickCitationTab(AvailableCitationType.CHICAGO);
          }}
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.active}`]: activeTab === AvailableCitationType.CHICAGO,
          })}
        >
          CHICAGO
        </span>
      </span>
    );
  };

  private getTabs = () => {
    const { handleClickCitationTab, activeTab } = this.props;

    return (
      <div className={styles.tabBoxWrapper}>
        <div className={styles.normalTabWrapper}>
          <span
            onClick={() => {
              handleClickCitationTab(AvailableCitationType.BIBTEX);
            }}
            className={classNames({
              [`${styles.tabItem}`]: true,
              [`${styles.active}`]: activeTab === AvailableCitationType.BIBTEX,
            })}
          >
            BibTex
          </span>
          <span
            onClick={() => {
              handleClickCitationTab(AvailableCitationType.RIS);
            }}
            className={classNames({
              [`${styles.tabItem}`]: true,
              [`${styles.active}`]: activeTab === AvailableCitationType.RIS,
            })}
          >
            RIS
          </span>
          <span
            onClick={() => {
              handleClickCitationTab(AvailableCitationType.MLA);
            }}
            className={classNames({
              [`${styles.tabItem}`]: true,
              [`${styles.active}`]: activeTab === AvailableCitationType.MLA,
            })}
          >
            MLA
          </span>
          <span
            onClick={() => {
              handleClickCitationTab(AvailableCitationType.APA);
            }}
            className={classNames({
              [`${styles.tabItem}`]: true,
              [`${styles.active}`]: activeTab === AvailableCitationType.APA,
            })}
          >
            APA
          </span>
          {this.getFullFeatureTabs()}
        </div>
      </div>
    );
  };

  private getTextBox = () => {
    const { isLoading, activeTab, citationText } = this.props;

    if (isLoading) {
      return (
        <div
          className={styles.textBoxWrapper}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ButtonSpinner />
        </div>
      );
    } else {
      return (
        <div
          style={{
            borderTopLeftRadius: activeTab === AvailableCitationType.BIBTEX ? "0" : "3px",
          }}
          className={styles.textBoxWrapper}
        >
          <textarea value={citationText} className={styles.textArea} readOnly={true} />
        </div>
      );
    }
  };

  private handleClickCopyButton = (citationText: string) => {
    copySelectedTextToClipboard(citationText);
  };
}

export default withStyles<typeof CitationBox>(styles)(CitationBox);
