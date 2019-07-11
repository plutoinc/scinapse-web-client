import React from 'react';
import { PaperFigure } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./largePaperFigure.scss');
const FIGURE_PREFIX = 'https://asset-pdf.scinapse.io/';
const MAX_LENGTH_OF_CAPTION = 80;

interface LargePaperFigureProps {
  figure: PaperFigure;
}

const LargePaperFigure: React.FC<LargePaperFigureProps> = ({ figure }) => {
  let finalCaption;

  if (figure.caption.length > MAX_LENGTH_OF_CAPTION) {
    finalCaption = figure.caption.slice(0, MAX_LENGTH_OF_CAPTION) + '...';
  } else {
    finalCaption = figure.caption;
  }

  return (
    <div className={styles.figureContainer}>
      <div className={styles.figureImageWrapper}>
        <div className={styles.figureImageBackground} />
        <picture>
          <source srcSet={`${FIGURE_PREFIX}${figure.path}`} type="image/jpeg" />
          <img className={styles.figureImage} src={`${FIGURE_PREFIX}${figure.path}`} alt={'paperFigureImage'} />
        </picture>
      </div>
      <div className={styles.figureCaption}>
        <span>{finalCaption}</span>
      </div>
    </div>
  );
};

export default withStyles<typeof LargePaperFigure>(styles)(LargePaperFigure);
