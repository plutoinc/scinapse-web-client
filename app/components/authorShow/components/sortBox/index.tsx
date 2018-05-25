import * as React from "react";
import Popover from "material-ui/Popover/Popover";
import Menu, { MenuItem } from "material-ui/Menu";
import { withStyles } from "../../../../helpers/withStylesHelper";
import Icon from "../../../../icons";
import { AUTHOR_PAPERS_SORT_TYPES } from "../../../../api/author/types";
const styles = require("./sortBox.scss");

interface AuthorPapersSortBoxProps {
  sortOption: AUTHOR_PAPERS_SORT_TYPES;
  handleClickSortOption: (option: AUTHOR_PAPERS_SORT_TYPES) => void;
}

interface AuthorPapersSortBoxStates {
  isOpen: boolean;
}

class AuthorPapersSortBox extends React.PureComponent<AuthorPapersSortBoxProps, AuthorPapersSortBoxStates> {
  private anchorElement: HTMLDivElement;

  public constructor(props: AuthorPapersSortBoxProps) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  public render() {
    const { sortOption, handleClickSortOption } = this.props;
    const { isOpen } = this.state;

    const menuItemStyle: React.CSSProperties = {
      minHeight: "30px",
      lineHeight: "30px",
      fontSize: "13px",
    };

    return (
      <div className={styles.sortBoxWrapper}>
        <div
          onClick={this.handleToggleDropdown}
          ref={el => (this.anchorElement = el as HTMLDivElement)}
          className={styles.currentOption}
        >
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
            <MenuItem style={menuItemStyle} className={styles.menuItem}>
              <div
                onClick={() => {
                  handleClickSortOption("MOST_CITATIONS");
                  this.handleRequestClose();
                }}
              >
                Most Citations
              </div>
            </MenuItem>
            <MenuItem style={menuItemStyle} className={styles.menuItem}>
              <div
                onClick={() => {
                  handleClickSortOption("OLDEST_FIRST");
                  this.handleRequestClose();
                }}
              >
                Oldest
              </div>
            </MenuItem>
            <MenuItem style={menuItemStyle} className={styles.menuItem}>
              <div
                onClick={() => {
                  handleClickSortOption("NEWEST_FIRST");
                  this.handleRequestClose();
                }}
              >
                Newest
              </div>
            </MenuItem>
          </Menu>
        </Popover>
      </div>
    );
  }

  private getSortOptionToShow = (sortOption: AUTHOR_PAPERS_SORT_TYPES) => {
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

export default withStyles<typeof AuthorPapersSortBox>(styles)(AuthorPapersSortBox);
