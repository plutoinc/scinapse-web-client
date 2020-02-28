import React, { FC, useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-intersection-observing-infinity-scroll';
import Dialog from '@material-ui/core/Dialog';
import Icon from '../../../../icons';
import ProfileAPI from '../../../../api/profile';
import ProfilePaperItem from '../../../../components/profilePaperItem/profilePaperItem';
import ArticleSpinner from '../../../../components/common/spinner/articleSpinner';
import { AppState } from '../../../../reducers';
import PlutoAxios from '../../../../api/pluto';
import alertToast from '../../../../helpers/makePlutoToastAction';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./allRepresentativePaperDialog.scss');

interface AllRepresentativePaperDialogProps {
  isOpen: boolean;
  profileSlug: string;
  isEditable: boolean;
  fetchProfileShowData: () => void;
  onCloseDialog: () => void;
}

const AllRepresentativePaperDialog: FC<AllRepresentativePaperDialogProps> = ({
  isOpen,
  profileSlug,
  fetchProfileShowData,
  onCloseDialog,
}) => {
  useStyles(s);

  const { representativePaperIds } = useSelector((state: AppState) => ({
    representativePaperIds: state.profileRepresentativePaperListState.paperIds,
  }));

  const [paperIds, setPaperIds] = useState<string[]>(representativePaperIds);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  const fetchRepresentativePapers = useCallback(
    async (page = 0) => {
      if (!isLoading) {
        try {
          setIsLoading(true);
          const res = await ProfileAPI.getRepresentativePapers({ profileSlug: profileSlug, page });

          const nextPaperIds = res.data.content.map(paper => paper.id);

          const newPaperIds = [...paperIds, ...nextPaperIds];

          setPaperIds(newPaperIds);
          setCurrentPage(page);
          setIsEnd(res.data.page ? res.data.page.last : true);
          setIsLoading(false);
        } catch (err) {
          const error = PlutoAxios.getGlobalError(err);
          alertToast({
            type: 'error',
            message: error.message,
          });
          setIsLoading(false);
        }
      }
    },
    [isEnd, isLoading, profileSlug]
  );

  useEffect(() => {
    if (!isOpen) {
      setPaperIds(representativePaperIds);
      setCurrentPage(0);
      setIsEnd(false);
    }
  }, [isOpen, representativePaperIds]);

  const paperList = useMemo(() => {
    if (paperIds.length > 0) {
      return paperIds.map(id => (
        <ProfilePaperItem
          key={id}
          paperId={id}
          pageType="profileShow"
          actionArea="representativePaperList"
          ownProfileSlug={profileSlug}
          isEditable={false}
          fetchProfileShowData={fetchProfileShowData}
          isRepresentative={true}
        />
      ));
    }

    return <div />;
  }, [paperIds, profileSlug, fetchProfileShowData]);

  return (
    <Dialog open={isOpen} onClose={onCloseDialog} classes={{ paper: s.dialogPaper }} maxWidth="lg">
      <div className={s.boxContainer}>
        <div className={s.boxWrapper}>
          <div style={{ marginTop: 0 }} className={s.header}>
            <div className={s.title}>All Representative Publications</div>
            <Icon icon="X_BUTTON" className={s.iconWrapper} onClick={onCloseDialog} />
          </div>
          <div>
            <InfiniteScroll
              loadMoreFunc={() => fetchRepresentativePapers(currentPage + 1)}
              isLoading={isLoading}
              hasMore={!isEnd}
              loaderComponent={
                <div className="loader">
                  <ArticleSpinner
                    style={{
                      margin: '20px',
                    }}
                  />
                </div>
              }
            >
              {paperList}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AllRepresentativePaperDialog;
