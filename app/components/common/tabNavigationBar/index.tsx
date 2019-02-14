import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
const styles = require("./tabNavigationBar.scss");

interface TabLinkParams {
  pathname: string;
  search: string;
}

export interface TabItem {
  tabName: string | JSX.Element;
  tabLink: TabLinkParams;
}

interface TabNavigationBarProps {
  tabItemsData: TabItem[];
}

const TabNavigationBar: React.SFC<TabNavigationBarProps> = props => {
  const tabItemsData = props.tabItemsData;
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
};

export default withStyles<typeof TabNavigationBar>(styles)(TabNavigationBar);
