import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@pluto_network/pluto-design-elements';
import { IMPORT_SOURCE_TAB } from '../../../profile/types';
import { openImportPaperDialog } from '../../../../reducers/importPaperDialog';
import Icon from '../../../../icons';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./selectRepresentativePublications.scss');

interface SelectRepresentativePublicationsProps {
  profileSlug: string;
}

const SelectRepresentativePublications: FC<SelectRepresentativePublicationsProps> = ({ profileSlug }) => {
  useStyles(s);
  const dispatch = useDispatch();

  return (
    <div className={s.selectRepresentativePublicationsWrapper}>
      <div className={s.title}>Select your REPRESENTATIVE publications</div>
      <div className={s.mainContainer}>
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
                  isRepresentativeImporting: true,
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
                  isRepresentativeImporting: true,
                })
              )
            }
            fullWidth
          >
            <span>Citation String</span>
            <Icon icon="ARROW_RIGHT" />
          </Button>
        </div>
        <div className={s.guideContext}>
          <Icon icon="ERROR" className={s.guideIcon} />
          <span>What is the representative publications?</span>
        </div>
      </div>
    </div>
  );
};

export default SelectRepresentativePublications;
