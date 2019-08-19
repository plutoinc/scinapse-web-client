import * as React from 'react';
import Truncate from 'react-truncate';
import MuiTooltip from '@material-ui/core/Tooltip';
import * as classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
import { Author } from '../../model/author/author';
import Icon from '../../icons';
import formatNumber from '../../helpers/formatNumber';
import UploadableProfileImage from './uploadableProfileImage';
import { CurrentUser } from '../../model/currentUser';
import { UserDevice } from '../layouts/reducer';
const styles = require('./authorShowHeader.scss');

interface AuthorShowHeaderProps {
  author: Author;
  currentUser: CurrentUser;
  userDevice: UserDevice;
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
  public constructor(props: AuthorShowHeaderProps) {
    super(props);

    this.state = {
      isTruncated: false,
      expanded: false,
    };
  }

  public render() {
    const { author, rightBoxContent, navigationContent, guideBubbleSpeech, userDevice } = this.props;

    return (
      <div className={styles.headerBox}>
        <div className={styles.container}>
          <div className={styles.leftContentWrapper}>
            <div className={styles.nameBox}>
              {author.isLayered && <UploadableProfileImage />}
              <span className={styles.nameHeaderBox}>
                <div className={styles.usernameWrapper}>
                  <span className={styles.username}>{author.name}</span>{' '}
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
                  {author.lastKnownAffiliation ? author.lastKnownAffiliation.name || '' : ''}
                </div>
                {userDevice === UserDevice.DESKTOP && this.getMetricInformation()}
                <div className={styles.rightBox}>{rightBoxContent}</div>
                {guideBubbleSpeech}
              </span>
            </div>
            {userDevice !== UserDevice.DESKTOP && this.getMetricInformation()}
            {this.getProfileInformation()}
            {navigationContent}
          </div>
        </div>
      </div>
    );
  }

  private getMetricInformation = () => {
    const { author, userDevice } = this.props;

    return (
      <div
        className={classNames({
          [styles.metricInformation]: userDevice === UserDevice.DESKTOP,
          [styles.mobileMetricInformation]: userDevice !== UserDevice.DESKTOP,
        })}
      >
        {(author.paperCount || author.paperCount === 0) && (
          <div className={styles.metricWrapper}>
            <span className={styles.metricValue}>{formatNumber(author.paperCount)}</span>
            <span className={styles.metricLabel}>Publications</span>
          </div>
        )}

        {(author.hindex || author.hindex === 0) && (
          <div className={styles.metricWrapper}>
            <span className={styles.metricValue}>{formatNumber(author.hindex)}</span>
            <span className={styles.metricLabel}>H-index</span>
          </div>
        )}

        {(author.citationCount || author.hindex === 0) && (
          <div className={styles.metricWrapper}>
            <span className={styles.metricValue}>{formatNumber(author.citationCount)}</span>
            <span className={styles.metricLabel}>Citations</span>
          </div>
        )}
      </div>
    );
  };

  private getProfileInformation = () => {
    const { author } = this.props;
    const { isTruncated, expanded } = this.state;

    if (!author.isLayered) {
      return null;
    }

    return (
      <div className={styles.profileInformationSection}>
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
            {author.bio || ''}
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
              <a
                href={`mailto:${author.email}`}
                target="_blank"
                rel="noopener nofollow noreferrer"
                className={styles.contactIconWrapper}
              >
                <Icon icon="EMAIL_ICON" className={styles.emailIcon} />
              </a>
              <a href={`mailto:${author.email}`} target="_blank" rel="noopener nofollow noreferrer">
                {author.email}
              </a>
            </span>
          )}

        {author.webPage && (
          <span className={styles.contactSection}>
            <a
              href={author.webPage || '#'}
              target="_blank"
              rel="noopener nofollow noreferrer"
              className={styles.contactIconWrapper}
            >
              <Icon icon="EXTERNAL_SOURCE" className={styles.externalSource} />
            </a>
            <a href={author.webPage || '#'} target="_blank" rel="noopener nofollow noreferrer">
              {author.webPage || ''}
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
