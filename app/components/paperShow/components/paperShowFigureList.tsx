import React from 'react';
import { Paper, PaperFigure } from '../../../model/paper';
import LargePaperFigure from '../../common/paperFigure/largePaperFigure';
import { withStyles } from '../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
const styles = require('./paperShowFigureList.scss');

const MOBILE_FIGURES_MAX_LENGTH = 6;

function openPaperFigureDetailDialog(figures: PaperFigure[], index: number) {
  return GlobalDialogManager.openPaperFigureDetailDialog(figures, index);
}

const PaperShowFigureList: React.FC<{ paper: Paper; isMobile: boolean }> = ({ paper, isMobile }) => {
  const [finalFigures, setFinalFigures] = React.useState<PaperFigure[]>([]);
  const [shouldShowAll, setShouldShowAll] = React.useState(false);

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
        handleOpenFigureDetailDialog={() => openPaperFigureDetailDialog(paper.figures, i)}
      />
    );
  });

  return (
    <>
      <div className={styles.paperFigureContainer}>
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
