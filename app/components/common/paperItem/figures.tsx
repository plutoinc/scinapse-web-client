import React from 'react';
import { PaperFigure } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import SmallPaperFigure from '../paperFigure/smallPaperFigure';
import { openPaperFigureDetailDialog } from '../../../constants/paperFigure';
const styles = require('./figures.scss');
const MAX_FIGURE_SHOW_LENGTH = 8;

interface FiguresProps {
  figures: PaperFigure[];
}

const Figures: React.FC<FiguresProps> = ({ figures }) => {
  if (figures.length === 0) return null;

  const finalFigures = figures.slice(0, MAX_FIGURE_SHOW_LENGTH);

  const figureList = finalFigures.map((figure, i) => (
    <SmallPaperFigure
      figure={figure}
      key={i}
      handleOpenFigureDetailDialog={() => openPaperFigureDetailDialog(finalFigures, i)}
    />
  ));

  return <div className={styles.smallPaperFiguresContainer}>{figureList}</div>;
};

export default withStyles<typeof Figures>(styles)(Figures);
