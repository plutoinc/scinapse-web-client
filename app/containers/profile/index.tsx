import React, { FC, useState, useRef, useEffect } from 'react';
import { denormalize } from 'normalizr';
import { useParams } from 'react-router-dom';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import RepresentativePublicationsDialog from '../../components/dialog/components/representativePublications';
import { AppState } from '../../reducers';
import DesktopPagination from '../../components/common/desktopPagination';
import { useThunkDispatch } from '../../hooks/useThunkDispatch';
import { fetchAuthorPapers, updateAuthor } from '../../actions/author';
import ModifyProfile, { ModifyProfileFormState } from '../../components/dialog/components/modifyProfile';
import { getAuthor, getCoAuthors } from '../authorShow/actions';
import { DEFAULT_AUTHOR_PAPERS_SIZE } from '../../api/author';
import { authorSchema, Author } from '../../model/author/author';
import AuthorShowHeader from '../../components/authorShowHeader';
import { Button, InputField } from '@pluto_network/pluto-design-elements';
import Icon from '../../icons';
import ActionTicketManager from '../../helpers/actionTicketManager';
import formatNumber from '../../helpers/formatNumber';
import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';
import CoAuthor from '../../components/common/coAuthor';
import AuthorCvSection from '../authorCvSection';
import { ActionCreators } from '../../actions/actionTypes';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import alertToast from '../../helpers/makePlutoToastAction';
import FullPaperItem from '../../components/common/paperItem/fullPaperItem';
import ProfileShowPageHelmet from './components/helmet';
import RepresentativePaperListSection from './components/representativePapers';
import { Paper } from '../../model/paper';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./connectedAuthor.scss');

enum AvailableTab {
  PUBLICATIONS,
  INFORMATION,
}

