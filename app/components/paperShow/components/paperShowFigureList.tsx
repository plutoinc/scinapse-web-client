import React from 'react';
import { Paper } from '../../../model/paper';
import LargePaperFigure from '../../common/paperFigure/largePaperFigure';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./paperShowFigureList.scss');

const PaperShowFigureList: React.FC<{ paper: Paper }> = ({ paper }) => {
  if (!paper || paper.figures.length === 0) return null;

  const figureList = paper.figures.map((figure, i) => {
    return <LargePaperFigure figure={figure} key={i} />;
  });

  return (
    <div className={styles.paperFigureContainer}>
      <div className={styles.paperFigureHeader}>Figure</div>
      {figureList}
    </div>
  );
};

export default withStyles<typeof PaperShowFigureList>(styles)(PaperShowFigureList);
