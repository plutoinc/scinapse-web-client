import * as React from 'react';
import { connect } from 'react-redux';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FeedbackManager from '@pluto_network/scinapse-feedback';
import * as Cookies from 'js-cookie';
import Icon from '../../icons';
import { withStyles } from '../../helpers/withStylesHelper';
import { trackEvent } from '../../helpers/handleGA';
import { CurrentUser } from '../../model/currentUser';
import { LayoutState } from '../../components/layouts/reducer';
import { AppState } from '../../reducers';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as classNames from 'classnames';
import { UserDevice } from '../../components/layouts/reducer';
declare var ga: any;
const styles = require('./feedbackButton.scss');

interface FeedbackButtonProps extends RouteComponentProps<any> {
  currentUser: CurrentUser;
  layout: LayoutState;
}

interface FeedbackButtonStates {
  isPopoverOpen: boolean;
  isLoadingFeedback: boolean;
  emailInput: string;
  feedbackContent: string;
  hasSentFeedback: boolean;
}

const FEEDBACK_ALREADY_SENT = 'pvAlreadySent';

const UserSurveyMenu: React.SFC<{
  handleClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ handleClick }) => {
  return (
    <a
      onClick={handleClick}
      target="_blank"
      rel="noopener nofollow noreferrer"
      className={styles.menuItemContent}
      // tslint:disable-next-line:max-line-length
      href="https://docs.google.com/forms/d/e/1FAIpQLSfTxxzUbMWfEaJNO_2EHzjnlb9Nx3xQj3LQyswnpKitPtozfA/viewform?usp=sf_link"
    >
      Short Survey
    </a>
  );
};

@withStyles<typeof FeedbackButton>(styles)
class FeedbackButton extends React.PureComponent<FeedbackButtonProps, FeedbackButtonStates> {
  private popoverAnchorEl: HTMLElement | null;

  public constructor(props: FeedbackButtonProps) {
    super(props);

    this.state = {
      isPopoverOpen: false,
      isLoadingFeedback: false,
      emailInput: (props.currentUser && props.currentUser.email) || '',
      feedbackContent: '',
      hasSentFeedback: false,
    };
  }

  public componentWillReceiveProps(nextProps: FeedbackButtonProps) {
    if (this.props.currentUser.isLoggedIn !== nextProps.currentUser.isLoggedIn) {
      this.setState(prevState => ({ ...prevState, emailInput: nextProps.currentUser.email || '' }));
    }
  }

  public render() {
    const { layout, location } = this.props;
    const { isPopoverOpen } = this.state;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return null;
    }
    if ('papers' === location.pathname.split('/')[1]) {
      return null;
    }

