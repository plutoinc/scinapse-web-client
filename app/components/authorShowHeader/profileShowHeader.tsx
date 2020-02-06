import React from 'react';
import Truncate from 'react-truncate';
import MuiTooltip from '@material-ui/core/Tooltip';
import classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
import Icon from '../../icons';
import formatNumber from '../../helpers/formatNumber';
import UploadableProfileImage from './uploadableProfileImage';
import { CurrentUser } from '../../model/currentUser';
import { UserDevice } from '../layouts/reducer';
import { Profile } from '../../model/profile';
const styles = require('./authorShowHeader.scss');

interface ProfileShowHeaderProps {
  profile: Profile;
  currentUser: CurrentUser;
  userDevice: UserDevice;
  rightBoxContent: React.ReactNode;
  navigationContent: React.ReactNode;
  guideBubbleSpeech?: React.ReactNode;
}

interface ProfileShowHeaderState {
  isTruncated: boolean;
  expanded: boolean;
}

@withStyles<typeof ProfileShowHeader>(styles)
class ProfileShowHeader extends React.PureComponent<ProfileShowHeaderProps, ProfileShowHeaderState> {
  public constructor(props: ProfileShowHeaderProps) {
    super(props);

    this.state = {
      isTruncated: false,
      expanded: false,
    };
  }

  public render() {
    const { profile, rightBoxContent, navigationContent, guideBubbleSpeech, userDevice, currentUser } = this.props;

    return (
      <div className={styles.headerBox}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            <div className={styles.leftContentWrapper}>
              <div className={styles.nameBox}>
                <UploadableProfileImage profile={profile} currentUser={currentUser} />
                <span className={styles.nameHeaderBox}>
                  <div className={styles.usernameWrapper}>
                    <span className={styles.username}>{`${profile.firstName} ${profile.lastName}`}</span>{' '}
                    <MuiTooltip
                      classes={{ tooltip: styles.verificationTooltip }}
                      title="Verified Author"
                      placement="right"
                    >
                      <div className={styles.contactIconWrapper}>
                        <Icon icon="OCCUPIED" className={styles.occupiedIcon} />
                      </div>
                    </MuiTooltip>
                  </div>
                  <div className={styles.affiliation}>{profile.affiliationName || ''}</div>
                  <div className={styles.fosList}>
                    {profile.fosList &&
                      profile.fosList.map(fos => (
                        <span className={styles.fosItem} key={fos.id}>
                          {fos.name}
                        </span>
                      ))}
                  </div>
                  {userDevice === UserDevice.DESKTOP && this.getMetricInformation()}
                </span>
              </div>
              {userDevice !== UserDevice.DESKTOP && this.getMetricInformation()}
              {this.getProfileInformation()}
            </div>
            <div className={styles.rightContentWrapper}>
              {rightBoxContent}
              {guideBubbleSpeech}
            </div>
          </div>
          {navigationContent}
        </div>
      </div>
    );
  }

  private getMetricInformation = () => {
    const { profile, userDevice } = this.props;

    return (
      <div
        className={classNames({
          [styles.metricInformation]: userDevice === UserDevice.DESKTOP,
          [styles.mobileMetricInformation]: userDevice !== UserDevice.DESKTOP,
        })}
      >
        {(profile.paperCount || profile.paperCount === 0) && (
          <div className={styles.metricWrapper}>
            <span className={styles.metricValue}>{formatNumber(profile.paperCount)}</span>
            <span className={styles.metricLabel}>Publications</span>
          </div>
        )}

        {(profile.hindex || profile.hindex === 0) && (
          <div className={styles.metricWrapper}>
            <span className={styles.metricValue}>{formatNumber(profile.hindex)}</span>
            <span className={styles.metricLabel}>H-index</span>
          </div>
        )}

        {(profile.citationCount || profile.citationCount === 0) && (
          <div className={styles.metricWrapper}>
            <span className={styles.metricValue}>{formatNumber(profile.citationCount)}</span>
            <span className={styles.metricLabel}>Citations</span>
          </div>
        )}
      </div>
    );
  };

  private getProfileInformation = () => {
    const { profile } = this.props;
    const { isTruncated, expanded } = this.state;

    return (
      <div className={styles.profileInformationSection}>
        {profile.bio && (
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
              {profile.bio || ''}
            </Truncate>
            {!isTruncated &&
              expanded && (
                <a className={styles.moreOrLess} onClick={this.toggleLines}>
                  {`  Less`}
                </a>
              )}
          </div>
        )}
        {profile.isEmailPublic &&
          profile.email && (
            <span className={styles.contactSection}>
              <a
                href={`mailto:${profile.email}`}
                target="_blank"
                rel="noopener nofollow noreferrer"
                className={styles.contactIconWrapper}
              >
                <Icon icon="EMAIL" className={styles.emailIcon} />
              </a>
              <a href={`mailto:${profile.email}`} target="_blank" rel="noopener nofollow noreferrer">
                {profile.email}
              </a>
            </span>
          )}

        {profile.webPage &&
          profile.webPage.trim() && (
            <span className={styles.contactSection}>
              <a
                href={profile.webPage || '#'}
                target="_blank"
                rel="noopener nofollow noreferrer"
                className={styles.contactIconWrapper}
              >
                <Icon icon="EXTERNAL_SOURCE" className={styles.externalSource} />
              </a>
              <a href={profile.webPage || '#'} target="_blank" rel="noopener nofollow noreferrer">
                {profile.webPage || ''}
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

export default ProfileShowHeader;
