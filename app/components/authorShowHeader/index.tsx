import * as React from 'react';
import * as classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@pluto_network/pluto-design-elements';
import Store from 'store';
import { withStyles } from '../../helpers/withStylesHelper';
import { Author } from '../../model/author/author';
import formatNumber from '../../helpers/formatNumber';
import { UserDevice } from '../layouts/reducer';
import RequestProfileFormDialog from '../requestProfileForm';
import Icon from '../../icons';
import { ProfileRequestKey } from '../../constants/profileRequest';
import { CurrentUser } from '../../model/currentUser';

const styles = require('./authorShowHeader.scss');

interface AuthorShowHeaderProps {
  author: Author;
  userDevice: UserDevice;
  navigationContent: React.ReactNode;
  currentUser: CurrentUser;
}

interface AuthorShowHeaderState {
  isTruncated: boolean;
  expanded: boolean;
  isOpenRequestProfileDialog: boolean;
  isOpenProfileInformationDialog: boolean;
  hadRequestedBefore: boolean;
  hideProfileRequestButton: boolean;
}

@withStyles<typeof AuthorShowHeader>(styles)
class AuthorShowHeader extends React.PureComponent<AuthorShowHeaderProps, AuthorShowHeaderState> {
  public constructor(props: AuthorShowHeaderProps) {
    super(props);

    this.state = {
      isTruncated: false,
      expanded: false,
      isOpenRequestProfileDialog: false,
      isOpenProfileInformationDialog: false,
      hadRequestedBefore: false,
      hideProfileRequestButton: false,
    };
  }

  public componentDidMount() {
    const { author, currentUser } = this.props;
    const hadRequestedBefore = Store.get(ProfileRequestKey) === author.id;
    const hideProfileRequestButton = !!currentUser.profileSlug || (Store.get(ProfileRequestKey) && !hadRequestedBefore);
    this.setState(prev => ({ ...prev, hadRequestedBefore, hideProfileRequestButton }));
  }

  public componentDidUpdate(prevProps: AuthorShowHeaderProps, prevState: AuthorShowHeaderState) {
    if (
      prevState.isOpenRequestProfileDialog !== this.state.isOpenRequestProfileDialog ||
      prevProps.author.id !== this.props.author.id ||
      prevProps.currentUser !== this.props.currentUser
    ) {
      const hadRequestedBefore = Store.get(ProfileRequestKey) === this.props.author.id;
      const hideProfileRequestButton =
        !!this.props.currentUser.profileSlug || (Store.get(ProfileRequestKey) && !hadRequestedBefore);
      this.setState(prev => ({ ...prev, hadRequestedBefore, hideProfileRequestButton }));
    }
  }

  public render() {
    const { author, navigationContent, userDevice } = this.props;
    const {
      isOpenRequestProfileDialog,
      isOpenProfileInformationDialog,
      hadRequestedBefore,
      hideProfileRequestButton,
    } = this.state;

    return (
      <div className={styles.headerBox}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            <div className={styles.leftContentWrapper}>
              <div className={styles.nameBox}>
                <span className={styles.nameHeaderBox}>
                  <div className={styles.usernameWrapper}>
                    <span className={styles.username}>{author.name}</span>{' '}
                  </div>
                  <div className={styles.affiliation}>
                    {author.lastKnownAffiliation ? author.lastKnownAffiliation.name || '' : ''}
                  </div>
                  <div className={styles.fosList}>
                    {author.fosList &&
                      author.fosList.map(fos => (
                        <span className={styles.fosItem} key={fos.id}>
                          {fos.name}
                        </span>
                      ))}
                  </div>
                  {userDevice === UserDevice.DESKTOP && this.getMetricInformation()}
                </span>
              </div>
              {userDevice !== UserDevice.DESKTOP && this.getMetricInformation()}
            </div>
            <div className={styles.rightContentWrapper}>
              <div className={styles.headerRightBox}>
                {!hideProfileRequestButton && (
                  <>
                    <Button
                      onClick={() => this.setState(prev => ({ ...prev, isOpenRequestProfileDialog: true }))}
                      elementType="button"
                      size="large"
                    >
                      {hadRequestedBefore ? <Icon icon="ELLIPSIS" /> : <Icon icon="ERROR" />}
                      <span>{hadRequestedBefore ? 'In Progress' : 'This is me'}</span>
                    </Button>
                    <div
                      onClick={() => this.setState(prev => ({ ...prev, isOpenProfileInformationDialog: true }))}
                      className={styles.profileDescription}
                    >
                      What is this?
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {navigationContent}
        </div>
        <RequestProfileFormDialog
          onClose={() => this.setState(prev => ({ ...prev, isOpenRequestProfileDialog: false }))}
          open={isOpenRequestProfileDialog}
          authorId={author.id}
        />
        <Dialog
          onClose={() => this.setState(prev => ({ ...prev, isOpenProfileInformationDialog: false }))}
          open={isOpenProfileInformationDialog}
        >
          <DialogTitle>What is the profile?</DialogTitle>
          <DialogContent classes={{ root: styles.profileInformationContent }}>
            <img
              src="//assets.scinapse.io/images/profile_hawking_screenshot.png"
              alt="profile show page example image"
            />
            <DialogContentText classes={{ root: styles.profileInformationContentText }}>
              This allows authors to claim their author profile pages and make changes. <br />
              In order to edit your information, we will need to verify using your email affiliated with your school or
              organization. <br />
              Once you are verified, you can edit your list of your publications, past & current affiliations, awards,
              experience, education, and more. <br />
              More features will be added to enhance your research experience and career.
            </DialogContentText>
          </DialogContent>
        </Dialog>
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
