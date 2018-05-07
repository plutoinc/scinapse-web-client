import * as React from "react";
import { Link } from "react-router-dom";
import Popover from "material-ui/Popover/Popover";
import Menu, { MenuItem } from "material-ui/Menu";
import PaperSearchQueryFormatter from "../../../../helpers/papersQueryFormatter";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { SEARCH_SORT_OPTIONS } from "../../records";
import Icon from "../../../../icons";
const styles = require("./sortBox.scss");

interface SortBoxProps {
  query: string;
  sortOption: SEARCH_SORT_OPTIONS;
}

interface SortBoxStates {
  isOpen: boolean;
}

class SortBox extends React.PureComponent<SortBoxProps, SortBoxStates> {
  private anchorElement: HTMLDivElement;

  public constructor(props: SortBoxProps) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  public render() {
    const { sortOption, query } = this.props;
    const { isOpen } = this.state;

    return (
      <div className={styles.sortBoxWrapper}>
        <div onClick={this.handleToggleDropdown} ref={el => (this.anchorElement = el)} className={styles.currentOption}>
          <span className={styles.sortByText}>{`Sort by :  `}</span>
          <span className={styles.sortOptionText}>{this.getSortOptionToShow(sortOption)}</span>
          <Icon className={styles.downArrow} icon="ARROW_POINT_TO_DOWN" />
        </div>
        <Popover
          open={isOpen}
          anchorEl={this.anchorElement}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          targetOrigin={{ horizontal: "right", vertical: "top" }}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem className={styles.signOutButton}>
              <Link
                to={{
                  pathname: "/search",
                  search: PaperSearchQueryFormatter.stringifyPapersQuery({
                    query,
                    page: 1,
                    sort: "RELEVANCE",
                    filter: {},
                  }),
                }}
              >
                RELEVANCE
              </Link>
            </MenuItem>
            <MenuItem className={styles.signOutButton}>
              <Link
                to={{
                  pathname: "/search",
                  search: PaperSearchQueryFormatter.stringifyPapersQuery({
                    query,
                    page: 1,
                    sort: "MOST_CITATIONS",
                    filter: {},
                  }),
                }}
              >
                MOST CITATIONS
              </Link>
            </MenuItem>
            <MenuItem className={styles.signOutButton}>
              <Link
                to={{
                  pathname: "/search",
                  search: PaperSearchQueryFormatter.stringifyPapersQuery({
                    query,
                    page: 1,
                    sort: "OLDEST_FIRST",
                    filter: {},
                  }),
                }}
              >
                OLDEST
              </Link>
            </MenuItem>
            <MenuItem className={styles.signOutButton}>
              <Link
                to={{
                  pathname: "/search",
                  search: PaperSearchQueryFormatter.stringifyPapersQuery({
                    query,
                    page: 1,
                    sort: "NEWEST_FIRST",
                    filter: {},
                  }),
                }}
              >
                NEWEST
              </Link>
            </MenuItem>
          </Menu>
        </Popover>
      </div>
    );
  }

  private getSortOptionToShow = (sortOption: SEARCH_SORT_OPTIONS) => {
    switch (sortOption) {
      case "RELEVANCE": {
        return "RELEVANCE";
      }

      case "MOST_CITATIONS": {
        return "MOST CITATIONS";
      }

      case "OLDEST_FIRST": {
        return "OLDEST";
      }

      case "NEWEST_FIRST": {
        return "NEWEST";
      }
    }
  };

  private handleToggleDropdown = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  private handleRequestClose = () => {
    this.setState({
      isOpen: false,
    });
  };
}

export default withStyles<typeof SortBox>(styles)(SortBox);
