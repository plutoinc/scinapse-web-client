import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { goToYearFilteredSearchResultPage } from "./helper";
const styles = require("./yearRangeSlider.scss");

interface SliderBubbleProps {
  value: number;
  left: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, value: number) => void;
}

const SliderBubble: React.FunctionComponent<SliderBubbleProps> = props => {
  return (
    <div
      style={{ left: `${props.left}px` }}
      className={styles.sliderBubble}
      onMouseDown={e => {
        props.onMouseDown(e, props.value);
      }}
    >
      <div className={styles.bubbleLabel}>{props.value}</div>
    </div>
  );
};

interface SliderProps extends RouteComponentProps<null> {
  values: number[];
  step: number;
  minValue: number;
  maxValue: number;
  minLimitValue: number;
  setValues: React.Dispatch<React.SetStateAction<number[]>>;
  onSelectingColumn: React.Dispatch<React.SetStateAction<number>>;
}

interface SliderState {
  bubbleNode: HTMLDivElement | null;
  currentBubble: "min" | "max" | null;
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
    const { values, minValue, maxValue, step, minLimitValue } = this.props;

    const bubbles = values.map((cv, i) => {
      return <SliderBubble key={i} left={(cv - minLimitValue) * step} value={cv} onMouseDown={this.handleMouseDown} />;
    });

    const minLeft = (minValue - minLimitValue) * step;
    const maxLeft = (maxValue - minLimitValue) * step;
    const activeLineWidth = maxLeft - minLeft;

    return (
      <div className={styles.slider}>
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
        currentBubble: cv === this.props.minValue ? "min" : "max",
      }));
      document.addEventListener("mousemove", this.handleDragEvent);
      document.addEventListener("mouseup", this.handleMouseUp, { passive: true });
    }
  };

  private handleMouseUp = () => {
    document.removeEventListener("mousemove", this.handleDragEvent);
    document.removeEventListener("mouseup", this.handleMouseUp);
    this.setState(prevState => ({ ...prevState, bubbleNode: null }));
    this.handleDragEnd();
  };

  private handleDragEvent = (e: any) => {
    const { minValue, maxValue } = this.props;
    if (!e.clientX || !this.state.bubbleNode) return;

    const currentYear = new Date().getFullYear();
    const diff = e.clientX - Math.round(this.state.bubbleNode.getBoundingClientRect().left);
    const fromLeft = this.state.bubbleNode.offsetLeft + diff;
    const nextStep = Math.floor(fromLeft / this.props.step);

    let nextValue: number = nextStep + this.props.minLimitValue;
    if (nextValue < this.props.minLimitValue) {
      nextValue = this.props.minLimitValue;
    } else if (nextValue > currentYear) {
      nextValue = currentYear;
    }

    let nextValues: number[] = [];
    if (this.state.currentBubble === "min") {
      nextValues = [Math.min(maxValue, nextValue), maxValue];

      if (nextValue > maxValue) {
        this.setState(prevState => ({ ...prevState, currentBubble: "max" }));
        nextValues = [maxValue, nextValue];
      }
    } else {
      nextValues = [minValue, Math.max(minValue, nextValue)];

      if (nextValue < minValue) {
        this.setState(prevState => ({ ...prevState, currentBubble: "min" }));
        nextValues = [nextValue, minValue];
      }
    }

    this.props.setValues(nextValues);
    this.props.onSelectingColumn(nextValue);
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
