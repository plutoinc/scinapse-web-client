import React from 'react';
import { Paper, PaperFigure } from '../../../model/paper';
import LargePaperFigure from '../../common/paperFigure/largePaperFigure';
import { withStyles } from '../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
const styles = require('./paperShowFigureList.scss');

const MOBILE_FIGURES_MAX_LENGTH = 6;

const PaperShowFigureList: React.FC<{ paper: Paper; isMobile: boolean }> = ({ paper, isMobile }) => {
  const [finalFigures, setFinalFigures] = React.useState<PaperFigure[]>([]);
  const [shouldShowAll, setShouldShowAll] = React.useState(false);
  const rawPaperFigures = paper.figures;

  let showAllBtnText;

  if (shouldShowAll) {
    showAllBtnText = 'Show Less Figure';
  } else {
    showAllBtnText = 'Show All Figure';
  }

  React.useEffect(
    () => {
      if (rawPaperFigures.length > 6 && isMobile && !shouldShowAll) {
        setFinalFigures(rawPaperFigures.slice(0, MOBILE_FIGURES_MAX_LENGTH));
      } else {
        setFinalFigures(rawPaperFigures);
      }
    },
    [isMobile, shouldShowAll, rawPaperFigures]
  );

  const openPaperFigureDetailDialog = React.useCallback(
    (index: number) => {
      return GlobalDialogManager.openPaperFigureDetailDialog(rawPaperFigures, index);
    },
    [rawPaperFigures]
  );

  if (!paper || rawPaperFigures.length === 0) return null;

  const showAllBtn =
    rawPaperFigures.length > 6 ? (
      <button className={styles.showAllBtn} onClick={() => setShouldShowAll(!shouldShowAll)}>
        {showAllBtnText}
      </button>
    ) : null;

  const figureList = finalFigures.map((figure, i) => {
    return (
      <LargePaperFigure figure={figure} key={i} handleOpenFigureDetailDialog={() => openPaperFigureDetailDialog(i)} />
    );
  });

  return (
    <>
      <div className={styles.paperFigureContainer}>
        <div className={styles.paperFigureHeader}>Figures & Tables</div>
        {figureList}
      </div>
      {showAllBtn}
    </>
  );
};

export default withStyles<typeof PaperShowFigureList>(styles)(PaperShowFigureList);
