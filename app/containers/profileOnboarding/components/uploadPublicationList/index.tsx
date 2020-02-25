import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@pluto_network/pluto-design-elements';
import { openImportPaperDialog } from '../../../../reducers/importPaperDialog';
import { IMPORT_SOURCE_TAB } from '../../../profile/types';

interface UploadPublicationListProps {
  profileSlug: string;
}

const UploadPublicationList: FC<UploadPublicationListProps> = ({ profileSlug }) => {
  const dispatch = useDispatch();
  return (
    <div>
      <div>Upload your publication list</div>
      <Button
        elementType="button"
        variant="outlined"
        color="black"
        onClick={() =>
          dispatch(
            openImportPaperDialog({ activeImportSourceTab: IMPORT_SOURCE_TAB.BIBTEX, profileSlug, isOnboarding: true })
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
            })
          )
        }
        fullWidth
      >
        <span>Citation String</span>
      </Button>
      <Button
        elementType="button"
        variant="outlined"
        color="black"
        onClick={() =>
          dispatch(
            openImportPaperDialog({ activeImportSourceTab: IMPORT_SOURCE_TAB.GS, profileSlug, isOnboarding: true })
          )
        }
        fullWidth
      >
        <span>GS</span>
      </Button>
      <Button
        elementType="button"
        variant="outlined"
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
      </Button>
    </div>
  );
};

export default UploadPublicationList;
