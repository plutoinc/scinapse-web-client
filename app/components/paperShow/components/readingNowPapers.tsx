import * as React from "react";
import { createSelector } from "reselect";
import { connect, Dispatch } from "react-redux";
import { withStyles } from "../../../helpers/withStylesHelper";
import PaperShowReadingNowPapersItem from "./readingNowPapersItem";
import { Paper } from "../../../model/paper";
import { AppState } from "../../../reducers";
import { getPaperEntities, getDenormalizedPapers } from "../../../selectors/papersSelector";
import { CancelToken } from "axios";
import { getReadingNowPapers } from "../../../actions/paperShow";
const styles = require("./readingNowPapers.scss");

interface ReadingNowPaperListState {
  readingPaperList: Paper[];
}

interface ReadingNowPaperListProps {
  paperList: Paper[];
  paperId: number;
  cancelToken: CancelToken;
  dispatch: Dispatch<any>;
}

@withStyles<typeof ReadingNowPaperList>(styles)
class ReadingNowPaperList extends React.PureComponent<ReadingNowPaperListProps, ReadingNowPaperListState> {
  constructor(props: ReadingNowPaperListProps) {
    super(props);
    this.state = { readingPaperList: [this.props.paperList[0]] };
  }

  public componentDidMount() {
    const { paperList } = this.props;

    const rawPaperList = paperList;
    let calculatedPaperList: Paper[] = [];

    setInterval(() => {
      calculatedPaperList = this.getCalculatedReadingPaperList(rawPaperList.splice(0, 1), calculatedPaperList);
      console.log(paperList);
      this.setState({ readingPaperList: calculatedPaperList });
      // if (startIndex === 0) {
      //   this.setState({ readingPaperList: calculatedPaperList });
      // } else if (startIndex === 1) {
      //   this.setState({ readingPaperList: paperList.slice(0, startIndex + 1).reverse() });
      //   startIndex++;
      // } else {
      //   this.setState({ readingPaperList: paperList.slice(startIndex - 2, startIndex + 1).reverse() });
      //   startIndex++;
      // }

      // if (startIndex + 2 === paperList.length) {
      //   startIndex = 0;
      //   dispatch(getReadingNowPapers({ paperId, cancelToken }));
      // }
    }, Math.random() * 1800 + 1200);
  }

  public render() {
    const { readingPaperList } = this.state;
    const { paperList } = this.props;

    if (!paperList || paperList.length === 0) {
      return null;
    }

    const papers = readingPaperList.map((paper, index) => {
      if (paper) {
        return (
          <PaperShowReadingNowPapersItem index={index} actionArea="readingNowPaperList" key={paper.id} paper={paper} />
        );
      }
    });

    return (
      <div className={styles.readingNowPapers}>
        <div className={styles.sideNavigationBlockHeader}>Researchers Reading Now</div>
        {papers}
      </div>
    );
  }

  private getCalculatedReadingPaperList = (newPaper: Paper[], calculatedPaperList: Paper[]) => {
    if (newPaper) {
      switch (calculatedPaperList.length) {
        case 0 || 1 || 2:
          calculatedPaperList.push(newPaper[0]);
          return calculatedPaperList;
        default:
          return calculatedPaperList;
      }
    }
    return calculatedPaperList;
  };
}

function getPaperIds(state: AppState) {
  return state.paperShow.readingNowPaperIds;
}

const getMemoizedRelatedPapers = createSelector([getPaperIds, getPaperEntities], getDenormalizedPapers);

function mapStateToProps(state: AppState) {
  return {
    paperList: getMemoizedRelatedPapers(state),
  };
}

export default connect(mapStateToProps)(ReadingNowPaperList);