    return (
      <ClickAwayListener onClickAway={this.handleCloseRequest}>
        <div className={`${styles.feedbackButtonBox} mui-fixed`}>
          <div
            ref={el => (this.popoverAnchorEl = el)}
            onClick={e => {
              this.toggleFeedbackDropdown(e);
            }}
            className={styles.feedbackButtonWrapper}
          >
            <Icon icon="FEEDBACK_PENCIL" className={styles.feedbackButtonIcon} />
            <span>Feedback</span>
          </div>

          <Popper
            open={isPopoverOpen}
            anchorEl={this.popoverAnchorEl!}
            placement="top-end"
            modifiers={{
              preventOverflow: {
                enabled: true,
                boundariesElement: 'window',
              },
            }}
            disablePortal
          >
            <div className={styles.popperPaper}>
              <div className={styles.greetingBoxWrapper}>
                <div className={styles.greetingBox}>Hi, There! 👋</div>
              </div>
              <div className={styles.upperBox}>
                <div className={styles.dropdownTitle}>{this.getMessage()}</div>
                <MenuItem onClick={this.handleCloseRequest} classes={{ root: styles.menuItem }}>
                  {this.getFAQorSurvey()}
                </MenuItem>
              </div>
              <div className={styles.dropdownMenuWrapper}>{this.getDirectFeedbackOrSurveyMenu()}</div>
            </div>
          </Popper>
        </div>
      </ClickAwayListener>
    );
  }

  private getFAQorSurvey = () => {
    return (
      <a
        onClick={this.trackClickMenu}
        target="_blank"
        rel="noopener nofollow noreferrer"
        className={styles.menuItemContent}
        href="https://www.notion.so/pluto/Frequently-Asked-Questions-4b4af58220aa4e00a4dabd998206325c"
      >
        FAQ
      </a>
    );
  };

  private getMessage = () => {
    return 'Any problem?\nTake a look at FAQ, or drop us a message.';
  };

  private getDirectTitle = () => {
    return 'Direct Feedback';
  };

  private getDirectFeedbackOrSurveyMenu = () => {
    const { hasSentFeedback, emailInput, feedbackContent, isLoadingFeedback } = this.state;

    if (!hasSentFeedback) {
      return (
        <div className={styles.feedbackInput}>
          <div className={styles.feedbackHeader}>{this.getDirectTitle()}</div>

          <form onSubmit={this.handleSubmitFeedbackForm} className={styles.feedbackForm}>
            <div className={styles.formStyle}>
              <label>E-Mail</label>
              <input type="email" value={emailInput} onChange={this.handleChangeEmail} />
            </div>
            <div className={styles.formStyle}>
              <label>Detail</label>
              <textarea value={feedbackContent} onChange={this.handleChangeFeedback} />
            </div>
            <div
              className={classNames({
                [styles.btnWrapper]: true,
                [styles.loadingButton]: isLoadingFeedback,
              })}
            >
              <button disabled={isLoadingFeedback}>{!isLoadingFeedback ? 'SEND' : 'Sending...'}</button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <MenuItem onClick={this.handleCloseRequest} classes={{ root: styles.borderLessMenuItem }}>
        <UserSurveyMenu handleClick={this.trackClickMenu} />
      </MenuItem>
    );
  };

  private trackClickMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const menu = e.currentTarget.innerText;

    trackEvent({
      category: 'Feedback Action',
      action: `Click Feedback Menu ${menu}`,
      label: '',
    });
  };

  private handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;

    this.setState(prevState => ({ ...prevState, emailInput: newValue }));
  };

  private handleChangeFeedback = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.currentTarget.value;

    this.setState(prevState => ({ ...prevState, feedbackContent: newValue }));
  };

  private handleSubmitFeedbackForm = async (e: React.FormEvent<HTMLFormElement>) => {
    const { currentUser } = this.props;
    const { emailInput, feedbackContent } = this.state;

    e.preventDefault();

    if (!feedbackContent || feedbackContent.length <= 5) {
      alert('You should leave more than 5 character of the feedback content');
      return;
    }

    const feedbackManger = new FeedbackManager();

    let gaId = '';
    if (typeof ga !== 'undefined') {
      ga((tracker: any) => {
        gaId = tracker.get('clientId');
      });
    }

    let href = '';
    if (typeof window !== 'undefined') {
      href = window.location.href;
    }

    try {
      this.setState(prevState => ({ ...prevState, isLoadingFeedback: true }));

      await feedbackManger.sendFeedback({
        content: feedbackContent,
        email: emailInput,
        referer: href,
        userId: currentUser.isLoggedIn ? currentUser.id.toString() : '',
        gaId,
      });

      await feedbackManger.sendTicketToFreshdesk({
        email: emailInput,
        description: feedbackContent,
        subject: 'Direct Message : ' + emailInput,
        status: 2,
        priority: 2,
        source: 1,
      });

      trackEvent({
        category: 'Feedback Action',
        action: 'Send feedback',
        label: '',
      });

      this.setState(prevState => ({
        ...prevState,
        isLoadingFeedback: false,
        emailInput: '',
        feedbackContent: '',
        hasSentFeedback: true,
      }));

      Cookies.set(FEEDBACK_ALREADY_SENT, 'true', { expires: 10 });
    } catch (err) {
      console.error(err);
      alert(err);
      this.setState(prevState => ({ ...prevState, isLoadingFeedback: false }));
    }
  };

  private toggleFeedbackDropdown = (e?: React.MouseEvent<HTMLDivElement>) => {
    const isDirectOpen = !this.state.isPopoverOpen && e;

    if (isDirectOpen) {
      trackEvent({ category: 'Feedback Action', action: 'Toggle Feedback', label: '' });
      this.setState(prevState => ({ ...prevState, isPopoverOpen: !prevState.isPopoverOpen }));
    } else {
      this.setState(prevState => ({ ...prevState, isPopoverOpen: !prevState.isPopoverOpen }));
    }
  };

  private handleCloseRequest = () => {
    const { hasSentFeedback } = this.state;

    if (hasSentFeedback) {
      this.setState(prevState => ({ ...prevState, isPopoverOpen: false, hasSentFeedback: false }));
    } else {
      this.setState(prevState => ({ ...prevState, isPopoverOpen: false, hasSentFeedback: false }));
    }
  };
}

const mapStateToProps = (state: AppState) => {
  return {
    currentUser: state.currentUser,
    layout: state.layout,
  };
};

export default withRouter(connect(mapStateToProps)(FeedbackButton));
