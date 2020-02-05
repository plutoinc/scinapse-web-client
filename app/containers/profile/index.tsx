import React, { FC, useState, useRef, useEffect } from 'react';
import { useParams, useLocation, RouteComponentProps } from 'react-router-dom';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
// import RepresentativePublicationsDialog from '../../components/dialog/components/representativePublications';
import { AppState } from '../../reducers';
import DesktopPagination from '../../components/common/desktopPagination';
import { useThunkDispatch } from '../../hooks/useThunkDispatch';
import ModifyProfile, { ModifyProfileFormState } from '../../components/dialog/components/modifyProfile';
// import { DEFAULT_AUTHOR_PAPERS_SIZE } from '../../api/author';
import ProfileShowHeader from '../../components/authorShowHeader/profileShowHeader';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../icons';
// import ActionTicketManager from '../../helpers/actionTicketManager';
import formatNumber from '../../helpers/formatNumber';
import ProfileCvSection from '../authorCvSection';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import FullPaperItem from '../../components/common/paperItem/fullPaperItem';
import ProfileShowPageHelmet from './components/helmet';
// import RepresentativePaperListSection from './components/representativePapers';
// import { Paper } from '../../model/paper';
import { selectHydratedProfile, Profile } from '../../model/profile';
import { fetchProfileData, updateProfile, fetchProfilePapers, fetchProfilePendingPapers } from '../../actions/profile';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
import { PendingPaper } from '../../reducers/profilePendingPaperList';
import PendingPaperList from './components/pendingPaperList';
import PaperImportDialog from './components/paperImportDialog';
import { fetchAuthorShowPageData } from './sideEffects';
import ProfileCoAuthor from '../../components/common/profileCoAuthor';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./connectedAuthor.scss');

enum AvailableTab {
  PUBLICATIONS,
  INFORMATION,
}

type ProfilePageProps = RouteComponentProps<{ profileId: string }>;

