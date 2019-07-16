import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../reducers';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import { UserDevice } from '../../layouts/records';
import SliderButtons from './sliderButtons';
const styles = require('./paperFigureDetail.scss');
const FIGURE_PREFIX = 'https://asset-pdf.scinapse.io/';

type Props = ReturnType<typeof mapStateToProps> & { handleCloseDialogRequest: () => void };

const PaperFigureDetail: React.FC<Props> = props => {
  const { DialogState, handleCloseDialogRequest } = props;
  const { paperFigures, currentPaperFigureIndex } = DialogState;
  const [showFigureIndex, setShowFigureIndex] = React.useState(currentPaperFigureIndex!);

  const onClickPrevBtn = React.useCallback(
    () => {
      if (showFigureIndex === 0) {
        setShowFigureIndex(paperFigures!.length - 1);
      } else {
        setShowFigureIndex(showFigureIndex - 1);
      }
    },
    [paperFigures, showFigureIndex]
  );

  const onClickNextBtn = React.useCallback(
    () => {
      if (showFigureIndex === paperFigures!.length - 1) {
        setShowFigureIndex(0);
      } else {
        setShowFigureIndex(showFigureIndex + 1);
      }
    },
    [paperFigures, showFigureIndex]
  );

  if (!paperFigures) return null;

  const currentFigure = paperFigures[showFigureIndex];

  return (
    <div className={styles.paperFigureDetailContainer}>
      <div onClick={handleCloseDialogRequest} className={styles.closeButtonWrapper}>
        <Icon icon="X_BUTTON" className={styles.closeButtonIcon} />
      </div>
      <div className={styles.figureDetailImageWrapper}>
        <picture>
          <source srcSet={`${FIGURE_PREFIX}${currentFigure.path}`} type="image/jpeg" />
          <img
            className={styles.figureDetailImage}
            src={`${FIGURE_PREFIX}${currentFigure.path}`}
            alt={'paperFigureImage'}
          />
        </picture>
      </div>
      <div className={styles.figureDetailCaption}>{currentFigure.caption}</div>
      <SliderButtons
        isMobile={props.layout.userDevice !== UserDevice.DESKTOP}
        handleClickPrevBtn={onClickPrevBtn}
        handleClickNextBtn={onClickNextBtn}
      />
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    DialogState: state.dialog,
  };
}

export default connect(mapStateToProps)(withStyles<typeof PaperFigureDetail>(styles)(PaperFigureDetail));
