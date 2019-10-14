import * as React from 'react';
import axios from 'axios';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as parse from 'date-fns/parse';
import { AppState } from '../../reducers';
import { withStyles } from '../../helpers/withStylesHelper';
import { getCollections } from './sideEffect';
import { Collection, collectionSchema } from '../../model/collection';
import { UserCollectionsState } from './reducer';
import { Member, memberSchema } from '../../model/member';
import Icon from '../../icons';
import { trackEvent } from '../../helpers/handleGA';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import { deleteCollection } from '../dialog/actions';
import { CurrentUser } from '../../model/currentUser';
import restoreScroll from '../../helpers/scrollRestoration';
import alertToast from '../../helpers/makePlutoToastAction';
import ErrorPage from '../error/errorPage';
import ImprovedFooter from '../layouts/improvedFooter';
const styles = require('./collections.scss');

export interface UserCollectionsProps extends RouteComponentProps<{ userId: string }> {
  dispatch: Dispatch<any>;
  userCollections: UserCollectionsState;
  collections: Collection[] | undefined;
  member: Member | undefined;
  currentUser: CurrentUser;
}

function mapStateToProps(state: AppState) {
  return {
    userCollections: state.userCollections,
    collections: denormalize(state.userCollections.collectionIds, [collectionSchema], state.entities).filter(
      (c: Collection) => !!c
    ),
    member: denormalize(state.userCollections.targetMemberId, memberSchema, state.entities),
    currentUser: state.currentUser,
  };
}

@withStyles<typeof UserCollections>(styles)
class UserCollections extends React.PureComponent<UserCollectionsProps> {
  private cancelToken = axios.CancelToken.source();

  public async componentDidMount() {
    const { location } = this.props;
    await this.fetchCollections();
    restoreScroll(location.key);
  }

  public async componentWillReceiveProps(nextProps: UserCollectionsProps) {
    if (this.props.match.params.userId !== nextProps.match.params.userId) {
      const userId = parseInt(nextProps.match.params.userId, 10);
      await this.fetchCollections(userId);
      restoreScroll(nextProps.location.key);
    }
  }

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { userCollections, member, collections } = this.props;

    if (userCollections.pageErrorCode) {
      return <ErrorPage errorNum={userCollections.pageErrorCode} />;
    }

    if (member && collections) {
      return (
        <div className={styles.pageWrapper}>
          <div className={styles.contentWrapper}>
            {this.getPageHelmet()}
            <div className={styles.container}>
              <div className={styles.header}>
                <div className={styles.leftBox}>
                  <div className={styles.titleBox}>
                    <span>{`${member.firstName} ${member.lastName || ''}'s collections`}</span>
                    <span className={styles.collectionCount}>{userCollections.collectionIds.length}</span>
                  </div>
                </div>
                <div className={styles.rightBox}>{this.getNewCollectionBtn()}</div>
              </div>
              {this.getCollections(collections)}
            </div>
          </div>
          <ImprovedFooter containerStyle={{ backgroundColor: 'white' }} />
        </div>
      );
    } else {
      return null;
    }
  }

  private getCollections = (collections: Collection[]) => {
    if (collections && collections.length > 0) {
      const collectionNodes = collections.map(collection => {
        const parsedUpdatedAt = parse(collection.updatedAt);

        return (
          <li className={styles.collectionItem} key={`collection_item_${collection.id}`}>
            <div className={styles.titleBox}>
              <Link to={`/collections/${collection.id}`} className={styles.title}>
                {collection.title}
              </Link>
              {this.getCollectionControlBtns(collection)}
            </div>
            <div className={styles.description}>{collection.description}</div>
            <div className={styles.subInformation}>
              <span>
                <b>{`${collection.paperCount} papers · `}</b>
              </span>
              <span>{`Last updated `}</span>
              <span>
                <b>{`${distanceInWordsToNow(parsedUpdatedAt)} ago`}</b>
              </span>
            </div>
          </li>
        );
      });

      return <ul className={styles.collectionListWrapper}>{collectionNodes}</ul>;
    }
    return null;
  };

  private getCollectionControlBtns = (collection: Collection) => {
    const { currentUser, match } = this.props;
    const collectionUserId = parseInt(match.params.userId, 10);

    if (currentUser && currentUser.id === collectionUserId) {
      return (
        <div className={styles.collectionControlBox}>
          <div
            className={styles.controlIconWrapper}
            onClick={() => {
              this.handleClickEditCollection(collection);
            }}
          >
            <Icon className={styles.controlIcon} icon="PEN" />
          </div>
          <div
            className={styles.controlIconWrapper}
            onClick={() => {
              this.handleDeleteCollection(collection);
            }}
          >
            <Icon className={styles.controlIcon} icon="TRASH_CAN" />
          </div>
        </div>
      );
    }
    return null;
  };

  private getNewCollectionBtn = () => {
    const { currentUser, match } = this.props;
    const collectionUserId = parseInt(match.params.userId, 10);
    if (currentUser && currentUser.id === collectionUserId) {
      return (
        <button className={styles.newCollectionBtnWrapper} onClick={this.handleClickNewCollectionButton}>
          <Icon className={styles.plusIcon} icon="PLUS" />
          <span>Create New Collection</span>
        </button>
      );
    }
    return null;
  };

  private handleDeleteCollection = async (collection: Collection) => {
    const { dispatch } = this.props;

    if (confirm(`Do you really want to DELETE collection ${collection.title}?`)) {
      try {
        await dispatch(deleteCollection(collection.id));
      } catch (err) {
        alertToast({
          type: 'error',
          message: err.message,
        });
      }
    }
  };

  private handleClickEditCollection = (collection: Collection) => {
    GlobalDialogManager.openEditCollectionDialog(collection);
    trackEvent({
      category: 'Additional Action',
      action: 'Click [Edit Collection] Button',
      label: 'my collection list page',
    });
  };

  private handleClickNewCollectionButton = () => {
    GlobalDialogManager.openNewCollectionDialog();
    trackEvent({
      category: 'Additional Action',
      action: 'Click [New Collection] Button',
      label: 'my collection list page',
    });
  };

  private fetchCollections = (userId?: number) => {
    const { dispatch, match, location } = this.props;

    getCollections({
      dispatch,
      match,
      pathname: location.pathname,
      userId,
      cancelToken: this.cancelToken.token,
    });
  };

  private getPageHelmet = () => {
    const { collections, member } = this.props;

    if (collections && member) {
      const headCollections = collections
        .map(c => c.title)
        .slice(0, 3)
        .join(' | ');

      return (
        <Helmet>
          <title>{`${member.firstName} ${member.lastName || ''}'s paper collections | Scinapse`}</title>
          <link rel="canonical" href={`https://scinapse.io/collections/users/${member.id}/collections`} />
          <meta
            itemProp="name"
            content={`${member.firstName} ${member.lastName || ''}'s paper collections | Scinapse`}
          />
          <meta name="description" content={headCollections} />
          <meta name="twitter:description" content={headCollections} />
          <meta property="og:description" content={headCollections} />
          <meta
            name="twitter:card"
            content={`${member.firstName} ${member.lastName || ''}'s paper collections | Scinapse`}
          />
          <meta
            name="twitter:title"
            content={`${member.firstName} ${member.lastName || ''}'s paper collections | Scinapse`}
          />
          <meta
            property="og:title"
            content={`${member.firstName} ${member.lastName || ''}'s paper collections | Scinapse`}
          />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://scinapse.io/collections/users/${member.id}/collections`} />
        </Helmet>
      );
    }
  };
}

export default connect(mapStateToProps)(UserCollections);
