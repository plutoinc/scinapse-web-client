import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { goToYearFilteredSearchResultPage } from './helper';
import { MIN_YEAR } from './constants';
const styles = require('./yearRangeSlider.scss');

let ticking = false;

interface SliderBubbleProps {
  value: number;
  left: number;
  isNarrow: boolean;
  type: 'min' | 'max';
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, value: number) => void;
}

const SliderBubble: React.FunctionComponent<SliderBubbleProps> = React.memo(props => {
  let labelLeft: number = props.left - 12;
  if (props.isNarrow && props.type === 'min') {
    labelLeft = props.left - 24;
  } else if (props.isNarrow && props.type === 'max') {
    labelLeft = props.left - 2;
  }

  return (
    <>
      <div
        onMouseDown={e => {
          props.onMouseDown(e, props.value);
        }}
        className={styles.sliderBubble}
        style={{ left: `${props.left}px` }}
      />
      <div
        style={{
          left: labelLeft,
        }}
        className={styles.bubbleLabel}
      >
        {props.value}
      </div>
    </>
  );
});

interface SliderProps extends RouteComponentProps<null> {
  values: number[];
  step: number;
  minValue: number;
  maxValue: number;
  setValues: React.Dispatch<React.SetStateAction<number[]>>;
  onSelectingColumn: React.Dispatch<React.SetStateAction<number>>;
}

interface SliderState {
  bubbleNode: HTMLDivElement | null;
  currentBubble: 'min' | 'max' | null;
}

class Slider extends React.PureComponent<SliderProps, SliderState> {
  public constructor(props: SliderProps) {
    super(props);

    this.state = {
      bubbleNode: null,
      currentBubble: null,
    };
  }

  public render() {
    const { values, minValue, maxValue, step } = this.props;

    const bubbles = values.map((cv, i) => {
      return (
        <SliderBubble
          key={i}
          left={(cv - MIN_YEAR) * step}
          value={cv}
          type={cv === minValue ? 'min' : 'max'}
          onMouseDown={this.handleMouseDown}
          isNarrow={maxValue - minValue < 6 && maxValue !== minValue}
        />
      );
    });

    const minLeft = (minValue - MIN_YEAR) * step;
    const maxLeft = (maxValue - MIN_YEAR + 1) * step;
    console.log(minLeft, maxLeft);
    const currentYear = new Date().getFullYear();
    const activeLineWidth = maxLeft - minLeft;

    return (
      <div style={{ width: `${(currentYear - MIN_YEAR + 1) * step}px` }} className={styles.slider}>
        <div style={{ left: `${minLeft}px`, width: `${activeLineWidth}px` }} className={styles.activeLine} />
        {bubbles}
      </div>
    );
  }

  private handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, cv: number) => {
    if (!this.state.bubbleNode) {
      const target = e.target as HTMLDivElement;
      this.setState(prevState => ({
        ...prevState,
        bubbleNode: target,
        currentBubble: cv === this.props.minValue ? 'min' : 'max',
      }));
      ticking = false;
      document.addEventListener('mousemove', this.handleDragEvent);
      document.addEventListener('mouseup', this.handleMouseUp, { passive: true });
    }
  };

  private handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleDragEvent);
    document.removeEventListener('mouseup', this.handleMouseUp);
    this.setState(prevState => ({ ...prevState, bubbleNode: null }));
    this.handleDragEnd();
  };

  private handleDragEvent = (e: any) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (!e.clientX || !this.state.bubbleNode) return;

        const { minValue, maxValue } = this.props;
        const currentYear = new Date().getFullYear();
        const diff = e.clientX - Math.round(this.state.bubbleNode.getBoundingClientRect().left);
        const fromLeft = this.state.bubbleNode.offsetLeft + diff;
        const nextStep = Math.floor(fromLeft / this.props.step);

        let nextValue: number = nextStep + MIN_YEAR;
        if (nextValue < MIN_YEAR) {
          nextValue = MIN_YEAR;
        } else if (nextValue > currentYear) {
          nextValue = currentYear;
        }

        let nextValues: number[] = [];
        if (this.state.currentBubble === 'min') {
          nextValues = [Math.min(maxValue, nextValue), maxValue];

          if (nextValue > maxValue) {
            this.setState(prevState => ({ ...prevState, currentBubble: 'max' }));
            nextValues = [maxValue, nextValue];
          }
        } else {
          nextValues = [minValue, Math.max(minValue, nextValue)];

          if (nextValue < minValue) {
            this.setState(prevState => ({ ...prevState, currentBubble: 'min' }));
            nextValues = [nextValue, minValue];
          }
        }

        this.props.setValues(nextValues);
        this.props.onSelectingColumn(nextValue);
        ticking = false;
      });
      ticking = true;
    }
  };

  private handleDragEnd = () => {
    const { location, minValue, maxValue, history, onSelectingColumn } = this.props;
    onSelectingColumn(0);
    goToYearFilteredSearchResultPage({
      qs: location.search,
      min: minValue,
      max: maxValue,
      history,
    });
  };
}

export default withRouter(Slider);
