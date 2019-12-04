import React from 'react';
import { PaperFigure } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import { FIGURE_PREFIX } from '../../../constants/paperFigure';
import LazyImage from '../lazyImage';

const styles = require('./largePaperFigure.scss');

const MAX_LENGTH_OF_CAPTION = 80;

interface LargePaperFigureProps {
  figure: PaperFigure;
  handleOpenFigureDetailDialog: () => void;
}

const LargePaperFigure: React.FC<LargePaperFigureProps> = ({ figure, handleOpenFigureDetailDialog }) => {
  let finalCaption;

  if (figure.caption.length > MAX_LENGTH_OF_CAPTION) {
    finalCaption = figure.caption.slice(0, MAX_LENGTH_OF_CAPTION) + '...';
  } else {
    finalCaption = figure.caption;
  }

  return (
    <div className={styles.figureContainer}>
      <div className={styles.figureImageWrapper} onClick={handleOpenFigureDetailDialog}>
        <div className={styles.figureImageBackground} />
        <LazyImage
          src={`${FIGURE_PREFIX}${figure.path}`}
          imgClassName={styles.figureImage}
          loading="lazy"
          alt={'paperFigureImage'}
        />
      </div>
      <div className={styles.figureCaption}>
        <span>{finalCaption}</span>
      </div>
    </div>
  );
};

export default withStyles<typeof LargePaperFigure>(styles)(LargePaperFigure);
