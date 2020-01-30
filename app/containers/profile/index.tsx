import React, { FC, useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
// import RepresentativePublicationsDialog from '../../components/dialog/components/representativePublications';
import { AppState } from '../../reducers';
// import DesktopPagination from '../../components/common/desktopPagination';
import { useThunkDispatch } from '../../hooks/useThunkDispatch';
import ModifyProfile, { ModifyProfileFormState } from '../../components/dialog/components/modifyProfile';
// import { DEFAULT_AUTHOR_PAPERS_SIZE } from '../../api/author';
import ProfileShowHeader from '../../components/authorShowHeader/profileShowHeader';
import { Button, InputField } from '@pluto_network/pluto-design-elements';
import Icon from '../../icons';
// import ActionTicketManager from '../../helpers/actionTicketManager';
import formatNumber from '../../helpers/formatNumber';
// import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';
import CoAuthor from '../../components/common/coAuthor';
import ProfileCvSection from '../authorCvSection';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import FullPaperItem from '../../components/common/paperItem/fullPaperItem';
import ProfileShowPageHelmet from './components/helmet';
// import RepresentativePaperListSection from './components/representativePapers';
// import { Paper } from '../../model/paper';
import { selectHydratedProfile, Profile } from '../../model/profile';
import { fetchProfileData, updateProfile } from '../../actions/profile';
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
  const profile = useSelector<AppState, Profile | undefined>(state => selectHydratedProfile(state, profileId));
  const coAuthorIds = useSelector<AppState, string[] | undefined>(state => state.authorShow.coAuthorIds, isEqual);
  const userDevice = useSelector((state: AppState) => state.layout.userDevice);
  const currentPage = useSelector((state: AppState) => state.profilePageState.currentPage);
  const totalPaperCount = useSelector((state: AppState) => state.profilePageState.totalCount);
  const maxPage = useSelector((state: AppState) => state.profilePageState.maxPage);
  const paperIds = useSelector<AppState, string[] | undefined>(state => state.profilePageState.paperIds, isEqual);
  // const sort = useSelector((state: AppState) => state.profilePageState.sort);
  const currentUser = useSelector((state: AppState) => state.currentUser, isEqual);
  const [isOpenModifyProfileDialog, setIsOpenModifyProfileDialog] = useState(false);
  // const [isOpenRepresentativePublicationDialog, setIsOpenRepresentativePublicationDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(AvailableTab.PUBLICATIONS);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // const handleSearch = (query: string) => {
  //   if (query.length < 2) return;
  //   if (!profile) return;

  //   ActionTicketManager.trackTicket({
  //     pageType: 'authorShow',
  //     actionType: 'fire',
  //     actionArea: 'paperList',
  //     actionTag: 'query',
  //     actionLabel: query,
  //   });

  //   dispatch(fetchAuthorPapers({ query, authorId: author.id, sort, page: 1 }));
  // };

  useEffect(
    () => {
      if (!lastShouldFetch.current) return;
      if (!profileId) return;

      dispatch(fetchProfileData(profileId));
    },
    [profileId, dispatch]
  );

  // useEffect(
  //   () => {
  //     if (!lastShouldFetch.current) {
  //       lastShouldFetch.current = true;
  //       return;
  //     }
  //     if (!profileId) return;

  //     dispatch(
  //       fetchAuthorPapers({
  //         authorId: profileId,
  //         size: DEFAULT_AUTHOR_PAPERS_SIZE,
  //         page: currentPage,
  //         sort: 'MOST_CITATIONS',
  //       })
  //     );
  //   },
  //   [profileId, dispatch, currentPage]
  // );

  if (!profile) return null;

  // TODO: Change below
  const isEditable = true;

  return (
    <div className={s.authorShowPageWrapper}>
      <ProfileShowPageHelmet profile={profile} />
      <div className={s.rootWrapper}>
        <ProfileShowHeader
          profile={profile}
          userDevice={userDevice}
          currentUser={currentUser}
          rightBoxContent={
            isEditable && (
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
            {activeTab === AvailableTab.INFORMATION && <ProfileCvSection profile={profile} />}
            {activeTab === AvailableTab.PUBLICATIONS && (
              <>
                <div className={s.leftContentWrapper}>
                  {/* <RepresentativePaperListSection
                    author={author}
                    isEditable={isEditable}
                    onClickManageButton={() => setIsOpenRepresentativePublicationDialog(prev => !prev)}
                  /> */}
                  <div className={s.allPublicationHeader}>
                    <span className={s.sectionTitle}>Publications</span>
                    <span className={s.countBadge}>{profile.paperCount}</span>
                  </div>
                  <div className={s.selectedPaperDescription} />
                  <div className={s.searchSortWrapper}>
                    <div className={s.searchContainer}>
                      <div className={s.searchInputWrapper}>
                        <InputField
                          leadingIcon={<Icon icon="SEARCH" />}
                          placeholder="Search papers"
                          onKeyPress={e => {
                            // TODO: restore below logic
                            // e.key === 'Enter' && handleSearch(e.currentTarget.value);
                            console.log(e.key);
                          }}
                        />
                      </div>
                      <div className={s.paperCountMetadata}>
                        {currentPage} page of {formatNumber(maxPage)} pages ({formatNumber(totalPaperCount)} results)
                      </div>
                    </div>
                    <div className={s.rightBox}>
                      // TODO: restore below logic
                      {/* <SortBox
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
                      /> */}
                    </div>
                  </div>
                  {paperIds &&
                    paperIds.map(id => (
                      <FullPaperItem key={id} paperId={id} pageType="profileShow" actionArea="paperList" hideFigure />
                    ))}
                  {/* // TODO: restore below logic */}
                  {/* <DesktopPagination
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
                  /> */}
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
      {/* // TODO: restore below logic */}
      <ModifyProfile
        handleClose={() => setIsOpenModifyProfileDialog(prev => !prev)}
        isOpen={isOpenModifyProfileDialog}
        isLoading={isUpdatingProfile}
        handleSubmitForm={async (profileForm: ModifyProfileFormState) => {
          let affiliationId: string | null = null;
          let affiliationName = '';
          if ((profileForm.currentAffiliation as Affiliation).name) {
            affiliationId = (profileForm.currentAffiliation as Affiliation).id;
            affiliationName = (profileForm.currentAffiliation as Affiliation).name;
          } else if ((profileForm.currentAffiliation as SuggestAffiliation).keyword) {
            affiliationId = (profileForm.currentAffiliation as SuggestAffiliation).affiliationId;
            affiliationName = (profileForm.currentAffiliation as SuggestAffiliation).keyword;
          }
          setIsUpdatingProfile(true);
          await dispatch(
            updateProfile({
              id: profile.id,
              bio: profileForm.bio || '',
              email: profileForm.email,
              first_name: profileForm.firstName,
              last_name: profileForm.lastName,
              web_page: profileForm.website || '',
              affiliation_id: affiliationId,
              affiliation_name: affiliationName,
              is_email_public: profileForm.isEmailPublic,
            })
          );
          setIsUpdatingProfile(false);
          setIsOpenModifyProfileDialog(prev => !prev);
        }}
        initialValues={{
          firstName: profile.firstName,
          lastName: profile.lastName,
          currentAffiliation: { id: profile.affiliationId, name: profile.affiliationName } || '',
          bio: profile.bio || '',
          website: profile.webPage || '',
          email: profile.email || '',
          isEmailPublic: profile.isEmailPublic || false,
        }}
      />
      {/* <RepresentativePublicationsDialog
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
      /> */}
    </div>
  );
};

export default ProfilePage;
