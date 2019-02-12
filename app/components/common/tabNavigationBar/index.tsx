import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
const styles = require("./tabNavigationBar.scss");

export interface TabItem {
  tabName: string;
  tabLink: Location;
}

interface TabNavigationBarProps {
  tabItemsData: TabItem[];
}

class TabNavigationBar extends React.PureComponent<TabNavigationBarProps> {
  constructor(props: TabNavigationBarProps) {
    super(props);
  }

  public render() {
    const { tabItemsData } = this.props;
    const currentPage = location.pathname;

    const transformTabItemDataToHtml = tabItemsData.map((item, index) => {
      return (
        <Link
          className={classNames({
            [styles.nonActiveTabItem]: true,
            [styles.activeTabItem]: currentPage === item.tabLink.pathname,
          })}
          to={item.tabLink}
          key={index}
        >
          {item.tabName}
        </Link>
      );
    });

    return <div className={styles.tabItemWrapper}>{transformTabItemDataToHtml}</div>;
  }
}

export default withStyles<typeof TabNavigationBar>(styles)(TabNavigationBar);
