import * as React from "react";
import { CurrentUser } from "../../model/currentUser";
import { withStyles } from "../../helpers/withStylesHelper";
import ProfileLeftBox from "../profileLeftBox/index";
const styles = require("./profileWithoutData.scss");

interface ProfileWithoutDataProps {
  currentUser: CurrentUser;
}

@withStyles<typeof ProfileWithoutData>(styles)
class ProfileWithoutData extends React.PureComponent<ProfileWithoutDataProps, {}> {
  public render() {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.leftBox}>
          <ProfileLeftBox />
        </div>
        <div className={styles.rightBox}>Hello Profile</div>
      </div>
    );
  }
}

export default ProfileWithoutData;
