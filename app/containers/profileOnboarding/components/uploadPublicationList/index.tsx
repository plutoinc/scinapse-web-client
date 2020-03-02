import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@pluto_network/pluto-design-elements';
import { openImportPaperDialog } from '../../../../reducers/importPaperDialog';
import { IMPORT_SOURCE_TAB } from '../../../profile/types';
import Icon from '../../../../icons';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./uploadPublicationList.scss');

interface UploadPublicationListProps {
  profileSlug: string;
}

const UploadPublicationList: FC<UploadPublicationListProps> = ({ profileSlug }) => {
  useStyles(s);
  const dispatch = useDispatch();

  return (
    <div className={s.uploadPublicationListWrapper}>
      <div className={s.title}>Upload your publication list</div>
      <div className={s.mainContainer}>
        <div className={s.subContext}>I'll upload my publication list from ...</div>
        <div className={s.uploadButtonsGroup}>
          <Button
            elementType="button"
            variant="text"
            color="black"
            onClick={() =>
              dispatch(
                openImportPaperDialog({
                  activeImportSourceTab: IMPORT_SOURCE_TAB.BIBTEX,
                  profileSlug,
                  isOnboarding: true,
                })
              )
            }
            fullWidth
          >
            <span>Bibtex</span>
            <Icon icon="ARROW_RIGHT" />
          </Button>
          <Button
            elementType="button"
            variant="text"
            color="black"
            onClick={() =>
              dispatch(
                openImportPaperDialog({
                  activeImportSourceTab: IMPORT_SOURCE_TAB.CITATION,
                  profileSlug,
                  isOnboarding: true,
                })
              )
            }
            fullWidth
          >
            <span>Citation String</span>
            <Icon icon="ARROW_RIGHT" />
          </Button>
          <Button
            elementType="button"
            variant="text"
            color="black"
            onClick={() =>
              dispatch(
                openImportPaperDialog({ activeImportSourceTab: IMPORT_SOURCE_TAB.GS, profileSlug, isOnboarding: true })
              )
            }
            fullWidth
          >
            <span>GS</span>
            <Icon icon="ARROW_RIGHT" />
          </Button>
          <Button
            elementType="button"
            variant="text"
            color="black"
            onClick={() =>
              dispatch(
                openImportPaperDialog({
                  activeImportSourceTab: IMPORT_SOURCE_TAB.AUTHOR_URLS,
                  profileSlug,
                  isOnboarding: true,
                })
              )
            }
            fullWidth
          >
            <span>Author Urls</span>
            <Icon icon="ARROW_RIGHT" />
          </Button>
        </div>
        <div className={s.guideContext}>
          <Icon icon="ERROR" className={s.guideIcon} />
          <span>Why should I manually upload my publication list?</span>
        </div>
      </div>
    </div>
  );
};

export default UploadPublicationList;
