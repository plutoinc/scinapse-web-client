import * as React from 'react';
import * as classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
import { Author } from '../../model/author/author';
import formatNumber from '../../helpers/formatNumber';
import { UserDevice } from '../layouts/reducer';
const styles = require('./authorShowHeader.scss');

interface AuthorShowHeaderProps {
  author: Author;
  userDevice: UserDevice;
  rightBoxContent: React.ReactNode;
  navigationContent: React.ReactNode;
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
    const { author, rightBoxContent, navigationContent, userDevice } = this.props;

    return (
      <div className={styles.headerBox}>
        <div className={styles.container}>
          <div className={styles.leftContentWrapper}>
            <div className={styles.nameBox}>
              <span className={styles.nameHeaderBox}>
                <div className={styles.usernameWrapper}>
                  <span className={styles.username}>{author.name}</span>{' '}
                </div>
                <div className={styles.affiliation}>
                  {author.lastKnownAffiliation ? author.lastKnownAffiliation.name || '' : ''}
                </div>
                {author.fosList &&
                  author.fosList.map(fos => (
                    <span className={styles.fosItem} key={fos.id}>
                      {fos.name}
                    </span>
                  ))}
                {userDevice === UserDevice.DESKTOP && this.getMetricInformation()}
              </span>
            </div>
            {userDevice !== UserDevice.DESKTOP && this.getMetricInformation()}
            {navigationContent}
          </div>
          <div className={styles.rightContentWrapper}>{rightBoxContent}</div>
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

        {(author.citationCount || author.citationCount === 0) && (
          <div className={styles.metricWrapper}>
            <span className={styles.metricValue}>{formatNumber(author.citationCount)}</span>
            <span className={styles.metricLabel}>Citations</span>
          </div>
        )}
      </div>
    );
  };
}

export default AuthorShowHeader;
