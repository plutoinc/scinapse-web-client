import React, { FC, useState, useRef, useEffect } from 'react';
import { denormalize } from 'normalizr';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducers';
import { useThunkDispatch } from '../../hooks/useThunkDispatch';
import { fetchAuthorPapers } from '../../actions/author';
import { getAuthor } from '../unconnectedAuthorShow/actions';
import { DEFAULT_AUTHOR_PAPERS_SIZE } from '../../api/author';
import { authorSchema } from '../../model/author/author';
import AuthorShowHeader from '../../components/authorShowHeader';
import { Button, InputField } from '@pluto_network/pluto-design-elements';
import Icon from '../../icons';
import ActionTicketManager from '../../helpers/actionTicketManager';
import formatNumber from '../../helpers/formatNumber';
import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';
import SimplePaperItemContainer from '../../components/simplePaperItem/simplePaperItemContainer';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./connectedAuthor.scss');

enum AvailableTab {
  PUBLICATIONS,
  INFORMATION,
}

const ProfilePage: FC = () => {
  useStyles(s);
  const { authorId } = useParams();
  const dispatch = useThunkDispatch();
  const shouldFetch = useSelector(
    (state: AppState) => !state.configuration.succeedAPIFetchAtServer || state.configuration.renderedAtClient
  );
  const author = useSelector(
    (state: AppState) => denormalize(state.connectedAuthorShow.authorId, authorSchema, state.entities),
    isEqual
  );
  const userDevice = useSelector((state: AppState) => state.layout.userDevice);
  const currentPage = useSelector((state: AppState) => state.profilePageState.currentPage);
  const totalPaperCount = useSelector((state: AppState) => state.profilePageState.totalCount);
  const maxPage = useSelector((state: AppState) => state.profilePageState.maxPage);
  const paperIds = useSelector((state: AppState) => state.profilePageState.paperIds);
  const sort = useSelector((state: AppState) => state.profilePageState.sort);
  const lastShouldFetch = useRef(shouldFetch);
  const currentUser = useSelector((state: AppState) => state.currentUser, isEqual);
  const [isOpenModifyProfileDialog, setIsOpenModifyProfileDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(AvailableTab.PUBLICATIONS);

  const handleSearch = (query: string) => {
    if (query.length < 2) return;

    ActionTicketManager.trackTicket({
      pageType: 'authorShow',
      actionType: 'fire',
      actionArea: 'paperList',
      actionTag: 'query',
      actionLabel: query,
    });

    dispatch(
      fetchAuthorPapers({
        query,
        authorId: author.id,
        sort,
        page: 1,
      })
    );
  };

  useEffect(
    () => {
      if (!lastShouldFetch.current) {
        lastShouldFetch.current = true;
        return;
      }
      if (!authorId) return;

      dispatch(getAuthor(authorId));
    },
    [authorId, dispatch]
  );

  useEffect(
    () => {
      if (!lastShouldFetch.current) {
        lastShouldFetch.current = true;
        return;
      }
      if (!authorId) return;

      dispatch(
        fetchAuthorPapers({
          authorId,
          size: DEFAULT_AUTHOR_PAPERS_SIZE,
          page: currentPage,
          sort: 'MOST_CITATIONS',
        })
      );
    },
    [authorId, dispatch, currentPage]
  );

  if (!author) return null;
  const isMine = author.id === currentUser.authorId;
  const affiliationName = author.lastKnownAffiliation ? author.lastKnownAffiliation.name : '';
  const description = `${affiliationName ? `${affiliationName} |` : ''} citation: ${author.citationCount} | h-index: ${
    author.hindex
  }`;
  const structuredData: any = {
    '@context': 'http://schema.org',
    '@type': 'Person',
    name: author.name,
    affiliation: {
      '@type': 'Organization',
      name: affiliationName,
    },
    description: `${affiliationName ? `${affiliationName} |` : ''} citation: ${author.citationCount} | h-index: ${
      author.hindex
    }`,
    mainEntityOfPage: 'https://scinapse.io',
  };

  return (
    <div className={s.authorShowPageWrapper}>
      <Helmet>
        <title>{`${author.name} | Scinapse`}</title>
        <link rel="canonical" href={`https://scinapse.io/authors/${author.id}`} />
        <meta itemProp="name" content={`${author.name} | Scinapse`} />
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:card" content={`${author.name} | Scinapse`} />
        <meta name="twitter:title" content={`${author.name} | Scinapse`} />
        <meta property="og:title" content={`${author.name} | Scinapse`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://scinapse.io/authors/${author.id}`} />
        <meta property="og:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className={s.rootWrapper}>
        <AuthorShowHeader
          author={author}
          userDevice={userDevice}
          currentUser={currentUser}
          rightBoxContent={
            isMine && (
              <Button
                elementType="button"
                size="medium"
                variant="outlined"
                color="gray"
                onClick={() => setIsOpenModifyProfileDialog(prev => !prev)}
              >
                <Icon icon="PEN" />
                <span>Edit Profile</span>
              </Button>
            )
          }
          navigationContent={
            <div className={s.tabNavigationWrapper}>
              <div
                onClick={() => setActiveTab(AvailableTab.PUBLICATIONS)}
                className={classNames({
                  [s.currentTabNavigationItem]: activeTab === AvailableTab.PUBLICATIONS,
                  [s.tabNavigationItem]: activeTab !== AvailableTab.PUBLICATIONS,
                })}
              >
                PUBLICATIONS
              </div>
              <div
                onClick={() => setActiveTab(AvailableTab.INFORMATION)}
                className={classNames({
                  [s.currentTabNavigationItem]: activeTab === AvailableTab.INFORMATION,
                  [s.tabNavigationItem]: activeTab !== AvailableTab.INFORMATION,
                })}
              >
                INFORMATION
              </div>
            </div>
          }
        />

        <div className={s.contentBox}>
          <div className={s.container}>
            <div className={s.leftContentWrapper}>
              <div className={s.allPublicationHeader}>
                <span className={s.sectionTitle}>All Publications</span>
                <span className={s.countBadge}>{author.paperCount}</span>
              </div>
              <div className={s.selectedPaperDescription} />
              <div className={s.searchSortWrapper}>
                <div className={s.searchContainer}>
                  <div className={s.searchInputWrapper}>
                    <InputField
                      leadingIcon={<Icon icon="SEARCH" />}
                      placeholder="Search papers"
                      onKeyPress={e => {
                        e.key === 'Enter' && handleSearch(e.currentTarget.value);
                      }}
                    />
                  </div>
                  <div className={s.paperCountMetadata}>
                    {currentPage} page of {formatNumber(maxPage)} pages ({formatNumber(totalPaperCount)} results)
                  </div>
                </div>
                <div className={s.rightBox}>
                  <SortBox
                    sortOption={sort}
                    onClickOption={(sort: AUTHOR_PAPER_LIST_SORT_TYPES) =>
                      dispatch(
                        fetchAuthorPapers({
                          authorId: author.id,
                          size: DEFAULT_AUTHOR_PAPERS_SIZE,
                          page: 1,
                          sort,
                        })
                      )
                    }
                    currentPage="authorShow"
                    exposeRecentlyUpdated={currentUser.authorId === author.id}
                    exposeRelevanceOption={false}
                  />
                </div>
              </div>
              {paperIds.map(id => (
                <SimplePaperItemContainer key={id} paperId={id} pageType="profileShow" actionArea="paperList" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
