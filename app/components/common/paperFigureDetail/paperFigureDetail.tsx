import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../reducers';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import { UserDevice } from '../../layouts/records';
import SliderButtons from './sliderButtons';
import { FIGURE_PREFIX } from '../../../constants/paperFigure';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';
const styles = require('./paperFigureDetail.scss');

const MAX_LENGTH_OF_MOBILE_CAPTION = 250;

type Props = ReturnType<typeof mapStateToProps> & { handleCloseDialogRequest: () => void };

const PaperFigureCaption: React.FC<{ isMobile: boolean; caption: string }> = props => {
  const { isMobile, caption } = props;
  const [shouldShowMoreCaption, setShouldShowMoreCaption] = React.useState(false);

  if (!isMobile) return <div className={styles.figureDetailCaption}>{caption}</div>;
  let truncatedCaption;

  if (caption.length > MAX_LENGTH_OF_MOBILE_CAPTION) {
    truncatedCaption = caption.slice(0, MAX_LENGTH_OF_MOBILE_CAPTION) + '...';
  } else {
    truncatedCaption = caption;
  }

  const finalCaption = shouldShowMoreCaption ? caption : truncatedCaption;

  return (
    <div className={styles.figureDetailCaption}>
      {finalCaption}
      <label
        className={styles.moreOrLess}
        onClick={() => {
          setShouldShowMoreCaption(!shouldShowMoreCaption);
        }}
      >
        {caption.length > MAX_LENGTH_OF_MOBILE_CAPTION && (
          <div className={styles.moreOrLess}>{shouldShowMoreCaption ? <span>less</span> : <span>more</span>}</div>
        )}
      </label>
    </div>
  );
};

const PaperFigureDetail: React.FC<Props> = props => {
  const { layout, DialogState, handleCloseDialogRequest } = props;
  const { paperFigures, currentPaperFigureIndex, viewDetailFigureTargetPaperId } = DialogState;
  const paperFigureEl = React.useRef<HTMLDivElement | null>(null);

  const [showFigureIndex, setShowFigureIndex] = React.useState(currentPaperFigureIndex!);

  React.useEffect(() => {
    paperFigureEl.current && paperFigureEl.current.focus();
  }, []);

  const onClickPrevBtn = React.useCallback(
    () => {
      ActionTicketManager.trackTicket({
        pageType: getCurrentPageType(),
        actionType: 'fire',
        actionArea: 'figureDetail',
        actionTag: 'clickPrevBtn',
        actionLabel: String(viewDetailFigureTargetPaperId!),
      });

      const figuresLength = paperFigures!.length;
      const nextFigureIndex = (figuresLength + showFigureIndex - 1) % figuresLength;
      setShowFigureIndex(nextFigureIndex);
    },
    [paperFigures, showFigureIndex, viewDetailFigureTargetPaperId]
  );

  const onClickNextBtn = React.useCallback(
    () => {
      ActionTicketManager.trackTicket({
        pageType: getCurrentPageType(),
        actionType: 'fire',
        actionArea: 'figureDetail',
        actionTag: 'clickNextBtn',
        actionLabel: String(viewDetailFigureTargetPaperId!),
      });

      const figuresLength = paperFigures!.length;
      const nextFigureIndex = (figuresLength + showFigureIndex + 1) % figuresLength;
      setShowFigureIndex(nextFigureIndex);
    },
    [paperFigures, showFigureIndex, viewDetailFigureTargetPaperId]
  );

  const onKeyDownInFigureContainer = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.keyCode) {
        case 37: {
          // left
          onClickPrevBtn();
          break;
        }

        case 39: {
          // right
          onClickNextBtn();
          break;
        }

        default:
          break;
      }
    },
    [onClickPrevBtn, onClickNextBtn]
  );

  if (!paperFigures) return null;

  const currentFigure = paperFigures[showFigureIndex];

  return (
    <div
      className={styles.paperFigureDetailContainer}
      ref={paperFigureEl}
      tabIndex={1}
      onKeyDown={onKeyDownInFigureContainer}
    >
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
      <PaperFigureCaption isMobile={layout.userDevice !== UserDevice.DESKTOP} caption={currentFigure.caption} />
      <SliderButtons
        isMobile={layout.userDevice !== UserDevice.DESKTOP}
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
