import * as React from "react";
import { CurrentUser } from "../../model/currentUser";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseButton from "../common/scinapseButton";
const styles = require("./profileSelectPaperList.scss");

interface ProfileSelectPaperListProps {
  currentUser: CurrentUser;
}

@withStyles<typeof ProfileSelectPaperList>(styles)
class ProfileSelectPaperList extends React.PureComponent<ProfileSelectPaperListProps> {
  public render() {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.header}>
          <div className={styles.description}>
            Please check all the authors you think you are. The papers will be displayed on your profile.
          </div>
          <ScinapseButton gaCategory="Profile Action" buttonText="CONFIRM" onClick={this.handleClickConfirmBtn} />
        </div>
        <div className={styles.searchWrapper}>
          <input placeholder="Search papers" />
        </div>
      </div>
    );
  }

  private handleClickConfirmBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
}

export default ProfileSelectPaperList;