const ProfilePage: FC = () => {
  useStyles(s);
  const { profileId } = useParams();
  const dispatch = useThunkDispatch();
  const shouldFetch = useSelector(
    (state: AppState) => !state.configuration.succeedAPIFetchAtServer || state.configuration.renderedAtClient
  );
  const lastShouldFetch = useRef(shouldFetch);
  const author = useSelector<AppState, Author | undefined>(
    state => denormalize(profileId, authorSchema, state.entities),
    isEqual
  );
  const coAuthorIds = useSelector<AppState, string[] | undefined>(state => state.authorShow.coAuthorIds, isEqual);
  const userDevice = useSelector((state: AppState) => state.layout.userDevice);
  const currentPage = useSelector((state: AppState) => state.profilePageState.currentPage);
  const totalPaperCount = useSelector((state: AppState) => state.profilePageState.totalCount);
  const maxPage = useSelector((state: AppState) => state.profilePageState.maxPage);
  const paperIds = useSelector<AppState, string[] | undefined>(state => state.profilePageState.paperIds, isEqual);
  const sort = useSelector((state: AppState) => state.profilePageState.sort);
  const currentUser = useSelector((state: AppState) => state.currentUser, isEqual);
  const [isOpenModifyProfileDialog, setIsOpenModifyProfileDialog] = useState(false);
  const [isOpenRepresentativePublicationDialog, setIsOpenRepresentativePublicationDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(AvailableTab.PUBLICATIONS);

  const handleSearch = (query: string) => {
    if (query.length < 2) return;
    if (!author) return;

    ActionTicketManager.trackTicket({
      pageType: 'authorShow',
      actionType: 'fire',
      actionArea: 'paperList',
      actionTag: 'query',
      actionLabel: query,
    });

    dispatch(fetchAuthorPapers({ query, authorId: author.id, sort, page: 1 }));
  };

  useEffect(
    () => {
      if (!lastShouldFetch.current) return;
      if (!profileId) return;

      dispatch(getAuthor(profileId));
      dispatch(getCoAuthors(profileId));
    },
    [profileId, dispatch]
  );

  useEffect(
    () => {
      if (!lastShouldFetch.current) {
        lastShouldFetch.current = true;
        return;
      }
      if (!profileId) return;

      dispatch(
        fetchAuthorPapers({
          authorId: profileId,
          size: DEFAULT_AUTHOR_PAPERS_SIZE,
          page: currentPage,
          sort: 'MOST_CITATIONS',
        })
      );
    },
    [profileId, dispatch, currentPage]
  );

  if (!author) return null;

  const isMine = author.id === currentUser.authorId;

  return (
    <div className={s.authorShowPageWrapper}>
      <ProfileShowPageHelmet author={author} />
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
            {activeTab === AvailableTab.INFORMATION && <AuthorCvSection author={author} />}
            {activeTab === AvailableTab.PUBLICATIONS && (
              <>
                <div className={s.leftContentWrapper}>
                  <RepresentativePaperListSection
                    author={author}
                    isMine={isMine}
                    onClickManageButton={() => setIsOpenRepresentativePublicationDialog(prev => !prev)}
                  />
                  <div className={s.allPublicationHeader}>
                    <span className={s.sectionTitle}>Publications</span>
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
                  {paperIds &&
                    paperIds.map(id => (
                      <FullPaperItem key={id} paperId={id} pageType="profileShow" actionArea="paperList" hideFigure />
                    ))}
                  <DesktopPagination
                    type="AUTHOR_SHOW_PAPERS_PAGINATION"
                    totalPage={maxPage}
                    currentPageIndex={currentPage - 1}
                    onItemClick={(page: number) => {
                      dispatch(
                        fetchAuthorPapers({
                          authorId: author.id,
                          size: DEFAULT_AUTHOR_PAPERS_SIZE,
                          page,
                          sort: 'MOST_CITATIONS',
                        })
                      );
                    }}
                    wrapperStyle={{
                      margin: '45px 0 40px 0',
                    }}
                  />
                </div>
                <div className={s.rightContentWrapper}>
                  <div>
                    <div className={s.coAuthorHeader}>Close Researchers</div>
                    {coAuthorIds && coAuthorIds.map(id => <CoAuthor key={id} authorId={id} />)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ModifyProfile
        author={author}
        handleClose={() => setIsOpenModifyProfileDialog(prev => !prev)}
        isOpen={isOpenModifyProfileDialog}
        isLoading={false}
        handleSubmitForm={async (profile: ModifyProfileFormState) => {
          let affiliationId: string | null = null;
          let affiliationName = '';
          if ((profile.currentAffiliation as Affiliation).name) {
            affiliationId = (profile.currentAffiliation as Affiliation).id;
            affiliationName = (profile.currentAffiliation as Affiliation).name;
          } else if ((profile.currentAffiliation as SuggestAffiliation).keyword) {
            affiliationId = (profile.currentAffiliation as SuggestAffiliation).affiliationId;
            affiliationName = (profile.currentAffiliation as SuggestAffiliation).keyword;
          }

          try {
            await dispatch(
              updateAuthor({
                authorId: author.id,
                bio: profile.bio || null,
                email: profile.email,
                name: profile.authorName,
                webPage: profile.website || null,
                affiliationId,
                affiliationName,
                isEmailHidden: profile.isEmailHidden,
              })
            );

            setIsOpenModifyProfileDialog(prev => !prev);
          } catch (err) {
            alertToast({
              type: 'error',
              message: 'Had an error to update user profile.',
            });
            dispatch(ActionCreators.failedToUpdateProfileData());
          }
        }}
        initialValues={{
          authorName: author.name,
          currentAffiliation: author.lastKnownAffiliation || '',
          bio: author.bio || '',
          website: author.webPage || '',
          email: author.email || '',
          isEmailHidden: author.isEmailHidden || false,
        }}
      />
      <RepresentativePublicationsDialog
        currentUser={currentUser}
        isOpen={isOpenRepresentativePublicationDialog}
        author={author}
        handleClose={() => setIsOpenRepresentativePublicationDialog(prev => !prev)}
        handleSubmit={(papers: Paper[]) =>
          dispatch(
            ActionCreators.succeedToUpdateAuthorRepresentativePapers({
              authorId: author.id,
              papers,
            })
          )
        }
      />
    </div>
  );
};

export default ProfilePage;