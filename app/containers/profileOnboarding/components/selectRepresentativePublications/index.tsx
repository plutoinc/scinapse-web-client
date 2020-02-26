import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@pluto_network/pluto-design-elements';
import { IMPORT_SOURCE_TAB } from '../../../profile/types';
import { openImportPaperDialog } from '../../../../reducers/importPaperDialog';

interface SelectRepresentativePublicationsProps {
  profileSlug: string;
}

const SelectRepresentativePublications: FC<SelectRepresentativePublicationsProps> = ({ profileSlug }) => {
  const dispatch = useDispatch();

  return (
    <div>
      <Button
        elementType="button"
        variant="outlined"
        color="black"
        onClick={() =>
          dispatch(
            openImportPaperDialog({
              activeImportSourceTab: IMPORT_SOURCE_TAB.BIBTEX,
              profileSlug,
              isOnboarding: true,
              markRepresentative: true,
            })
          )
        }
        fullWidth
      >
        <span>Bibtex</span>
      </Button>
      <Button
        elementType="button"
        variant="outlined"
        color="black"
        onClick={() =>
          dispatch(
            openImportPaperDialog({
              activeImportSourceTab: IMPORT_SOURCE_TAB.CITATION,
              profileSlug,
              isOnboarding: true,
              markRepresentative: true,
            })
          )
        }
        fullWidth
      >
        <span>Citation String</span>
      </Button>
    </div>
  );
};

export default SelectRepresentativePublications;
