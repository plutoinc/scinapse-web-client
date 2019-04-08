import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import * as classNames from "classnames";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
const styles = require("./tabNavigationBar.scss");

interface TabLinkParams {
  pathname: string;
  search: string;
}

export interface TabItem {
  tabName: string | JSX.Element;
  tabLink: TabLinkParams;
}

interface TabNavigationBarProps extends RouteComponentProps<null> {
  searchKeyword: string;
}

function getTabNavigationItems(searchKeyword: string): TabItem[] {
  const tabNavigationItems = [
    {
      tabName: "All",
      tabLink: {
        pathname: "/search",
        search: PapersQueryFormatter.stringifyPapersQuery({
          query: searchKeyword,
          sort: "RELEVANCE",
          filter: {},
          page: 1,
        }),
      },
    },
    {
      tabName: "Authors",
      tabLink: {
        pathname: "/search/authors",
        search: PapersQueryFormatter.stringifyPapersQuery({
          query: searchKeyword,
          sort: "RELEVANCE",
          filter: {},
          page: 1,
        }),
      },
    },
  ];
  return tabNavigationItems;
}

const TabNavigationBar: React.SFC<TabNavigationBarProps> = props => {
  const tabItemsData: TabItem[] = getTabNavigationItems(props.searchKeyword);
  const currentPage = props.location.pathname;

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

  return (
    <div className={styles.tabItemWrapper}>
      <div className={styles.tabItemContainer}>{transformTabItemDataToHtml}</div>
    </div>
  );
};

export default withRouter(withStyles<typeof TabNavigationBar>(styles)(TabNavigationBar));
