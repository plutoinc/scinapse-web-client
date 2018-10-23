import * as React from "react";
import { Link } from "react-router-dom";
import * as H from "history";
import { withStyles } from "../../helpers/withStylesHelper";
import * as classNames from "classnames";
import { Profile } from "../../model/profile";
const styles = require("./profileNav.scss");

interface ProfileNavProps {
  location: H.Location;
  profile: Profile | null;
}

@withStyles<typeof ProfileNav>(styles)
class ProfileNav extends React.PureComponent<ProfileNavProps, {}> {
  public render() {
    const { location, profile } = this.props;

    return (
      <ul className={styles.navWrapper}>
        <Link to={profile ? `/profiles/${profile.id}` : "/profiles/new"}>
          <li
            className={classNames({
              [`${styles.tabItem}`]: true,
              [`${styles.activeTabItem}`]: !location.pathname.endsWith("/publications"),
            })}
          >
            OVERVIEW
          </li>
        </Link>
        <Link to={profile ? `/profiles/${profile.id}/publications` : "/profiles/new"}>
          <li
            className={classNames({
              [`${styles.tabItem}`]: true,
              [`${styles.activeTabItem}`]: location.pathname.endsWith("/publications"),
            })}
          >
            ALL PUBLICATIONS
          </li>
        </Link>
      </ul>
    );
  }
}

export default ProfileNav;
