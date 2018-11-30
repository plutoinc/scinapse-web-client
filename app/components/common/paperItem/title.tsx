import * as React from "react";
import { escapeRegExp } from "lodash";
import { Link } from "react-router-dom";
import HighLightedContent from "../highLightedContent";
import { trackEvent } from "../../../helpers/handleGA";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import EnvChecker from "../../../helpers/envChecker";
const styles = require("./title.scss");

export interface TitleProps {
  title: string;
  paperId: number;
  source: string;
  refererSection: string;
  searchQueryText?: string;
}

class Title extends React.PureComponent<TitleProps, {}> {
  public render() {
    const { title, paperId, searchQueryText, source } = this.props;

    if (!title) {
      return null;
    }
    // for removing first or last space or trash value of content
    const trimmedTitle = title
      .replace(/^ /gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/#[A-Z0-9]+#/g, "");

    const noSearchQueryText = !searchQueryText;
    const searchQuery = escapeRegExp(searchQueryText);
    if (noSearchQueryText) {
      return (
        <div>
          <Link
            to={{
              pathname: `/papers/${paperId}`,
            }}
            onClick={() => {
              this.trackEvent(false);
            }}
            className={styles.title}
          >
            <span>{trimmedTitle}</span>
          </Link>
          <a
            onClick={() => {
              this.trackEvent(true);
            }}
            className={styles.newTabIconWrapper}
            href={`/papers/${paperId}`}
            target="_blank"
          >
            <Icon className={styles.newTabIcon} icon="EXTERNAL_SOURCE" />
          </a>
        </div>
      );
    }
    return (
      <div>
        <HighLightedContent
          content={trimmedTitle}
          highLightContent={searchQuery}
          className={styles.title}
          onClickFunc={() => {
            this.trackEvent();
          }}
          href={source}
          to={{
            pathname: `/papers/${paperId}`,
          }}
        />
        <a
          onClick={() => {
            this.trackEvent(true);
          }}
          className={styles.newTabIconWrapper}
          href={`/papers/${paperId}`}
          target="_blank"
        >
          <Icon className={styles.newTabIcon} icon="EXTERNAL_SOURCE" />
        </a>
      </div>
    );
  }

  private trackEvent = (newTab?: boolean) => {
    const { refererSection } = this.props;

    if (!EnvChecker.isOnServer()) {
      trackEvent({
        category: "Flow to Paper Show",
        action: newTab ? "Click Title New Tab" : "Click Title",
        label: JSON.stringify({ referer: refererSection, refererLocation: location.pathname }),
      });
    }
  };
}

export default withStyles<typeof Title>(styles)(Title);
