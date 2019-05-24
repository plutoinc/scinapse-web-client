import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { getUserGroupName } from "../../helpers/abTestHelper";
import { LOCKED_BUTTONS_TEST } from "../../constants/abTestGlobalValue";
import { AppState } from "../../reducers";
import { getMemoizedCurrentUser } from "../../selectors/getCurrentUser";
import { connect } from "react-redux";
import { CurrentUser } from "../../model/currentUser";
const styles = require("./lockedLabel.scss");

const LockedLabel: React.FC<{ currentUser: CurrentUser }> = ({ currentUser }) => {
  const isShowLockedLabel = getUserGroupName(LOCKED_BUTTONS_TEST) === "locked";

  if (!isShowLockedLabel || currentUser.isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.lockedLabelContainer}>
      <Icon icon="LOCK" className={styles.lockedIcon} />
      Locked
    </div>
  );
};

function makeMapStateToProps() {
  return (state: AppState) => {
    return {
      currentUser: getMemoizedCurrentUser(state),
    };
  };
}

export default connect(makeMapStateToProps)(withStyles<typeof styles>(styles)(LockedLabel));
