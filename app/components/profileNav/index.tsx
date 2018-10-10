import * as React from "react";
import * as H from "history";
import { withStyles } from "../../helpers/withStylesHelper";
import * as classNames from "classnames";
const styles = require("./profileNav.scss");

interface ProfileNavProps {
  location: H.Location;
}

@withStyles<typeof ProfileNav>(styles)
class ProfileNav extends React.PureComponent<ProfileNavProps, {}> {
  public render() {
    const { location } = this.props;

    return (
      <ul className={styles.navWrapper}>
        <li
          className={classNames({
            [`${styles.tabItem}`]: true,
            [`${styles.activeTabItem}`]: !location.pathname.endsWith("/list"),
          })}
        >
          OVERVIEW
        </li>
        <li
          className={classNames({
            [`${styles.tabItem}`]: true,
          })}
        >
          ALL PUBLICATIONS
        </li>
      </ul>
    );
  }
}

export default ProfileNav;
