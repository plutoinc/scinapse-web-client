import * as React from 'react';
import axios, { CancelTokenSource } from 'axios';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as parse from 'date-fns/parse';
import { denormalize } from 'normalizr';
import { AppState } from '../../reducers';
import ArticleSpinner from '../../components/common/spinner/articleSpinner';
import { Collection, collectionSchema } from '../../model/collection';
import { fetchCollectionShowData } from './sideEffect';
import { paperInCollectionSchema } from '../../model/paperInCollection';
import Icon from '../../icons';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';
import { getPapers } from './actions';
import ScinapseInput from '../../components/common/scinapseInput';
import restoreScroll from '../../helpers/scrollRestoration';
import ActionTicketManager from '../../helpers/actionTicketManager';
import ErrorPage from '../../components/error/errorPage';
import { CollectionShowMatchParams } from './types';
import CollectionSideNaviBar from '../../components/collectionSideNaviBar';
import { getCollections } from '../../components/collections/actions';
import RelatedPaperInCollectionShow from '../../components/collectionShow/relatedPaperInCollectionShow';
import ImprovedFooter from '../../components/layouts/improvedFooter';
import { withStyles } from '../../helpers/withStylesHelper';
import PageHelmet from '../../components/collectionShow/pageHelmet';
import CollectionShareButton from '../../components/collectionShow/collectionShareButton';
import CollectionPaperList from '../../components/collectionShow/collectionPaperList';
import { ACTION_TYPES } from '../../actions/actionTypes';
import Pagination from '../../components/collectionShow/pagination';
import { checkAuthStatus } from '../../components/auth/actions';
import { removePaperFromCollection } from '../../components/dialog/actions';
const styles = require('./collectionShow.scss');

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    currentUser: state.currentUser,
    collectionShow: state.collectionShow,
    configuration: state.configuration,
    userCollection: denormalize(state.collectionShow.mainCollectionId, collectionSchema, state.entities) as Collection,
    papersInCollection: denormalize(state.collectionShow.paperIds, [paperInCollectionSchema], state.entities),
  };
}

type Props = ReturnType<typeof mapStateToProps> &
  RouteComponentProps<CollectionShowMatchParams> & {
    dispatch: Dispatch<any>;
  };

const EditButton: React.FC<{ itsMine: boolean; userCollection: Collection }> = ({ itsMine, userCollection }) => {
  if (!itsMine) return null;

  return (
    <button className={styles.editButton} onClick={() => GlobalDialogManager.openEditCollectionDialog(userCollection!)}>
      <Icon icon="PEN" className={styles.editIcon} />Edit
    </button>
  );
};

