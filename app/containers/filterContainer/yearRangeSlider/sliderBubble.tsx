import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import PapersQueryFormatter, { SearchPageQueryParamsObject } from "../../../helpers/papersQueryFormatter";
import getQueryParamsObject from "../../../helpers/getQueryParamsObject";
import { SearchPageQueryParams } from "../../../components/articleSearch/types";
const styles = require("./yearRangeSlider.scss");

interface SliderBubbleProps extends RouteComponentProps<null> {
  value: number;
  left: number;
  step: number;
  min: number;
  max: number;
  minLimitValue: number;
  isDragging: boolean;
  setValues: React.Dispatch<React.SetStateAction<number[]>>;
  onSelectingColumn: React.Dispatch<React.SetStateAction<number>>;
  onDrag: React.Dispatch<React.SetStateAction<boolean>>;
}

class SliderBubble extends React.PureComponent<SliderBubbleProps> {
  private bubbleNode: HTMLDivElement | null = null;

  public componentDidMount() {
    if (this.bubbleNode) {
      document.addEventListener("mousedown", this.handleMouseDown, { passive: true });
      document.addEventListener("mouseup", this.handleMouseUp, { passive: true });
    }
  }

  public componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleMouseDown);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  public render() {
    return (
      <div ref={el => (this.bubbleNode = el)} style={{ left: `${this.props.left}px` }} className={styles.sliderBubble}>
        <div className={styles.bubbleLabel}>{this.props.value}</div>
      </div>
    );
  }

  private handleMouseDown = (e: any) => {
    if (!this.props.isDragging && this.bubbleNode && e.target === this.bubbleNode) {
      this.props.onDrag(true);
      document.addEventListener("mousemove", this.handleDragEvent);
    }
  };

  private handleMouseUp = () => {
    document.removeEventListener("mousemove", this.handleDragEvent);
    this.props.onDrag(false);
    this.handleDragEnd();
  };

  private handleDragEvent = (e: any) => {
    if (!e.screenX || !this.bubbleNode) return;

    const currentYear = new Date().getFullYear();
    const diff = e.screenX - Math.round(this.bubbleNode.getBoundingClientRect().left);
    const fromLeft = this.bubbleNode.offsetLeft + diff;
    const nextStep = Math.floor(fromLeft / this.props.step);

    let nextValue: number = nextStep + this.props.minLimitValue;
    if (nextValue < this.props.minLimitValue) {
      nextValue = this.props.minLimitValue;
    } else if (nextValue > currentYear) {
      nextValue = currentYear;
    }

    let nextValues: number[] =
      nextValue > this.props.min ? [this.props.min, nextValue] : [this.props.min, this.props.min + 1];
    if (this.props.value === this.props.min) {
      nextValues = nextValue < this.props.max ? [nextValue, this.props.max] : [this.props.max - 1, this.props.max];
    }

    this.props.setValues(nextValues);
    this.props.onSelectingColumn(nextValue);
  };

  private handleDragEnd = () => {
    this.props.onSelectingColumn(0);

    const qp: SearchPageQueryParams = getQueryParamsObject(this.props.location.search);
    const filter = PapersQueryFormatter.objectifyPapersFilter(qp.filter);
    const newFilter = { ...filter, yearFrom: this.props.min, yearTo: this.props.max };
    const newQP: SearchPageQueryParamsObject = {
      query: qp.query || "",
      filter: newFilter,
      page: parseInt(qp.page || "1", 10),
      sort: qp.sort || "RELEVANCE",
    };
    const newSearch = PapersQueryFormatter.stringifyPapersQuery(newQP);
    this.props.history.push({
      pathname: `/search`,
      search: newSearch,
    });
  };
}

export default withRouter(SliderBubble);
