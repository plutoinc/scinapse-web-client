import * as React from 'react';
import axios from 'axios';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as parse from 'date-fns/parse';
import { denormalize } from 'normalizr';
import { Helmet } from 'react-helmet';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { AppState } from '../../reducers';
import CollectionPaperItem from './collectionPaperItem';
import TransparentButton from '../../components/common/transparentButton';
import ArticleSpinner from '../common/spinner/articleSpinner';
import MobilePagination from '../common/mobilePagination';
import DesktopPagination from '../common/desktopPagination';
import { withStyles } from '../../helpers/withStylesHelper';
import { CurrentUser } from '../../model/currentUser';
import { CollectionShowState } from './reducer';
import { Collection, collectionSchema } from '../../model/collection';
import { fetchCollectionShowData } from './sideEffect';
import { Configuration } from '../../reducers/configuration';
import { PaperInCollection, paperInCollectionSchema } from '../../model/paperInCollection';
import Icon from '../../icons';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from '../common/sortBox';
import { getPapers, openShareDropdown, closeShareDropdown } from './actions';
import { LayoutState, UserDevice } from '../layouts/records';
import ScinapseInput from '../common/scinapseInput';
import formatNumber from '../../helpers/formatNumber';
import restoreScroll from '../../helpers/scrollRestoration';
import copySelectedTextToClipboard from '../../helpers/copySelectedTextToClipboard';
import ActionTicketManager from '../../helpers/actionTicketManager';
import ErrorPage from '../error/errorPage';
import { removePaperFromCollection } from '../dialog/actions';
import { CollectionShowMatchParams } from './types';
import CollectionSideNaviBar from '../collectionSideNaviBar';
import { getCollections } from '../collections/actions';
import RelatedPaperInCollectionShow from './relatedPaperInCollectionShow';
import ImprovedFooter from '../layouts/improvedFooter';
const styles = require('./collectionShow.scss');

const FACEBOOK_SHARE_URL = 'http://www.facebook.com/sharer/sharer.php?u=';
const TWITTER_SHARE_URL = 'https://twitter.com/intent/tweet?url=';

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    currentUser: state.currentUser,
    collectionShow: state.collectionShow,
    configuration: state.configuration,
    userCollections: denormalize(state.myCollections.collectionIds, [collectionSchema], state.entities),
    userCollection: denormalize(state.collectionShow.mainCollectionId, collectionSchema, state.entities),
    papersInCollection: denormalize(state.collectionShow.paperIds, [paperInCollectionSchema], state.entities),
  };
}

export interface CollectionShowProps
  extends RouteComponentProps<CollectionShowMatchParams>,
    Readonly<{
      layout: LayoutState;
      currentUser: CurrentUser;
      configuration: Configuration;
      collectionShow: CollectionShowState;
      userCollections: Collection[];
      userCollection: Collection | undefined;
      papersInCollection: PaperInCollection[] | undefined;
      dispatch: Dispatch<any>;
    }> {}

@withStyles<typeof CollectionShow>(styles)
class CollectionShow extends React.PureComponent<CollectionShowProps> {
  private cancelToken = axios.CancelToken.source();

  public async componentDidMount() {
    const { dispatch, match, location, configuration, currentUser, userCollection } = this.props;

    const itsNotMine = currentUser.isLoggedIn && userCollection && userCollection.createdBy.id !== currentUser.id;

    if ((!currentUser.isLoggedIn || itsNotMine) && userCollection) {
      dispatch(getCollections(userCollection.createdBy.id, this.cancelToken.token, false));
    }

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
    const { collectionShow, userCollection } = this.props;

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
    } else if (userCollection) {
      const parsedUpdatedAt = parse(userCollection.updatedAt);

      return (
        <div>
          <div className={styles.collectionShowWrapper}>
            <div className={styles.collectionShowContentsWrapper}>
              {this.getPageHelmet()}
              <div className={styles.headSection}>
                <div className={styles.container}>
                  <div className={styles.leftBox}>
                    <div className={styles.categoryName}>COLLECTION</div>
                    <div className={styles.title}>
                      <span>{userCollection.title}</span>
                      {this.getEditButton()}
                    </div>
                    <div className={styles.description}>{userCollection.description}</div>
                    <div className={styles.infoWrapper}>
                      <span>Created by </span>
                      <Link
                        className={styles.collectionCreatedUser}
                        to={`/users/${userCollection.createdBy.id}/collections`}
                      >
                        <strong>{`${userCollection.createdBy.firstName} ${userCollection.createdBy.lastName ||
                          ''}`}</strong>
                      </Link>
                      <span>{` · Last updated `}</span>
                      <strong>{`${distanceInWordsToNow(parsedUpdatedAt)} `}</strong>
                      <span>ago</span>
                    </div>
                  </div>
                  <div className={styles.rightBox}>{this.getCollectionShareButton()}</div>
                </div>
              </div>

              <div className={styles.paperListContainer}>
                <CollectionSideNaviBar
                  currentCollectionId={collectionShow.mainCollectionId}
                  collectionCreateBy={userCollection.createdBy}
                />
                <div className={styles.leftBox}>
                  <div className={styles.paperListBox}>
                    <div className={styles.header}>
                      <div className={styles.searchContainer}>
                        <div className={styles.searchInputWrapper}>
                          <ScinapseInput
                            onSubmit={this.handleSubmitSearch}
                            placeholder="Search papers in this collection"
                            icon="SEARCH_ICON"
                            inputStyle={{ maxWidth: '486px', height: '40px' }}
                          />
                        </div>
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
                      {this.getCollectionControlBtns()}
                      <div className={styles.subHeader}>
                        <div>
                          <span className={styles.resultPaperCount}>
                            {`${formatNumber(collectionShow.papersTotalCount)} Papers `}
                          </span>
                          <span className={styles.resultPaperPageCount}>
                            {`(${collectionShow.currentPaperListPage} page of ${formatNumber(
                              collectionShow.totalPaperListPage
                            )} pages)`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>{this.getPaperList()}</div>
                    <div>{this.getPaginationComponent()}</div>
                  </div>
                  <RelatedPaperInCollectionShow collectionId={userCollection.id} />
                </div>
              </div>
            </div>
          </div>
          <ImprovedFooter containerStyle={{ backgroundColor: '#f8f9fb' }} />
        </div>
      );
    } else {
      return null;
    }
  }

