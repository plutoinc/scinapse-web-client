import * as React from "react";
import axios from "axios";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import * as distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import * as parse from "date-fns/parse";
import { denormalize } from "normalizr";
import { Helmet } from "react-helmet";
import { AppState } from "../../reducers";
import CollectionPaperItem from "./collectionPaperItem";
import ArticleSpinner from "../common/spinner/articleSpinner";
import MobilePagination from "../common/mobilePagination";
import DesktopPagination from "../common/desktopPagination";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
import { CollectionShowState } from "./reducer";
import { collectionSchema, Collection } from "../../model/collection";
import { fetchCollectionShowData } from "./sideEffect";
import { Configuration } from "../../reducers/configuration";
import { PaperInCollection, paperInCollectionSchema } from "../../model/paperInCollection";
import Footer from "../layouts/footer";
import Icon from "../../icons";
import GlobalDialogManager from "../../helpers/globalDialogManager";
import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from "../common/sortBox";
import { getPapers } from "./actions";
import { LayoutState, UserDevice } from "../layouts/records";
import ScinapseInput from "../common/scinapseInput";
import formatNumber from "../../helpers/formatNumber";
import restoreScroll from "../../helpers/scrollRestoration";
import ErrorPage from "../error/errorPage";
const styles = require("./collectionShow.scss");

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    currentUser: state.currentUser,
    collectionShow: state.collectionShow,
    configuration: state.configuration,
    collection: denormalize(state.collectionShow.mainCollectionId, collectionSchema, state.entities),
    papersInCollection: denormalize(state.collectionShow.paperIds, [paperInCollectionSchema], state.entities),
  };
}

export interface CollectionShowMatchParams {
  collectionId: string;
}

export interface CollectionShowProps
  extends RouteComponentProps<CollectionShowMatchParams>,
    Readonly<{
      layout: LayoutState;
      currentUser: CurrentUser;
      configuration: Configuration;
      collectionShow: CollectionShowState;
      collection: Collection | undefined;
      papersInCollection: PaperInCollection[] | undefined;
      dispatch: Dispatch<any>;
    }> {}

@withStyles<typeof CollectionShow>(styles)
class CollectionShow extends React.PureComponent<CollectionShowProps> {
  private cancelToken = axios.CancelToken.source();

  public async componentDidMount() {
    const { dispatch, match, location, configuration } = this.props;

    const notRenderedAtServerOrJSAlreadyInitialized =
      !configuration.succeedAPIFetchAtServer || configuration.renderedAtClient;

    if (notRenderedAtServerOrJSAlreadyInitialized) {
      await fetchCollectionShowData({
        dispatch,
        match,
        pathname: location.pathname,
        cancelToken: this.cancelToken.token,
      });
      restoreScroll(location.key);
    }
  }

  public async componentWillReceiveProps(nextProps: CollectionShowProps) {
    const { dispatch, match, location } = nextProps;

    const currentCollectionId = this.props.match.params.collectionId;
    const nextCollectionId = match.params.collectionId;

    if (currentCollectionId !== nextCollectionId) {
      await fetchCollectionShowData({
        dispatch,
        match,
        pathname: location.pathname,
        cancelToken: this.cancelToken.token,
      });
      restoreScroll(location.key);
    }
  }

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { collectionShow, collection } = this.props;

    if (collectionShow.pageErrorCode) {
      return <ErrorPage errorNum={collectionShow.pageErrorCode} />;
    }

    if (collectionShow.isLoadingCollection) {
      return (
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <ArticleSpinner className={styles.loadingSpinner} />
          </div>
        </div>
      );
    } else if (collection) {
      const parsedUpdatedAt = parse(collection.updatedAt);

      return (
        <div>
          <div className={styles.collectionShowWrapper}>
            {this.getPageHelmet()}
            <div className={styles.headSection}>
              <div className={styles.container}>
                <div className={styles.leftBox}>
                  <div className={styles.title}>
                    <span>{collection.title}</span>
                  </div>
                  <div className={styles.description}>{collection.description}</div>
                  <div className={styles.infoWrapper}>
                    <span>Created by</span>
                    <strong>{` ${collection.createdBy.firstName} ${collection.createdBy.lastName || ""} · `}</strong>
                    <span>{`Last updated `}</span>
                    <strong>{`${distanceInWordsToNow(parsedUpdatedAt)} `}</strong>
                    <span>ago</span>
                  </div>
                </div>
                <div className={styles.rightBox}>{this.getCollectionControlBtns()}</div>
              </div>
            </div>

            <div className={styles.paperListContainer}>
              <div className={styles.leftBox}>
                <div className={styles.paperListBox}>
                  <div className={styles.header}>
                    <div className={styles.listTitle}>
                      <span>{`Papers `}</span>
                      <span className={styles.paperCount}>{collection.paperCount}</span>
                    </div>
                    <div className={styles.searchInputWrapper}>
                      <ScinapseInput
                        onSubmit={this.handleSubmitSearch}
                        placeholder="Search papers in this collection"
                        icon="SEARCH_ICON"
                      />
                    </div>
                    <div className={styles.subHeader}>
                      <div className={styles.resultPaperCount}>{`${
                        collectionShow.currentPaperListPage
                      } page of ${formatNumber(collectionShow.totalPaperListPage)} pages (${formatNumber(
                        collectionShow.papersTotalCount
                      )} results)`}</div>
                      <div className={styles.sortBoxWrapper}>
                        <SortBox
                          sortOption={collectionShow.sortType}
                          handleClickSortOption={this.handleClickSort}
                          currentPage="collectionShow"
                          exposeRecentlyUpdated={true}
                          exposeRelevanceOption={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div>{this.getPaperList()}</div>
                  <div>{this.getPaginationComponent()}</div>
                </div>
              </div>
              <div className={styles.rightBox} />
            </div>
          </div>
          <Footer containerStyle={{ backgroundColor: "white" }} />
        </div>
      );
    } else {
      return null;
    }
  }

