import * as React from "react";
import { CancelToken } from "axios";
import { withStyles } from "../../../helpers/withStylesHelper";
import PaperShowReadingNowPapersItem from "./readingNowPapersItem";
import { Paper } from "../../../model/paper";
import PaperAPI from "../../../api/paper";
const styles = require("./readingNowPapers.scss");

interface ReadingNowPaperListState {
  page: number;
  rawPaperList: Paper[];
  paperListToShow: Paper[];
}

interface ReadingNowPaperListProps {
  paperId: number;
  cancelToken: CancelToken;
}

@withStyles<typeof ReadingNowPaperList>(styles)
class ReadingNowPaperList extends React.PureComponent<ReadingNowPaperListProps, ReadingNowPaperListState> {
  constructor(props: ReadingNowPaperListProps) {
    super(props);
    this.state = {
      page: 0,
      rawPaperList: [],
      paperListToShow: [],
    };
  }

  public componentDidMount() {
    // 1. isFirstCall true / index 0 - > 1개
    // 2. isFirstCall true / index 1 - > 2개
    // 3. 그게 아니면 3개씩
    // 4. isFirstCall false 면 무조건 3개
    const { paperId } = this.props;
    this.fetchReadingNowPaperList(paperId);

    setInterval(() => {
      this.setState(prevState => {
        if (prevState.paperListToShow.length <= 2) {
          return {
            ...prevState,
            paperListToShow: prevState.rawPaperList.slice(0, prevState.paperListToShow.length + 1),
          };
        } else {
          const index = prevState.rawPaperList.findIndex(paper => {
            return paper.id === prevState.paperListToShow[0].id;
          });

          if (index === prevState.rawPaperList.length - 3 - 1) {
            this.fetchReadingNowPaperList(paperId);
          }

          return {
            ...prevState,
            rawPaperList: prevState.rawPaperList.slice(1),
            paperListToShow: prevState.rawPaperList.slice(index + 1, index + 3 + 1),
          };
        }
      });
    }, Math.random() * 1800 + 1200);
  }

  // public componentWillUnmount() {
  //   //TODO: clear Interval
  // }

  public render() {
    const { paperListToShow } = this.state;
    console.log(paperListToShow);

    // if (!paperList || paperList.length === 0) {
    //   return null;
    // }

    const papers = paperListToShow.map((paper, index) => {
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

  private fetchReadingNowPaperList = async (paperId: number) => {
    const { cancelToken } = this.props;

    try {
      const papers = await PaperAPI.getReadingNowPapers({ paperId, cancelToken });
      console.log(papers);
      this.setState(prevState => ({
        ...prevState,
        page: prevState.page + 1,
        rawPaperList: [...prevState.rawPaperList, ...papers],
      }));
    } catch (err) {
      console.log(err);
    }
  };
}

export default ReadingNowPaperList;
