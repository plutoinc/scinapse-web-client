import React from 'react';
import { Paper, PaperFigure } from '../../../model/paper';
import LargePaperFigure from '../../common/paperFigure/largePaperFigure';
import { withStyles } from '../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { ActionTicketParams } from '../../../helpers/actionTicketManager/actionTicket';
import { useObserver } from '../../../hooks/useIntersectionHook';
const styles = require('./paperShowFigureList.scss');

const MOBILE_FIGURES_MAX_LENGTH = 6;

function openPaperFigureDetailDialog(figures: PaperFigure[], index: number, paperId: number) {
  ActionTicketManager.trackTicket({
    pageType: 'paperShow',
    actionType: 'fire',
    actionArea: 'figureList',
    actionTag: 'clickPaperFigure',
    actionLabel: String(paperId),
  });

  return GlobalDialogManager.openPaperFigureDetailDialog(figures, index, paperId);
}

const PaperShowFigureList: React.FC<{ paper: Paper; isMobile: boolean }> = ({ paper, isMobile }) => {
  const [finalFigures, setFinalFigures] = React.useState<PaperFigure[]>([]);
  const [shouldShowAll, setShouldShowAll] = React.useState(false);

  const actionTicketContext: ActionTicketParams = {
    pageType: 'paperShow',
    actionType: 'view',
    actionArea: 'figureList',
    actionTag: 'viewFigureList',
    actionLabel: String(paper.id),
  };

  const { elRef } = useObserver(0.1, actionTicketContext);

  React.useEffect(
    () => {
      if (paper.figures.length > MOBILE_FIGURES_MAX_LENGTH && isMobile && !shouldShowAll) {
        setFinalFigures(paper.figures.slice(0, MOBILE_FIGURES_MAX_LENGTH));
      } else {
        setFinalFigures(paper.figures);
      }
    },
    [isMobile, shouldShowAll, paper.figures]
  );

  if (!paper || paper.figures.length === 0) return null;

  let showAllBtnText;

  if (shouldShowAll) {
    showAllBtnText = 'Show Less Figure';
  } else {
    showAllBtnText = 'Show All Figure';
  }

  const figureList = finalFigures.map((figure, i) => {
    return (
      <LargePaperFigure
        figure={figure}
        key={i}
        handleOpenFigureDetailDialog={() => openPaperFigureDetailDialog(paper.figures, i, paper.id)}
      />
    );
  });

  return (
    <>
      <div className={styles.paperFigureContainer} ref={elRef}>
        <div className={styles.paperFigureHeader}>Figures & Tables</div>
        {figureList}
      </div>
      {paper.figures.length > MOBILE_FIGURES_MAX_LENGTH && (
        <button className={styles.showAllBtn} onClick={() => setShouldShowAll(!shouldShowAll)}>
          {showAllBtnText}
        </button>
      )}
    </>
  );
};

export default withStyles<typeof PaperShowFigureList>(styles)(PaperShowFigureList);
