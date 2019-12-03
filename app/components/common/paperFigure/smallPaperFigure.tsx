import React from 'react';
import classNames from 'classnames';
import { PaperFigure } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import { FIGURE_PREFIX } from '../../../constants/paperFigure';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';

const styles = require('./smallPaperFigure.scss');

interface SmallPaperFigureProps {
  figure: PaperFigure;
  handleOpenFigureDetailDialog: () => void;
}

const SmallPaperFigure: React.FC<SmallPaperFigureProps> = ({ figure, handleOpenFigureDetailDialog }) => {
  return (
    <div className={styles.figureImageWrapper} onClick={handleOpenFigureDetailDialog}>
      <div className={styles.figureImageBackground} />
      <picture>
        <source data-srcset={`${FIGURE_PREFIX}${figure.path}`} type="image/jpeg" />
        <img
          className={classNames([styles.figureImage, 'lazyload'])}
          data-sizes="auto"
          data-src={`${FIGURE_PREFIX}${figure.path}`}
          alt={'paperFigureImage'}
        />
      </picture>
    </div>
  );
};

export default withStyles<typeof SmallPaperFigure>(styles)(SmallPaperFigure);
