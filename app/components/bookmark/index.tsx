import { List } from "immutable";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { withRouter, RouteProps, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import { isToday, format } from "date-fns";
import { AppState } from "../../reducers";
import Pagination from "../common/commonPagination";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../model/currentUser";
import EnvChecker from "../../helpers/envChecker";
import SearchItem from "../articleSearch/components/searchItem";
import CitationDialog from "../common/citationDialog";
import { getBookmarks } from "../layouts/actions";
import {
  clearBookmarkPageState,
  setActiveCitationDialogPaperId,
  toggleCitationDialog,
  handleClickCitationTab,
  getCitationText,
} from "./actions";
import { BookmarkPageStateRecord } from "./records";
import { BookmarkRecord } from "../../model/bookmark";
import { PaperRecord, PaperList } from "../../model/paper";
import { postBookmark, removeBookmark } from "../../actions/bookmark";
import { AvailableCitationType } from "../paperShow/records";
import { openSignUp } from "../dialog/actions";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import MemberAPI, { CheckBookmarkedResponseList, CheckBookmarkedResponse } from "../../api/member";
import alertToast from "../../helpers/makePlutoToastAction";
const styles = require("./bookmark.scss");

const DEFAULT_BOOKMARKS_FETCHING_COUNT = 10;

function mapStateToProps(state: AppState) {
  return {
    routing: state.routing,
    currentUser: state.currentUser,
    bookmarks: state.bookmarks,
    bookmarkPage: state.bookmarkPage,
  };
}

export interface BookmarkPageMappedState {
  currentUser: CurrentUserRecord;
  routing: RouteProps;
  bookmarks: BookmarkRecord;
  bookmarkPage: BookmarkPageStateRecord;
}

export interface BookmarkPageProps
  extends DispatchProp<BookmarkPageMappedState>,
    RouteComponentProps<{ paperId: string }> {
  routing: RouteProps;
  currentUser: CurrentUserRecord;
  bookmarks: BookmarkRecord;
  bookmarkPage: BookmarkPageStateRecord;
}

interface BookmarkPageStates {
  bookmarkedStatusList: CheckBookmarkedResponseList;
}

@withStyles<typeof Bookmark>(styles)
class Bookmark extends React.PureComponent<BookmarkPageProps, BookmarkPageStates> {
  public constructor(props: BookmarkPageProps) {
    super(props);

    this.state = { bookmarkedStatusList: List() };
  }

  public async componentDidMount() {
    const { dispatch, currentUser } = this.props;

    if (currentUser.isLoggedIn) {
      this.fetchBookmark();
    } else {
      dispatch(openSignUp());
    }
  }

  public componentWillReceiveProps(nextProps: BookmarkPageProps) {
    const { dispatch, currentUser } = nextProps;

    if (!currentUser.isLoggedIn) {
      dispatch(openSignUp());
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(clearBookmarkPageState());
  }

  public render() {
    const { currentUser } = this.props;

    if (EnvChecker.isServer()) {
      return this.getHelmetNode();
    }

    if (!currentUser.isLoggedIn) {
      return null;
    }

    return (
      <div className={styles.container}>
        {this.getHelmetNode()}
        <div className={styles.titleWrapper}>Bookmarked Papers</div>
        {this.mapPaperNode()}
        {this.getPaginationNode()}
        {this.getCitationDialog()}
      </div>
    );
  }

  private getHelmetNode = () => {
    return (
      <Helmet>
        <title>Bookmark | Sci-napse | Academic search engine for paper</title>
      </Helmet>
    );
  };

  private getPaginationNode = () => {
    const { bookmarkPage } = this.props;

    return (
      <div className={styles.paginationBox}>
        <Pagination
          type="BOOKMARK_PAGINATION"
          currentPageIndex={bookmarkPage.currentPage - 1}
          totalPage={bookmarkPage.totalPageCount}
          onItemClick={this.fetchBookmark}
        />
      </div>
    );
  };

  private fetchBookmark = async (pageIndex = 0) => {
    const { dispatch } = this.props;

    const bookmarkDataList = await dispatch(
      getBookmarks({ page: pageIndex + 1, size: DEFAULT_BOOKMARKS_FETCHING_COUNT }),
    );
    const bookmarkedPaperList: PaperList = bookmarkDataList.map(bookmarkData => bookmarkData.paper).toList();
    const bookmarkStatusList = await MemberAPI.checkBookmarkedList(bookmarkedPaperList);

    this.setState({
      bookmarkedStatusList: bookmarkStatusList,
    });
  };

  private setActiveCitationDialog = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(setActiveCitationDialogPaperId(paperId));
  };

  private toggleCitationDialog = () => {
    const { dispatch } = this.props;

    dispatch(toggleCitationDialog());
  };

  private handlePostBookmark = async (targetPaper: PaperRecord) => {
    const { dispatch, currentUser } = this.props;

    checkAuthDialog();

    if (currentUser.isLoggedIn) {
      const targetKey = this.state.bookmarkedStatusList.findKey(status => status.paperId === targetPaper.id);
      const newStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: true };

      this.setState({
        bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, newStatus),
      });

      try {
        await dispatch(postBookmark(targetPaper));
      } catch (err) {
        alertToast({
          type: "error",
          message: "Sorry. Failed to make bookmark.",
        });
        const oldStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: false };
        this.setState({
          bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, oldStatus),
        });
      }
    }
  };

  private handleRemoveBookmark = async (targetPaper: PaperRecord) => {
    const { dispatch, currentUser } = this.props;

    checkAuthDialog();

    if (currentUser.isLoggedIn) {
      const targetKey = this.state.bookmarkedStatusList.findKey(status => status.paperId === targetPaper.id);
      const newStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: false };

      this.setState({
        bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, newStatus),
      });

      try {
        await dispatch(removeBookmark(targetPaper));
      } catch (err) {
        alertToast({
          type: "error",
          message: "Sorry. Failed to remove bookmark.",
        });
        const oldStatus: CheckBookmarkedResponse = { paperId: targetPaper.id, bookmarked: true };
        this.setState({
          bookmarkedStatusList: this.state.bookmarkedStatusList.set(targetKey, oldStatus),
        });
      }
    }
  };

  private handleClickCitationTab = (tab: AvailableCitationType, paperId: number) => {
    const { dispatch } = this.props;

    dispatch(handleClickCitationTab(tab));
    dispatch(getCitationText({ type: tab, paperId }));
  };

  private getCitationDialog = () => {
    const { bookmarkPage } = this.props;

    return (
      <CitationDialog
        paperId={bookmarkPage.activeCitationDialogPaperId}
        isOpen={bookmarkPage.isCitationDialogOpen}
        toggleCitationDialog={this.toggleCitationDialog}
        handleClickCitationTab={this.handleClickCitationTab}
        activeTab={bookmarkPage.activeCitationTab}
        isLoading={bookmarkPage.isFetchingCitationInformation}
        citationText={bookmarkPage.citationText}
      />
    );
  };

  private mapPaperNode = () => {
    const { currentUser, bookmarks, bookmarkPage } = this.props;

    if (
      !bookmarks.bookmarkData ||
      (bookmarks.bookmarkData.isEmpty() && !bookmarkPage.bookmarkItemMetaList) ||
      bookmarkPage.bookmarkItemMetaList.isEmpty()
    ) {
      return null;
    }

    const searchItems = bookmarks.bookmarkData.map(bookmarkDatum => {
      const paper = bookmarkDatum.paper;
      const bookmarkedDate = isToday(bookmarkDatum.createdAt)
        ? "TODAY"
        : format(bookmarkDatum.createdAt, "MMM/DD/YYYY");

      const bookmarkStatus = this.state.bookmarkedStatusList.find(status => status.paperId === paper.id);

      return (
        <div key={`paper_${paper.id}`}>
          <div className={styles.dateBox}>{bookmarkedDate}</div>
          <SearchItem
            paper={paper}
            isBookmarked={bookmarkStatus ? bookmarkStatus.bookmarked : false}
            setActiveCitationDialog={this.setActiveCitationDialog}
            toggleCitationDialog={this.toggleCitationDialog}
            handlePostBookmark={this.handlePostBookmark}
            handleRemoveBookmark={this.handleRemoveBookmark}
            searchQueryText=""
            withComments={false}
            currentUser={currentUser}
          />
        </div>
      );
    });

    return <div className={styles.searchItems}>{searchItems}</div>;
  };
}

export default connect(mapStateToProps)(withRouter(Bookmark));
