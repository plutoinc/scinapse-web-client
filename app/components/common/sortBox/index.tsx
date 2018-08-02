import * as React from "react";
import Popover from "@material-ui/core/Popover/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./sortBox.scss");

export type PAPER_LIST_SORT_TYPES = "MOST_CITATIONS" | "NEWEST_FIRST" | "OLDEST_FIRST";

interface SortBoxProps {
  sortOption: PAPER_LIST_SORT_TYPES;
  handleClickSortOption: (option: PAPER_LIST_SORT_TYPES) => void;
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
    const { sortOption, handleClickSortOption } = this.props;
    const { isOpen } = this.state;

    return (
      <div className={styles.sortBoxWrapper}>
        <div
          onClick={this.handleToggleDropdown}
          ref={el => (this.anchorElement = el as HTMLDivElement)}
          className={styles.currentOption}
        >
          <span className={styles.sortOptionText}>{this.getSortOptionToShow(sortOption)}</span>
          <Icon className={styles.downArrow} icon="ARROW_POINT_TO_DOWN" />
        </div>
        <Popover
          open={isOpen}
          anchorEl={this.anchorElement}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          onClose={this.handleRequestClose}
        >
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
        </Popover>
      </div>
    );
  }

  private getSortOptionToShow = (sortOption: PAPER_LIST_SORT_TYPES) => {
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
