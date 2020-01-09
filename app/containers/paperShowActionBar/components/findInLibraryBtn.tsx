import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@pluto_network/pluto-design-elements';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import SearchingPDFBtn from '../../../components/paperShow/components/searchingPDFBtn';
import { addPaperToRecommendPool } from '../../../components/recommendPool/actions';
import { Paper } from '../../../model/paper';
const s = require('../actionBar.scss');

interface FindInLibraryBtnProps {
  isLoading: boolean;
  paper: Paper;
  onClick: () => void;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

const FindInLibraryBtn: React.FC<FindInLibraryBtnProps> = React.memo(props => {
  const dispatch = useDispatch();
  const { isLoading, paper, actionArea, onClick } = props;

  if (isLoading) {
    return <SearchingPDFBtn isLoading={isLoading} />;
  }

  return (
    <Button
      elementType="button"
      aria-label="Open dialog to find in library button"
      variant="outlined"
      isLoading={isLoading}
      onClick={async () => {
        ActionTicketManager.trackTicket({
          pageType: 'paperShow',
          actionType: 'fire',
          actionArea,
          actionTag: 'clickFindInLibraryBtn',
          actionLabel: String(paper.id),
        });

        dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'clickFindInLibraryBtn' }));

        onClick();
      }}
    >
      <Icon icon="SEARCH" />
      <span>Find in Lib.</span>
    </Button>
  );
});

export default withStyles<typeof FindInLibraryBtn>(s)(FindInLibraryBtn);
