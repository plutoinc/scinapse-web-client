import * as React from "react";
import Truncate from "react-truncate";
import MuiTooltip from "@material-ui/core/Tooltip";
import { withStyles } from "../../helpers/withStylesHelper";
import { Author } from "../../model/author/author";
import Icon from "../../icons";
import formatNumber from "../../helpers/formatNumber";
const styles = require("./authorShowHeader.scss");

interface AuthorShowHeaderProps {
  author: Author;
  rightBoxContent: React.ReactNode;
  navigationContent: React.ReactNode;
  guideBubbleSpeech?: React.ReactNode;
}

interface AuthorShowHeaderState {
  isTruncated: boolean;
  expanded: boolean;
}

@withStyles<typeof AuthorShowHeader>(styles)
class AuthorShowHeader extends React.PureComponent<AuthorShowHeaderProps, AuthorShowHeaderState> {
  constructor(props: AuthorShowHeaderProps) {
    super(props);

    this.state = {
      isTruncated: false,
      expanded: false,
    };
  }

  public render() {
    const { author, rightBoxContent, navigationContent, guideBubbleSpeech } = this.props;

    return (
      <div className={styles.headerBox}>
        <div className={styles.container}>
          <div className={styles.leftContentWrapper}>
            <div className={styles.nameBox}>
              {author.isLayered ? (
                <span className={styles.nameImgBoxWrapper}>
                  <div className={styles.imgBox}>{author.name.slice(0, 1).toUpperCase()}</div>
                </span>
              ) : null}
              <span className={styles.nameHeaderBox}>
                <div>
                  <span className={styles.username}>{author.name}</span>{" "}
                  {author.isLayered ? (
                    <MuiTooltip
                      classes={{ tooltip: styles.verificationTooltip }}
                      title="Verification Author"
                      placement="right"
                    >
                      <div className={styles.contactIconWrapper}>
                        <Icon icon="OCCUPIED" className={styles.occupiedIcon} />
                      </div>
                    </MuiTooltip>
                  ) : null}
                </div>
                <div className={styles.affiliation}>
                  {author.lastKnownAffiliation ? author.lastKnownAffiliation.name || "" : ""}
                </div>
                <div className={styles.metricInformation}>
                  {(author.paperCount || author.paperCount === 0) && (
                    <div className={styles.metricWrapper}>
                      <span className={styles.metricValue}>{formatNumber(author.paperCount)}</span>
                      <span className={styles.metricLabel}>Publications</span>
                    </div>
                  )}

                  {(author.hIndex || author.hIndex === 0) && (
                    <div className={styles.metricWrapper}>
                      <span className={styles.metricValue}>{formatNumber(author.hIndex)}</span>
                      <span className={styles.metricLabel}>H-index</span>
                    </div>
                  )}

                  {(author.citationCount || author.hIndex === 0) && (
                    <div className={styles.metricWrapper}>
                      <span className={styles.metricValue}>{formatNumber(author.citationCount)}</span>
                      <span className={styles.metricLabel}>Citations</span>
                    </div>
                  )}
                </div>
                <div className={styles.rightBox}>{rightBoxContent}</div>
                {guideBubbleSpeech}
              </span>
            </div>
            {this.getProfileInformation()}
            {navigationContent}
          </div>
        </div>
      </div>
    );
  }

  private getProfileInformation = () => {
    const { author } = this.props;
    const { isTruncated, expanded } = this.state;

    if (!author.isLayered) {
      return null;
    }

    return (
      <div>
        <div className={styles.bioSection}>
          <Truncate
            lines={!expanded && 3}
            ellipsis={
              <a onClick={this.toggleLines} className={styles.moreOrLess}>
                {`  ... More`}
              </a>
            }
            onTruncate={this.handleTruncate}
          >
            {author.bio || ""}
          </Truncate>
          {!isTruncated &&
            expanded && (
              <a className={styles.moreOrLess} onClick={this.toggleLines}>
                {`  Less`}
              </a>
            )}
        </div>
        {!author.isEmailHidden &&
          author.email && (
            <span className={styles.contactSection}>
              <a href={`mailto:${author.email}`} target="_blank" className={styles.contactIconWrapper}>
                <Icon icon="EMAIL_ICON" className={styles.emailIcon} />
              </a>
              <a href={`mailto:${author.email}`} target="_blank">
                {author.email}
              </a>
            </span>
          )}

        {author.webPage && (
          <span className={styles.contactSection}>
            <a href={author.webPage || "#"} target="_blank" className={styles.contactIconWrapper}>
              <Icon icon="EXTERNAL_SOURCE" className={styles.externalSource} />
            </a>
            <a href={author.webPage || "#"} target="_blank">
              {author.webPage || ""}
            </a>
          </span>
        )}
      </div>
    );
  };

  private handleTruncate = (truncated: boolean) => {
    if (this.state.isTruncated !== truncated) {
      this.setState({
        isTruncated: truncated,
      });
    }
  };

  private toggleLines = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };
}

export default AuthorShowHeader;
