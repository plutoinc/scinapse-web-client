import * as React from "react";
import { Link } from "react-router-dom";
import Popover from "@material-ui/core/Popover/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import PaperSearchQueryFormatter from "../../../../helpers/papersQueryFormatter";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { SEARCH_SORT_OPTIONS } from "../../records";
import Icon from "../../../../icons";
import ActionTicketManager from "../../../../helpers/actionTicketManager";
const styles = require("./sortBox.scss");

interface SortBoxProps {
  query: string;
  sortOption: SEARCH_SORT_OPTIONS;
}

interface SortBoxStates {
  isOpen: boolean;
}

class SortBox extends React.PureComponent<SortBoxProps, SortBoxStates> {
  private anchorElement: HTMLDivElement | null;

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
      <div className={styles.articleSortBoxWrapper}>
        <div onClick={this.handleToggleDropdown} ref={el => (this.anchorElement = el)} className={styles.currentOption}>
          <span className={styles.sortByText}>{`Sort by :  `}</span>
          <span className={styles.sortOptionText}>{this.getSortOptionToShow(sortOption)}</span>
          <Icon className={styles.downArrow} icon="ARROW_POINT_TO_UP" />
        </div>
        <Popover
          open={isOpen}
          anchorEl={this.anchorElement!}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          onClose={this.handleRequestClose}
        >
          <MenuItem classes={{ root: styles.menuItem }}>
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
              onClick={() => {
                this.handleActionTicketFireInSorting("RELEVANCE");
              }}
            >
              Relevance
            </Link>
          </MenuItem>
          <MenuItem classes={{ root: styles.menuItem }}>
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
              onClick={() => {
                this.handleActionTicketFireInSorting("MOST_CITATIONS");
              }}
            >
              Most Citations
            </Link>
          </MenuItem>
          <MenuItem classes={{ root: styles.menuItem }}>
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
              onClick={() => {
                this.handleActionTicketFireInSorting("OLDEST_FIRST");
              }}
            >
              Oldest
            </Link>
          </MenuItem>
          <MenuItem classes={{ root: styles.menuItem }}>
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
              onClick={() => {
                this.handleActionTicketFireInSorting("NEWEST_FIRST");
              }}
            >
              Newest
            </Link>
          </MenuItem>
        </Popover>
      </div>
    );
  }

  private handleActionTicketFireInSorting = (sortOption: SEARCH_SORT_OPTIONS) => {
    ActionTicketManager.trackTicket({
      pageType: "searchResult",
      actionType: "fire",
      actionArea: "sortBox",
      actionTag: "paperSorting",
      actionLabel: sortOption,
    });
  };

  private getSortOptionToShow = (sortOption: SEARCH_SORT_OPTIONS) => {
    // tslint:disable-next-line:switch-default
    switch (sortOption) {
      case "RELEVANCE": {
        return "Relevance";
      }

      case "MOST_CITATIONS": {
        return "Most Citations";
      }

      case "OLDEST_FIRST": {
        return "Oldest";
      }

      case "NEWEST_FIRST": {
        return "Newest";
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
