import React from 'react';
import { PaperFigure } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./smallPaperFigure.scss');
const FIGURE_PREFIX = 'https://asset-pdf.scinapse.io/';

interface SmallPaperFigureProps {
  figure: PaperFigure;
  handleOpenFigureDetailDialog: () => void;
}

const SmallPaperFigure: React.FC<SmallPaperFigureProps> = ({ figure, handleOpenFigureDetailDialog }) => {
  return (
    <>
      <div className={styles.figureImageWrapper} onClick={handleOpenFigureDetailDialog}>
        <div className={styles.figureImageBackground} />
        <picture>
          <source srcSet={`${FIGURE_PREFIX}${figure.path}`} type="image/jpeg" />
          <img className={styles.figureImage} src={`${FIGURE_PREFIX}${figure.path}`} alt={'paperFigureImage'} />
        </picture>
      </div>
    </>
  );
};

export default withStyles<typeof SmallPaperFigure>(styles)(SmallPaperFigure);