  private getPaginationComponent = () => {
    const { collectionShow, layout } = this.props;
    const { currentPaperListPage, totalPaperListPage } = collectionShow;

    if (totalPaperListPage === 1) {
      return null;
    }

    const currentPageIndex: number = currentPaperListPage - 1;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return (
        <MobilePagination
          totalPageCount={totalPaperListPage}
          currentPageIndex={currentPageIndex}
          onItemClick={this.fetchPapers}
          wrapperStyle={{
            margin: '12px 0',
          }}
        />
      );
    } else {
      return (
        <DesktopPagination
          type="collection_show"
          totalPage={totalPaperListPage}
          currentPageIndex={currentPageIndex}
          onItemClick={this.fetchPapers}
          wrapperStyle={{
            margin: '24px 0',
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

    ActionTicketManager.trackTicket({
      pageType: 'collectionShow',
      actionType: 'fire',
      actionArea: 'paperList',
      actionTag: 'queryInCollection',
      actionLabel: query,
    });
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

  private getShareDropdownContent = () => {
    const { userCollection } = this.props;

    if (!userCollection) return null;

    return (
      <div className={styles.shareAreaWrapper}>
        <span className={styles.shareGuideMessage}>Share this Collection to SNS!</span>
        <div className={styles.shareBtnsWrapper}>
          <a
            className={styles.shareBtn}
            onClick={() => {
              this.getPageToSharing('COPIED', userCollection.id);
            }}
          >
            <Icon icon="LINK" className={styles.shareIcon} />
          </a>
          <a
            className={styles.shareBtn}
            target="_blank"
            rel="noopener nofollow noreferrer"
            onClick={() => {
              this.getPageToSharing('FACEBOOK', userCollection.id);
            }}
          >
            <Icon icon="FACEBOOK_LOGO" className={styles.facebookShareIcon} />
          </a>
          <a
            className={styles.shareBtn}
            target="_blank"
            rel="noopener nofollow noreferrer"
            onClick={() => {
              this.getPageToSharing('TWITTER', userCollection.id);
            }}
          >
            <Icon icon="TWITTER_LOGO" className={styles.twitterShareIcon} />
          </a>
        </div>
      </div>
    );
  };

  private handleActionTicketInShared = (platform: string, id: number) => {
    ActionTicketManager.trackTicket({
      pageType: 'collectionShow',
      actionType: 'fire',
      actionArea: 'shareBox',
      actionTag: 'collectionSharing',
      actionLabel: `${platform}, ${id}`,
    });
  };

  private getPageToSharing = (platform: string, id: number) => {
    switch (platform) {
      case 'COPIED':
        copySelectedTextToClipboard(`https://scinapse.io/collections/${id}?share=copylink`);
        this.handleActionTicketInShared(platform, id);
        break;
      case 'FACEBOOK':
        window.open(
          `${FACEBOOK_SHARE_URL}https://scinapse.io/collections/${id}?share=facebook`,
          '_blank',
          'width=600, height=400'
        );
        this.handleActionTicketInShared(platform, id);
        break;
      case 'TWITTER':
        window.open(
          `${TWITTER_SHARE_URL}https://scinapse.io/collections/${id}?share=twitter`,
          '_blank',
          'width=600, height=400'
        );
        this.handleActionTicketInShared(platform, id);
        break;
      default:
        break;
    }
  };

  private getCollectionControlBtns = () => {
    const { currentUser, userCollection } = this.props;
    const isMine =
      userCollection &&
      currentUser.isLoggedIn &&
      userCollection.createdBy.id === currentUser.id &&
      !userCollection.isDefault;

    if (!isMine) return null;

    return (
      <div>
        <div className={styles.collectionControlBtnsWrapper}>
          <button className={styles.collectionControlBtn}>
            <Icon icon="TRASH_CAN" className={styles.deleteIcon} />DELETE
          </button>
          <button className={styles.collectionControlBtn}>
            <Icon icon="CITED" className={styles.citedIcon} />CITATION EXPORT
          </button>
        </div>
        <div className={styles.collectionControlBtnsDivider} />
      </div>
    );
  };

  private getEditButton = () => {
    const { currentUser, userCollection } = this.props;
    const isMine =
      userCollection &&
      currentUser.isLoggedIn &&
      userCollection.createdBy.id === currentUser.id &&
      !userCollection.isDefault;

    if (!isMine) return null;

    return (
      <button
        className={styles.editButton}
        onClick={() => GlobalDialogManager.openEditCollectionDialog(userCollection!)}
      >
        <Icon icon="PEN" className={styles.editIcon} />Edit
      </button>
    );
  };

  private getCollectionShareButton = () => {
    const { collectionShow } = this.props;
    const collectionShareButton = (
      <TransparentButton
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          width: '93px',
          height: '40px',
          fontWeight: 500,
          padding: '8px',
          marginTop: '32px',
          color: '#3e7fff',
        }}
        iconStyle={{
          marginRight: '8px',
          width: '17px',
          height: '14px',
          color: '#3e7fff',
        }}
        onClick={() => {
          this.handleToggleShareDropdown();
        }}
        gaCategory="Collection Show"
        gaAction="Click Share Collection"
        content="Share"
        icon="SHARE"
      />
    );

    return (
      <div className={styles.collectionHeaderBtnWrapper}>
        <ClickAwayListener onClickAway={this.handleCloseShareDropdown}>
          <div>
            <div>{collectionShareButton}</div>
            <div>{collectionShow.isShareDropdownOpen ? this.getShareDropdownContent() : null}</div>
          </div>
        </ClickAwayListener>
      </div>
    );
  };

  private removePaperFromCollection = async (paperId: number) => {
    const { dispatch, userCollection } = this.props;

    if (userCollection && confirm(`Are you sure to remove this paper from '${userCollection.title}'?`)) {
      try {
        await dispatch(removePaperFromCollection({ paperIds: [paperId], collection: userCollection }));
      } catch (err) {}
    }
  };

  private handleCloseShareDropdown = () => {
    const { dispatch, collectionShow } = this.props;

    if (collectionShow.isShareDropdownOpen) {
      dispatch(closeShareDropdown());
    }
  };

  private handleToggleShareDropdown = () => {
    const { dispatch, collectionShow } = this.props;

    if (collectionShow.isShareDropdownOpen) {
      dispatch(closeShareDropdown());
    } else {
      dispatch(openShareDropdown());
    }
  };

  private getPageHelmet = () => {
    const { userCollection } = this.props;

    if (userCollection) {
      return (
        <Helmet>
          <title>{userCollection.title} | Scinapse</title>
          <link rel="canonical" href={`https://scinapse.io/collections/${userCollection.id}`} />
          <meta itemProp="name" content={`${userCollection.title} | Scinapse`} />
          <meta
            name="description"
            content={`${userCollection.createdBy.firstName} ${userCollection.createdBy.lastName || ''}'s ${
              userCollection.title
            } collection`}
          />
          <meta
            name="twitter:description"
            content={`${userCollection.createdBy.firstName} ${userCollection.createdBy.lastName || ''}'s ${
              userCollection.title
            } collection`}
          />
          <meta name="twitter:card" content={`${userCollection.title} | Scinapse`} />
          <meta name="twitter:title" content={`${userCollection.title} | Scinapse`} />
          <meta property="og:title" content={`${userCollection.title} | Scinapse`} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://scinapse.io/collections/${userCollection.id}`} />
          <meta
            property="og:description"
            content={`${userCollection.createdBy.firstName} ${userCollection.createdBy.lastName || ''}'s ${
              userCollection.title
            } collection`}
          />
        </Helmet>
      );
    }
  };

  private getPaperList = () => {
    const { papersInCollection, currentUser, collectionShow, userCollection } = this.props;

    if (collectionShow.isLoadingPaperToCollection) {
      return (
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      );
    }

    if (userCollection && papersInCollection && papersInCollection.length > 0) {
      return papersInCollection.map(paper => {
        return (
          <CollectionPaperItem
            currentUser={currentUser}
            pageType="collectionShow"
            actionArea="paperList"
            paperNote={paper.note ? paper.note : ''}
            paper={paper.paper}
            collection={userCollection}
            onRemovePaperCollection={this.removePaperFromCollection}
            key={paper.paperId}
          />
        );
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
