import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { CurrentUser } from "../../model/currentUser";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import ProfileWithoutData from "../../components/profileWithoutData";
import ProfileLeftBox from "../../components/profileLeftBox";
import ProfileNav from "../../components/profileNav";
import ProfileMeta from "../../components/profileMeta";
const styles = require("./newProfile.scss");

interface ProfileContainerProps extends RouteComponentProps<null> {
  currentUser: CurrentUser;
}

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
  };
}

@withStyles<typeof ProfileContainer>(styles)
class ProfileContainer extends React.PureComponent<ProfileContainerProps> {
  public render() {
    const { location, currentUser } = this.props;

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.leftBox}>
            <ProfileLeftBox member={currentUser} />
          </div>
          <div className={styles.rightBox}>
            <ProfileNav location={location} />
            {/* <ProfileWithoutData currentUser={currentUser} /> */}
            <ProfileMeta />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(ProfileContainer));
