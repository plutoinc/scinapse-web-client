import * as React from 'react';
import EnvChecker from '../envChecker';
import { withStyles } from '../withStylesHelper';
import { trackEvent } from '../handleGA';
const styles = require('./errorHandler.scss');
declare var Sentry: any;

export function logException(error: Error, errorInfo?: any) {
  if (EnvChecker.isLocal()) {
    console.error('Error!', error, errorInfo);
  }

  if (EnvChecker.isProdBrowser()) {
    Sentry.withScope((scope: any) => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }
}

interface ErrorTrackerState {
  error: Error | null;
}

interface LinkButtonProps {
  style?: React.CSSProperties;
  href: string;
}
const LinkButton: React.StatelessComponent<LinkButtonProps> = props => {
  const { style, children, href } = props;

  return (
    <a
      style={style}
      href={href}
      className={styles.linkButtonWrapper}
      target="_blank"
      rel="noopener nofollow noreferrer"
    >
      {children}
    </a>
  );
};

@withStyles<typeof ErrorTracker>(styles)
export default class ErrorTracker extends React.PureComponent<{}, ErrorTrackerState> {
  public constructor(props: {}) {
    super(props);

    this.state = {
      error: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ error });
    trackEvent({
      category: 'Error Page',
      action: 'render error page',
    });
    logException(error, errorInfo);
  }

  public render() {
    if (this.state.error) {
      return (
        <div className={styles.pageWrapper}>
          <div className={styles.header}>
            <div className={styles.smallContainer}>
              <div className={styles.faceIcon}>T_T;</div>
              <div className={styles.headerContent}>
                <div>Scinapse is currently working on this issue.</div>
                <div>
                  Please help us our team by <a onClick={this.handleClickSendReport}>reporting your case</a>.
                </div>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.smallContainer}>
              <div className={styles.teamDescription}>
                <div className={styles.teamHeadline}>Our team</div>
                <div className={styles.teamDescriptionContent}>
                  <b>Pluto Inc.</b>
                  {/* tslint:disable-next-line:max-line-length */}
                  {` is the team working on Scinapse.\nWe have mission to break the barrier of scholarly communication.\n\nGive your attention and please follow us.`}
                </div>

                <LinkButton style={{ width: '100%', marginBottom: '16px' }} href="https://pluto.network">
                  <img
                    style={{ width: '70px', height: '29px' }}
                    src="https://assets.pluto.network/scinapse/error_page/pluto-logo.png"
                  />
                </LinkButton>

                <LinkButton style={{ width: '108px', marginRight: '16px' }} href="https://medium.com/pluto-network">
                  <img
                    style={{ width: '67px', height: '20px' }}
                    src="https://assets.pluto.network/scinapse/error_page/medium-logo.png"
                  />
                </LinkButton>
                <LinkButton style={{ width: '108px', marginRight: '16px' }} href="https://twitter.com/pluto_network">
                  <img
                    style={{ width: '26px', height: '22px' }}
                    src="https://assets.pluto.network/scinapse/error_page/twitter-logo.png"
                  />
                </LinkButton>
                <LinkButton style={{ width: '108px' }} href="https://www.facebook.com/PlutoNetwork/">
                  <img
                    style={{ width: '22px', height: '22px' }}
                    src="https://assets.pluto.network/scinapse/error_page/facebook-logo.png"
                  />
                </LinkButton>
              </div>
              <div className={styles.videoWrapper}>
                <iframe
                  id="ytplayer"
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/t5R94Ah2Wgg?rel=0"
                  frameBorder="0"
                  allowFullScreen={true}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }

  private handleClickSendReport = () => {
    Sentry.showReportDialog();
    trackEvent({
      category: 'Error Page',
      action: 'click report dialog',
    });
  };
}
