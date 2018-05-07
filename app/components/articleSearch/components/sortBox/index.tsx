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
          <span>{`Sort by :  `}</span>
          <span>{sortOption}</span>
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
                MOST_CITATIONS
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
                OLDEST_FIRST
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
                NEWEST_FIRST
              </Link>
            </MenuItem>
          </Menu>
        </Popover>
      </div>
    );
  }

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
