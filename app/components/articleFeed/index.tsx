import * as React from "react";
import axios, { CancelTokenSource } from "axios";
import { Link } from "react-router-dom";
import InfiniteScroll = require("react-infinite-scroller");
import { connect, DispatchProp } from "react-redux";
import { IArticleFeedStateRecord, FEED_SORTING_OPTIONS, FEED_CATEGORIES } from "./records";
import { IAppState } from "../../reducers";
import FeedNavbar from "./components/feedNavbar";
import { changeSortingOption, openCategoryPopover, closeCategoryPopover, changeCategory, getArticles } from "./actions";
import FeedItem from "./components/feedItem";
import selectArticles from "./select";
import { IArticlesRecord } from "../../model/article";
const styles = require("./articleFeed.scss");

const FETCH_COUNT_OF_FEED_ITEMS = 10;

export interface IArticleFeedContainerProps extends DispatchProp<IArticleContainerMappedState> {
  feedState: IArticleFeedStateRecord;
  feed: IArticlesRecord;
}

interface IArticleContainerMappedState {
  articleFeedState: IArticleFeedStateRecord;
  feed: IArticlesRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    feedState: state.articleFeed,
    feed: selectArticles(state.articles, state.articleFeed.feedItemsToShow),
  };
}

class ArticleFeed extends React.PureComponent<IArticleFeedContainerProps, null> {
  private cancelTokenSource: CancelTokenSource;

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

  private mapArticleNode = (feed: IArticlesRecord, feedState: IArticleFeedStateRecord) => {
    const feedItems = feed.map(article => {
      return <FeedItem key={`article_${article.id}`} article={article} />;
    });

    return (
      <InfiniteScroll
        pageStart={0}
        threshold={400}
        loadMore={this.fetchFeedItems}
        hasMore={!feedState.isEnd}
        loader={<div className="loader">Loading ...</div>}
        initialLoad={false}
      >
        {feedItems}
      </InfiniteScroll>
    );
  };

  private fetchFeedItems = async () => {
    const { dispatch, feedState } = this.props;

    if (!feedState.isLoading) {
      await dispatch(
        getArticles({
          size: FETCH_COUNT_OF_FEED_ITEMS,
          page: feedState.page,
          cancelTokenSource: this.cancelTokenSource,
        }),
      );
    }
  };

  public componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.cancelTokenSource = CancelToken.source();

    this.fetchFeedItems();
  }

  public componentWillUnmount() {
    this.cancelTokenSource.cancel("Request Canceled");
  }

  public render() {
    const { feed, feedState } = this.props;

    if (feed.isEmpty()) {
      return null;
    }

    return (
      <div className={styles.feedContainer}>
        <FeedNavbar
          currentSortingOption={feedState.sortingOption}
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
            <div>{this.mapArticleNode(feed, feedState)}</div>
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
