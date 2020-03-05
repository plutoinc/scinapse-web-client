import React, { FC, useState, useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputField } from '@pluto_network/pluto-design-elements';
import Dialog from '@material-ui/core/Dialog';
import ProfilePaperItem from '../../../../components/profilePaperItem/profilePaperItem';
import PlutoAxios from '../../../../api/pluto';
import alertToast from '../../../../helpers/makePlutoToastAction';
import { closeSearchPublicationsDialog } from '../../../../reducers/profileSearchPublicationsDialog';
import { AppState } from '../../../../reducers';
import { searchAuthorPublications } from '../../../../actions/profile';
import { UserDevice } from '../../../../components/layouts/reducer';
import DesktopPagination from '../../../../components/common/desktopPagination';
import MobilePagination from '../../../../components/common/mobilePagination';
import Icon from '../../../../icons';
import formatNumber from '../../../../helpers/formatNumber';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./searchPublicationDialog.scss');

interface SearchPublicationDialogProps {
  profileSlug: string;
  isEditable: boolean;
  fetchProfileShowData: () => void;
}

const Pagination: FC<{ totalPage: number; currentPage: number; onClickPaginationItem: (page: number) => void }> = ({
  totalPage,
  currentPage,
  onClickPaginationItem,
}) => {
  const isMobile = useSelector((state: AppState) => state.layout.userDevice === UserDevice.MOBILE);

  if (isMobile) {
    return (
      <MobilePagination
        totalPageCount={totalPage}
        currentPageIndex={currentPage}
        onItemClick={onClickPaginationItem}
        wrapperStyle={{
          margin: '24px 0 40px 0',
        }}
      />
    );
  } else {
    return (
      <DesktopPagination
        type="PROFILE_SHOW_SEARCH_PUBLICATIONS_PAGINATION"
        totalPage={totalPage}
        currentPageIndex={currentPage}
        onItemClick={onClickPaginationItem}
        wrapperStyle={{
          margin: '24px 0 40px 0',
        }}
      />
    );
  }
};

const SearchPublicationDialog: FC<SearchPublicationDialogProps> = ({ profileSlug, fetchProfileShowData }) => {
  useStyles(s);
  const dispatch = useDispatch();

  const { isOpen, paperIds, currentPage, maxPage, totalCount } = useSelector((state: AppState) => ({
    isOpen: state.profileSearchPublicationsDialogState.isOpen,
    paperIds: state.profileSearchPublicationsDialogState.paperIds,
    maxPage: state.profileSearchPublicationsDialogState.maxPage,
    currentPage: state.profileSearchPublicationsDialogState.currentPage,
    totalCount: state.profileSearchPublicationsDialogState.totalCount,
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchPublications = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);

        await dispatch(searchAuthorPublications({ query: searchQuery, profileSlug: profileSlug, page: page - 1 }));

        setIsLoading(false);
      } catch (err) {
        const error = PlutoAxios.getGlobalError(err);
        alertToast({
          type: 'error',
          message: error.message,
        });
        setIsLoading(false);
      }
    },
    [dispatch, profileSlug, searchQuery]
  );

  const paperList = useMemo(() => {
    if (isLoading) {
      return (
        <div className={s.innerContainer}>
          <CircularProgress size={50} thickness={4} color="inherit" />
        </div>
      );
    }
    if (paperIds.length > 0) {
      return (
        <div className={s.paperListWrapper}>
          {paperIds.map(id => (
            <ProfilePaperItem
              key={id}
              paperId={id}
              pageType="profileShow"
              actionArea="searchPaperList"
              ownProfileSlug={profileSlug}
              isEditable={false}
              fetchProfileShowData={fetchProfileShowData}
              isRepresentative={true}
              isOpenBlank={true}
            />
          ))}
        </div>
      );
    }

    return <div className={s.noPaperContent}>Had no result.</div>;
  }, [paperIds, profileSlug, fetchProfileShowData, isLoading]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => dispatch(closeSearchPublicationsDialog())}
      classes={{ paper: s.dialogPaper }}
      maxWidth="lg"
    >
      <div className={s.boxContainer}>
        <div className={s.boxWrapper}>
          <div style={{ marginTop: 0 }} className={s.header}>
            <div className={s.title}>Search Publications ( {formatNumber(totalCount)} )</div>
            <Icon icon="X_BUTTON" className={s.iconWrapper} onClick={() => dispatch(closeSearchPublicationsDialog())} />
          </div>
          <div className={s.inputFieldWrapper}>
            <InputField
              placeholder="Input search keyword"
              aria-label="Scinapse search box in author show"
              trailingIcon={<Icon icon="SEARCH" onClick={() => handleSearchPublications(1)} />}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  handleSearchPublications(1);
                }
              }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.currentTarget.value)}
            />
          </div>
          <div>
            {paperList}
            <Pagination
              totalPage={maxPage}
              currentPage={currentPage}
              onClickPaginationItem={handleSearchPublications}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SearchPublicationDialog;
