import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { CurrentUser } from "../../model/currentUser";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import ProfileWithoutData from "../../components/profileWithoutData";
import ProfileLeftBox from "../../components/profileLeftBox";
import ProfileNav from "../../components/profileNav";
import ProfileSelectPaperList from "../../components/profileSelectPaperList/index";
const styles = require("./newProfile.scss");

interface ProfileContainerProps extends RouteComponentProps<null> {
  currentUser: CurrentUser;
}

interface ProfileContainerStates
  extends Readonly<{
      step: number;
    }> {}

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
  };
}

@withStyles<typeof ProfileContainer>(styles)
class ProfileContainer extends React.PureComponent<ProfileContainerProps, ProfileContainerStates> {
  public constructor(props: ProfileContainerProps) {
    super(props);

    this.state = {
      step: 0,
    };
  }

  public render() {
    const { currentUser } = this.props;

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.leftBox}>
            <ProfileLeftBox member={currentUser} />
          </div>
          <div className={styles.rightBox}>{this.getRightBoxContent()}</div>
        </div>
      </div>
    );
  }

  private getRightBoxContent = () => {
    const { location, currentUser } = this.props;
    const { step } = this.state;

    if (step === 1) {
      return <ProfileSelectPaperList currentUser={currentUser} />;
    }

    return (
      <div>
        <ProfileNav location={location} />
        <ProfileWithoutData handleClickCreateProfile={this.handleClickCreateProfile} currentUser={currentUser} />
      </div>
    );
  };

  private handleClickCreateProfile = () => {
    this.setState(prevState => ({ ...prevState, step: 1 }));
  };
}

export default withRouter(connect(mapStateToProps)(ProfileContainer));