const CollectionShow: React.FC<Props> = props => {
  const {
    collectionShow,
    dispatch,
    match,
    location,
    configuration,
    currentUser,
    userCollection,
    papersInCollection,
    layout,
  } = props;
  const [itsMine, setItsMine] = React.useState(false);
  const cancelTokenSource = React.useRef<CancelTokenSource>(axios.CancelToken.source());

  React.useEffect(
    () => {
      const itsNotMine =
        !currentUser.isLoggedIn ||
        (currentUser.isLoggedIn && userCollection && userCollection.createdBy.id !== currentUser.id);

      setItsMine(!itsNotMine);

      if (itsNotMine && userCollection) {
        dispatch(getCollections(userCollection.createdBy.id, cancelTokenSource.current.token, false));
      }

      const notRenderedAtServerOrJSAlreadyInitialized =
        !configuration.succeedAPIFetchAtServer || configuration.renderedAtClient;

      if (notRenderedAtServerOrJSAlreadyInitialized) {
        dispatch({ type: ACTION_TYPES.COLLECTION_SHOW_CLEAR_SELECT_PAPER_ITEM });
        fetchCollectionShowData({
          dispatch,
          match,
          pathname: location.pathname,
          cancelToken: cancelTokenSource.current.token,
        });
        restoreScroll(location.key);
      }

      return () => {
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = axios.CancelToken.source();
      };
    },
    [match.params.collectionId, currentUser.isLoggedIn]
  );

  const handleSubmitSearch = React.useCallback(
    (query: string) => {
      dispatch(
        getPapers({
          collectionId: collectionShow.mainCollectionId,
          page: 1,
          sort: collectionShow.sortType,
          cancelToken: cancelTokenSource.current.token,
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

      return () => {
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = axios.CancelToken.source();
      };
    },
    [dispatch, collectionShow.mainCollectionId, collectionShow.sortType]
  );

  const handleClickSort = React.useCallback(
    (option: AUTHOR_PAPER_LIST_SORT_TYPES) => {
      dispatch(
        getPapers({
          collectionId: collectionShow.mainCollectionId,
          page: collectionShow.currentPaperListPage,
          sort: option,
          cancelToken: cancelTokenSource.current.token,
          query: collectionShow.searchKeyword,
        })
      );

      return () => {
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = axios.CancelToken.source();
      };
    },
    [dispatch, collectionShow.mainCollectionId, collectionShow.currentPaperListPage, collectionShow.searchKeyword]
  );

  const handleSelectPaperItem = React.useCallback(
    (paperId: number) => {
      dispatch({
        type: ACTION_TYPES.COLLECTION_SHOW_SELECT_PAPER_ITEM,
        payload: { paperId: paperId },
      });
    },
    [dispatch]
  );

  const handleRemovePaperFromCollection = React.useCallback(
    async (paperIds: number | number[]) => {
      const auth = await checkAuthStatus()(dispatch);
      const isLoggedIn = auth && auth.loggedIn;

      if (!isLoggedIn) return window.alert('Your login status has changed. Please refresh the page and try again.');

      let param;
      if (typeof paperIds === 'object') {
        param = paperIds;
      } else {
        param = [paperIds];
      }

      let removeConfirm;

      if (param.length >= 2) {
        removeConfirm = confirm(`Are you sure to remove ${param.length} paper from '${userCollection.title}'?`);
      } else {
        removeConfirm = confirm(`Are you sure to remove this paper from '${userCollection.title}'?`);
      }

      if (userCollection && removeConfirm) {
        try {
          await dispatch(removePaperFromCollection({ paperIds: param, collection: userCollection }));
        } catch (err) {}
      }
    },
    [userCollection.id]
  );

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
            <PageHelmet userCollection={userCollection} />
            <div className={styles.headSection}>
              <div className={styles.container}>
                <div className={styles.leftBox}>
                  <div className={styles.categoryName}>COLLECTION</div>
                  <div className={styles.title}>
                    <span>{userCollection.title}</span>
                    <EditButton itsMine={itsMine} userCollection={userCollection} />
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
                <div className={styles.rightBox}>
                  <CollectionShareButton userCollection={userCollection} />
                </div>
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
                          onSubmit={handleSubmitSearch}
                          placeholder="Search papers in this collection"
                          icon="SEARCH_ICON"
                          inputStyle={{ maxWidth: '486px', height: '40px' }}
                        />
                      </div>
                      <div className={styles.sortBoxWrapper}>
                        <SortBox
                          sortOption={collectionShow.sortType}
                          handleClickSortOption={handleClickSort}
                          currentPage="collectionShow"
                          exposeRecentlyUpdated={true}
                          exposeRelevanceOption={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <CollectionPaperList
                      itsMine={itsMine}
                      papersInCollection={papersInCollection}
                      currentUser={currentUser}
                      collectionShow={collectionShow}
                      userCollection={userCollection}
                      onSelectedPaperInCollection={handleSelectPaperItem}
                      onRemovePaperFromCollection={handleRemovePaperFromCollection}
                    />
                  </div>
                  <div>
                    <Pagination collectionShow={collectionShow} layout={layout} />
                  </div>
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
};

export default connect(mapStateToProps)(withRouter(withStyles<typeof CollectionShow>(styles)(CollectionShow)));
