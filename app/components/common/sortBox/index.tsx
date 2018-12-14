import * as React from "react";
import Popover from "@material-ui/core/Popover/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./sortBox.scss");

export type PAPER_LIST_SORT_TYPES = "MOST_CITATIONS" | "NEWEST_FIRST" | "OLDEST_FIRST" | "RELEVANCE";
export type AUTHOR_PAPER_LIST_SORT_TYPES = PAPER_LIST_SORT_TYPES | "RECENTLY_ADDED";

interface SortBoxProps {
  sortOption: AUTHOR_PAPER_LIST_SORT_TYPES;
  handleClickSortOption: (option: AUTHOR_PAPER_LIST_SORT_TYPES) => void;
  exposeRelevanceOption?: boolean;
  exposeRecentlyUpdated?: boolean;
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
    const { sortOption, handleClickSortOption, exposeRecentlyUpdated } = this.props;
    const { isOpen } = this.state;

    return (
      <div className={styles.sortBoxWrapper}>
        <div
          onClick={this.handleToggleDropdown}
          ref={el => (this.anchorElement = el as HTMLDivElement)}
          className={styles.currentOption}
        >
          <span className={styles.sortOptionText}>{this.getSortOptionToShow(sortOption)}</span>
          <Icon className={styles.downArrow} icon="ARROW_POINT_TO_UP" />
        </div>
        <Popover
          open={isOpen}
          anchorEl={this.anchorElement}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          onClose={this.handleRequestClose}
        >
          {exposeRecentlyUpdated && (
            <MenuItem classes={{ root: styles.menuItem }}>
              <div
                onClick={() => {
                  handleClickSortOption("RECENTLY_ADDED");
                  this.handleRequestClose();
                }}
              >
                Recently Added
              </div>
            </MenuItem>
          )}
          <MenuItem classes={{ root: styles.menuItem }}>
            <div
              onClick={() => {
                handleClickSortOption("MOST_CITATIONS");
                this.handleRequestClose();
              }}
            >
              Most Citations
            </div>
          </MenuItem>
          <MenuItem classes={{ root: styles.menuItem }}>
            <div
              onClick={() => {
                handleClickSortOption("OLDEST_FIRST");
                this.handleRequestClose();
              }}
            >
              Oldest
            </div>
          </MenuItem>
          <MenuItem classes={{ root: styles.menuItem }}>
            <div
              onClick={() => {
                handleClickSortOption("NEWEST_FIRST");
                this.handleRequestClose();
              }}
            >
              Newest
            </div>
          </MenuItem>
          {this.getRelevanceOption()}
        </Popover>
      </div>
    );
  }

  private getRelevanceOption = () => {
    const { exposeRelevanceOption, handleClickSortOption } = this.props;

    if (exposeRelevanceOption) {
      return (
        <MenuItem classes={{ root: styles.menuItem }}>
          <div
            onClick={() => {
              handleClickSortOption("RELEVANCE");
              this.handleRequestClose();
            }}
          >
            Relevance
          </div>
        </MenuItem>
      );
    }
    return null;
  };

  private getSortOptionToShow = (sortOption: AUTHOR_PAPER_LIST_SORT_TYPES) => {
    // tslint:disable-next-line:switch-default
    switch (sortOption) {
      case "MOST_CITATIONS": {
        return "Most Citations";
      }

      case "OLDEST_FIRST": {
        return "Oldest";
      }

      case "NEWEST_FIRST": {
        return "Newest";
      }

      case "RELEVANCE": {
        return "Most Relevance";
      }

      case "RECENTLY_ADDED": {
        return "Recently Added";
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
