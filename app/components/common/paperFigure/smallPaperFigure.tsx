import React from 'react';
import { PaperFigure } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import { FIGURE_PREFIX } from '../../../constants/paperFigure';
import LazyImage from '../lazyImage';

const styles = require('./smallPaperFigure.scss');

interface SmallPaperFigureProps {
  figure: PaperFigure;
  handleOpenFigureDetailDialog: () => void;
}

const SmallPaperFigure: React.FC<SmallPaperFigureProps> = ({ figure, handleOpenFigureDetailDialog }) => {
  return (
    <div className={styles.figureImageWrapper} onClick={handleOpenFigureDetailDialog}>
      <div className={styles.figureImageBackground} />
      <LazyImage
        src={`${FIGURE_PREFIX}${figure.path}`}
        imgClassName={styles.figureImage}
        loading="lazy"
        alt={'paperFigureImage'}
      />
    </div>
  );
};

export default withStyles<typeof SmallPaperFigure>(styles)(SmallPaperFigure);
