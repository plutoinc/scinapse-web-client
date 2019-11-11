import * as React from 'react';
import { CancelToken } from 'axios';
import { withStyles } from '../../../helpers/withStylesHelper';
import PaperShowReadingNowPapersItem from './readingNowPapersItem';
import { Paper } from '../../../model/paper';
import ReadingPaperAPI from '../../../api/readingPaper';
const styles = require('./readingNowPapers.scss');

const MAXIMUM_COUNT_TO_RENDER = 3;

interface ReadingNowPaperListState {
  paperQueue: Paper[];
  renderingQueue: Paper[];
}

interface ReadingNowPaperListProps {
  paperId: string;
  cancelToken: CancelToken;
}

@withStyles<typeof ReadingNowPaperList>(styles)
class ReadingNowPaperList extends React.PureComponent<ReadingNowPaperListProps, ReadingNowPaperListState> {
  public constructor(props: ReadingNowPaperListProps) {
    super(props);

    this.state = {
      paperQueue: [],
      renderingQueue: [],
    };
  }

  public componentDidMount() {
    this.fetchPaperList();
  }

  public componentWillUnmount() {
    clearInterval(this.intervalRender);
  }

  public render() {
    const { paperQueue, renderingQueue } = this.state;

    if (!paperQueue || paperQueue.length === 0) {
      return null;
    }

    const papers = renderingQueue.map(paper => {
      if (paper) {
        return <PaperShowReadingNowPapersItem actionArea="readingNowPaperList" key={paper.id} paper={paper} />;
      }
    });

    return (
      <div className={styles.readingNowPapers}>
        <div className={styles.sideNavigationBlockHeader}>Researchers Reading Now</div>
        {papers}
      </div>
    );
  }

  private intervalRender = setInterval(() => {
    this.renderNewPaper();
  }, Math.random() * 1800 + 3000);

  private fetchPaperList = async () => {
    const { paperId, cancelToken } = this.props;

    try {
      const papers = await ReadingPaperAPI.getReadingNowPapers({
        paperId,
        cancelToken,
      });
      this.setState(prevState => ({ ...prevState, paperQueue: [...prevState.paperQueue, ...papers] }));
    } catch (err) {
      console.log(err);
    }
  };

  private renderNewPaper = () => {
    if (this.state.paperQueue.length > 0) {
      if (this.state.paperQueue.length < 4) {
        this.fetchPaperList();
      }

      this.setState(prevState => {
        const slicedQueue =
          prevState.renderingQueue.length < MAXIMUM_COUNT_TO_RENDER
            ? prevState.renderingQueue
            : prevState.renderingQueue.slice(0, prevState.renderingQueue.length - 1);
        const renderingQueue = [prevState.paperQueue[0], ...slicedQueue];

        return {
          ...prevState,
          renderingQueue,
          paperQueue: prevState.paperQueue.slice(1),
        };
      });
    }
  };
}

export default ReadingNowPaperList;
