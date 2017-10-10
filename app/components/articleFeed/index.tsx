import * as React from "react";
import { List } from "immutable";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { IArticleFeedStateRecord, FEED_SORTING_OPTIONS, FEED_CATEGORIES } from "./records";
import { IAppState } from "../../reducers";
import FeedNavbar from "./components/feedNavbar";
import { changeSortingOption, openCategoryPopover, closeCategoryPopover, changeCategory } from "./actions";
import { RECORD } from "../../__mocks__";
import FeedItem from "./components/feedItem";
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

// TODO: Remove below section

/* ** START MAKING MOCK ARTICLES FEED ** */
let fakeId = 0;

const mockFeedData = List([
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
  RECORD.ARTICLE.set("id", (fakeId += 1)),
]);
/* ** END MAKING MOCK ARTICLES FEED ** */

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

  private mapArticleNode = () => {
    return mockFeedData.map(article => {
      return <FeedItem key={`article_${article.id}`} article={article} />;
    });
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
        <div className={styles.contentContainer}>
          <div className={styles.feedContentWrapper}>
            <div>{this.mapArticleNode()}</div>
          </div>
          <div className={styles.feedSideWrapper}>
            <div className={styles.submitBoxWrapper}>
              <div className={styles.submitBoxTitle}>Share your article</div>
              <div className={styles.submitBoxSubtitle}>Share worthy academic contents then get a reputation</div>
              <Link to="/articles/new" className={styles.articleSubmitLinkButton}>
                Go to Submit
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps)(ArticleFeed);