const ProfilePage: FC<ProfilePageProps> = ({ match }) => {
  useStyles(s);
  const { profileId } = useParams();
  const dispatch = useThunkDispatch();
  const location = useLocation();
  const queryParams = getQueryParamsObject(location.search);
  const currentPage = parseInt(queryParams.page || '', 10) || 0;
  const profile = useSelector<AppState, Profile | undefined>(state => selectHydratedProfile(state, profileId));
  const userDevice = useSelector((state: AppState) => state.layout.userDevice);
  const totalPaperCount = useSelector((state: AppState) => state.profilePaperListState.totalCount);
  const maxPage = useSelector((state: AppState) => state.profilePaperListState.maxPage);
  const pendingPapers = useSelector<AppState, PendingPaper[]>(
    state => state.profilePendingPaperListState.papers,
    isEqual
  );
  const paperIds = useSelector<AppState, string[]>(state => state.profilePaperListState.paperIds, isEqual);
  const currentUser = useSelector((state: AppState) => state.currentUser, isEqual);
  const [isOpenModifyProfileDialog, setIsOpenModifyProfileDialog] = useState(false);
  const [isOpenPaperImportDialog, setIsOpenPaperImportDialog] = useState(false);
  // const [isOpenRepresentativePublicationDialog, setIsOpenRepresentativePublicationDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(AvailableTab.PUBLICATIONS);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const shouldFetch = useSelector(
    (state: AppState) => !state.configuration.succeedAPIFetchAtServer || state.configuration.renderedAtClient
  );
  const lastShouldFetch = useRef(shouldFetch);

  useEffect(
    () => {
      if (!lastShouldFetch.current) return;
      if (!profileId) return;

      dispatch(fetchProfileData(profileId));
    },
    [profileId, dispatch, currentUser]
  );

  useEffect(
    () => {
      if (!lastShouldFetch.current) return;
      if (!profileId) return;

      dispatch(fetchProfilePendingPapers(profileId));
    },
    [profileId, dispatch, currentUser]
  );

  useEffect(
    () => {
      if (!lastShouldFetch.current) {
        lastShouldFetch.current = true;
        return;
      }
      if (!profileId) return;

      dispatch(fetchProfilePapers({ profileId, page: currentPage }));
    },
    [profileId, currentPage, dispatch, currentUser]
  );

  if (!profile) return null;

  console.log(profile.coauthors);

  return (
    <div className={s.authorShowPageWrapper}>
      <ProfileShowPageHelmet profile={profile} />
      <div className={s.rootWrapper}>
        <ProfileShowHeader
          profile={profile}
          userDevice={userDevice}
          currentUser={currentUser}
          rightBoxContent={
            profile.isEditable && (
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
                  {pendingPapers.length > 0 ? (
                    <>
                      <div className={s.allPublicationHeader}>
                        <span className={s.sectionTitle}>Pending Publications</span>
                        <span className={s.countBadge}>{pendingPapers.length}</span>
                        <div className={s.rightBox}>what 'pending' means?</div>
                      </div>
                      <div className={s.divider} />
                      <PendingPaperList papers={pendingPapers} />
                    </>
                  ) : null}
                  <div className={s.allPublicationHeader}>
                    <span className={s.sectionTitle}>Publications</span>
                    <span className={s.countBadge}>{profile.paperCount}</span>
                    <div className={s.rightBox}>
                      {profile.isEditable && (
                        <Button
                          elementType="button"
                          size="medium"
                          onClick={() => {
                            setIsOpenPaperImportDialog(true);
                          }}
                        >
                          <Icon icon="ADD_NOTE" />
                          <span>Import Publications</span>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className={s.paperCountMetadata}>
                    {currentPage + 1} page of {formatNumber(maxPage)} pages ({formatNumber(totalPaperCount)} results)
                  </div>
                  <div className={s.divider} />
                  {paperIds.length === 0 &&
                    profile.isEditable && (
                      <div className={s.noPapers}>
                        <span className={s.noPaperContent}>You have not yet imported your paper list.</span>
                        <Button
                          elementType="button"
                          size="medium"
                          onClick={() => {
                            setIsOpenPaperImportDialog(true);
                          }}
                        >
                          <Icon icon="ADD_NOTE" />
                          <span>Import Publications</span>
                        </Button>
                      </div>
                    )}
                  {paperIds.map(id => (
                    <FullPaperItem
                      key={id}
                      paperId={id}
                      pageType="profileShow"
                      actionArea="paperList"
                      ownProfileId={profile.id}
                      hideFigure
                    />
                  ))}
                  <DesktopPagination
                    type="AUTHOR_SHOW_PAPERS_PAGINATION"
                    getLinkDestination={page => `/profiles/${profileId}?page=${page - 1}`}
                    totalPage={maxPage}
                    currentPageIndex={currentPage}
                    wrapperStyle={{
                      margin: '45px 0 40px 0',
                    }}
                  />
                </div>
                <div className={s.rightContentWrapper}>
                  <div>
                    <div className={s.coAuthorHeader}>Close Researchers</div>
                    {profile.coauthors.length > 0 &&
                      profile.coauthors.map(coauthor => <ProfileCoAuthor key={coauthor.id} author={coauthor} />)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
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
              bio: profileForm.bio || null,
              email: profileForm.email,
              first_name: profileForm.firstName,
              last_name: profileForm.lastName,
              web_page: profileForm.website || null,
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
          bio: profile.bio || null,
          website: profile.webPage || null,
          email: profile.email,
          isEmailPublic: profile.isEmailPublic || false,
        }}
      />
      <PaperImportDialog
        isOpen={isOpenPaperImportDialog}
        handleClosePaperImportDialog={() => setIsOpenPaperImportDialog(false)}
        profileId={profileId!}
        fetchProfileShowData={() => fetchAuthorShowPageData({ dispatch, match, pathname: location.pathname })}
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
