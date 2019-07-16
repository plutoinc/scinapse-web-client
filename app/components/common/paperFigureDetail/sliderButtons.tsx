import React from 'react';
import * as classNames from 'classnames';
import Icon from '../../../icons';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./paperFigureDetail.scss');

interface SliderButtonsProps {
  isMobile: boolean;
  handleClickPrevBtn: () => void;
  handleClickNextBtn: () => void;
}

const SliderButtons: React.FC<SliderButtonsProps> = props => {
  const { isMobile, handleClickPrevBtn, handleClickNextBtn } = props;

  let prevBtnContext;
  let nextBtnContext;

  if (isMobile) {
    prevBtnContext = (
      <>
        <Icon icon="ARROW_RIGHT" className={styles.prevIcon} />
        PREV
      </>
    );
    nextBtnContext = (
      <>
        NEXT
        <Icon icon="ARROW_RIGHT" className={styles.nextIcon} />
      </>
    );
  } else {
    prevBtnContext = <Icon icon="ARROW_RIGHT" className={styles.prevIcon} />;
    nextBtnContext = <Icon icon="ARROW_RIGHT" className={styles.nextIcon} />;
  }

  return (
    <div
      className={classNames({
        [styles.sliderBtnWrapper]: !isMobile,
        [styles.mobileSliderBtnWrapper]: isMobile,
      })}
    >
      <button
        className={classNames({
          [styles.prevBtn]: !isMobile,
          [styles.mobileSliderBtn]: isMobile,
        })}
        onClick={handleClickPrevBtn}
      >
        {prevBtnContext}
      </button>
      <button
        className={classNames({
          [styles.nextBtn]: !isMobile,
          [styles.mobileSliderBtn]: isMobile,
        })}
        onClick={handleClickNextBtn}
      >
        {nextBtnContext}
      </button>
    </div>
  );
};

export default withStyles<typeof SliderButtons>(styles)(SliderButtons);
