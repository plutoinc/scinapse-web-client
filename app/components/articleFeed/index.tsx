import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IArticleFeedStateRecord, FEED_SORTING_OPTIONS, FEED_CATEGORIES } from "./records";
import { IAppState } from "../../reducers";
import FeedNavbar from "./components/feedNavbar";
import { changeSortingOption, openCategoryPopover, closeCategoryPopover, changeCategory } from "./actions";
const styles = require("./articleFeed.scss");

export interface IArticleFeedContainerProps extends DispatchProp<IArticleContainerMappedState> {
  feedState: IArticleFeedStateRecord;
}

interface IArticleContainerMappedState {
  articleFeedState: IArticleFeedStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    feedState: state.articleFeed,
  };
}

class ArticleFeed extends React.PureComponent<IArticleFeedContainerProps, null> {
  private handleChangeCategory = (category: FEED_CATEGORIES) => {
    const { dispatch } = this.props;

    dispatch(changeCategory(category));
  };

  private handleOpenCategoryPopover = (element: React.ReactInstance) => {
    const { dispatch } = this.props;

    dispatch(openCategoryPopover(element));
  };

  private handleCloseCategoryPopover = () => {
    const { dispatch } = this.props;

    dispatch(closeCategoryPopover());
  };

  private handleClickSortingOption = (sortingOption: FEED_SORTING_OPTIONS) => {
    const { dispatch } = this.props;

    dispatch(changeSortingOption(sortingOption));
  };

  public render() {
    const { feedState } = this.props;

    return (
      <div className={styles.feedContainer}>
        <FeedNavbar
          currentSotringOption={feedState.sortingOption}
          currentCategory={feedState.category}
          categoryPopoverAnchorElement={feedState.categoryPopoverAnchorElement}
          isCategoryPopOverOpen={feedState.isCategoryPopOverOpen}
          handleClickSortingOption={this.handleClickSortingOption}
          handleOpenCategoryPopover={this.handleOpenCategoryPopover}
          handleCloseCategoryPopover={this.handleCloseCategoryPopover}
          handleChangeCategory={this.handleChangeCategory}
        />
        <div className={styles.feedContentWrapper}>
          <div>Feed items</div>
          <div>Feed right items</div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps)(ArticleFeed);
