import React, { FC, memo } from 'react';
import { Button } from '@pluto_network/pluto-design-elements';
import FullPaperItem from '../../../../components/common/paperItem/fullPaperItem';
import Icon from '../../../../icons';
import { useThunkDispatch } from '../../../../hooks/useThunkDispatch';
import { openImportPaperDialog } from '../../../../reducers/importPaperDialog';
import { IMPORT_SOURCE_TAB } from '../../types';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('../../connectedAuthor.scss');

interface Props {
  profileSlug: string;
  paperIds: string[];
  totalCount: number;
  isEditable: boolean;
}

const RepresentativePaperListSection: FC<Props> = memo(({ paperIds, isEditable, totalCount, profileSlug }) => {
  useStyles(s);
  const dispatch = useThunkDispatch();

  let paperList;
  if (!paperIds.length) {
    paperList = (
      <div className={s.noPaperWrapper}>
        <div className={s.noPaperDescription}>There is no representative publications.</div>
      </div>
    );
  } else {
    paperList = paperIds.map(id => (
      <FullPaperItem key={id} pageType="profileShow" actionArea="representativePaperList" paperId={id} />
    ));
  }

  return (
    <>
      <div className={s.selectedPublicationSection}>
        <div className={s.sectionHeader}>
          <span className={s.sectionTitle}>Representative Publications</span>
          <span className={s.countBadge}>{totalCount}</span>
          <div className={s.rightBox}>
            {isEditable && (
              <Button
                elementType="button"
                color="gray"
                variant="outlined"
                title="Import Representative Publications"
                onClick={() =>
                  dispatch(
                    openImportPaperDialog({
                      activeImportSourceTab: IMPORT_SOURCE_TAB.BIBTEX,
                      profileSlug,
                      isRepresentativeImporting: true,
                    })
                  )
                }
              >
                <Icon icon="ADD_NOTE" />
                <span>Import Representative Publications</span>
              </Button>
            )}
          </div>
        </div>
        <div className={s.selectedPaperDescription} />
        {paperList}
        <div className={s.selectedPaperWrapper}>
          {isEditable && !totalCount && (
            <Button
              elementType="button"
              variant="outlined"
              color="gray"
              onClick={() =>
                dispatch(
                  openImportPaperDialog({
                    activeImportSourceTab: IMPORT_SOURCE_TAB.BIBTEX,
                    profileSlug,
                    isRepresentativeImporting: true,
                  })
                )
              }
              style={{
                marginTop: '16px',
              }}
            >
              <Icon icon="PLUS" />
              <span>Import Representative Publications</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
});

export default RepresentativePaperListSection;