  private getPaginationComponent = () => {
    const { collectionShow, layout } = this.props;
    const { currentPaperListPage, totalPaperListPage } = collectionShow;

    const currentPageIndex: number = currentPaperListPage - 1;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return (
        <MobilePagination
          totalPageCount={totalPaperListPage}
          currentPageIndex={currentPageIndex}
          onItemClick={this.fetchPapers}
          wrapperStyle={{
            margin: "12px 0",
          }}
        />
      );
    } else {
      return (
        <DesktopPagination
          type="search_result_papers"
          totalPage={totalPaperListPage}
          currentPageIndex={currentPageIndex}
          onItemClick={this.fetchPapers}
          wrapperStyle={{
            margin: "24px 0",
          }}
        />
      );
    }
  };

  private handleSubmitSearch = (query: string) => {
    const { dispatch, collectionShow } = this.props;

    dispatch(
      getPapers({
        collectionId: collectionShow.mainCollectionId,
        page: 1,
        sort: collectionShow.sortType,
        cancelToken: this.cancelToken.token,
        query,
      })
    );
  };

  private fetchPapers = (page: number) => {
    const { dispatch, collectionShow } = this.props;

    dispatch(
      getPapers({
        collectionId: collectionShow.mainCollectionId,
        page,
        sort: collectionShow.sortType,
        cancelToken: this.cancelToken.token,
        query: collectionShow.searchKeyword,
      })
    );
  };

  private handleClickSort = (option: AUTHOR_PAPER_LIST_SORT_TYPES) => {
    const { collectionShow, dispatch } = this.props;

    dispatch(
      getPapers({
        collectionId: collectionShow.mainCollectionId,
        page: collectionShow.currentPaperListPage,
        sort: option,
        cancelToken: this.cancelToken.token,
        query: collectionShow.searchKeyword,
      })
    );
  };

  private getCollectionControlBtns = () => {
    const { currentUser, collection } = this.props;

    if (collection && currentUser.isLoggedIn && collection.createdBy.id === currentUser.id && !collection.isDefault) {
      return (
        <div>
          <button
            className={styles.collectionControlBtn}
            onClick={() => {
              GlobalDialogManager.openEditCollectionDialog(collection);
            }}
          >
            <Icon icon="PEN" />
            <span>Edit</span>
          </button>
          {/* <button
            onClick={() => {
              GlobalDialogManager.openCollectionEditDialog(collection);
            }}
            className={styles.collectionControlBtn}
          >
            <Icon icon="TRASH_CAN" />
            <span>Delete</span>
          </button> */}
        </div>
      );
    }

    return null;
  };

  private getPageHelmet = () => {
    const { collection } = this.props;

    if (collection) {
      return (
        <Helmet>
          <title>{collection.title} | Scinapse</title>
          <meta itemProp="name" content={`${collection.title} | Scinapse`} />
          <meta
            name="description"
            content={`${collection.createdBy.firstName} ${collection.createdBy.lastName || ""}'s ${
              collection.title
            } collection`}
          />
          <meta
            name="twitter:description"
            content={`${collection.createdBy.firstName} ${collection.createdBy.lastName || ""}'s ${
              collection.title
            } collection`}
          />
          <meta name="twitter:card" content={`${collection.title} | Scinapse`} />
          <meta name="twitter:title" content={`${collection.title} | Scinapse`} />
          <meta property="og:title" content={`${collection.title} | Scinapse`} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://scinapse.io/collections/${collection.id}`} />
          <meta
            property="og:description"
            content={`${collection.createdBy.firstName} ${collection.createdBy.lastName || ""}'s ${
              collection.title
            } collection`}
          />
        </Helmet>
      );
    }
  };

  private getPaperList = () => {
    const { papersInCollection, currentUser, collectionShow } = this.props;

    if (collectionShow.isLoadingPaperToCollection) {
      return (
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      );
    }

    if (papersInCollection && papersInCollection.length > 0) {
      return papersInCollection.map(paper => {
        if (paper) {
          return (
            <CollectionPaperItem
              currentUser={currentUser}
              pageType="collectionShow"
              paperNote={paper.note ? paper.note : ""}
              paper={paper.paper}
              key={paper.paperId}
            />
          );
        }
        return null;
      });
    } else {
      return (
        <div className={styles.noPaperWrapper}>
          <Icon icon="UFO" className={styles.ufoIcon} />
          <div className={styles.noPaperDescription}>No paper in this collection.</div>
        </div>
      );
    }
  };
}

export default connect(mapStateToProps)(withRouter(CollectionShow));
