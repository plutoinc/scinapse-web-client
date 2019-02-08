import * as React from "react";
import { Dispatch } from "react-redux";
import { CancelToken } from "axios";
import { withStyles } from "../../../helpers/withStylesHelper";
import PaperShowReadingNowPapersItem from "./readingNowPapersItem";
import { Paper } from "../../../model/paper";
import { getReadingNowPapers } from "../../../actions/paperShow";
const styles = require("./readingNowPapers.scss");

interface ReadingNowPaperListState {
  paperQueue: Paper[];
  renderingQueue: Paper[];
}

interface ReadingNowPaperListProps {
  paperId: number;
  cancelToken: CancelToken;
  dispatch: Dispatch<any>;
}

@withStyles<typeof ReadingNowPaperList>(styles)
class ReadingNowPaperList extends React.PureComponent<ReadingNowPaperListProps, ReadingNowPaperListState> {
  constructor(props: ReadingNowPaperListProps) {
    super(props);

    this.state = {
      paperQueue: [],
      renderingQueue: [],
    };
  }

  public componentDidMount() {
    console.log("================== CALL COMPONENTDIDMOUNT ==================");
    // const { paperList, dispatch, paperId, cancelToken } = this.props;
    // let startIndex = 0;

    // setInterval(() => {
    //   if (startIndex === 0) {
    //     this.setState({ readingPaperList: [paperList[startIndex++]] });
    //   } else if (startIndex === 1) {
    //     this.setState({ readingPaperList: paperList.slice(0, startIndex + 1).reverse() });
    //     startIndex++;
    //   } else {
    //     this.setState({ readingPaperList: paperList.slice(startIndex - 2, startIndex + 1).reverse() });
    //     startIndex++;
    //   }

    //   if (startIndex + 2 === paperList.length) {
    //     startIndex = 0;
    //     dispatch(getReadingNowPapers({ paperId, cancelToken }));
    //   }
    // }, Math.random() * 1800 + 1200);
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
}

export default ReadingNowPaperList;
