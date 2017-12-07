import * as React from "react";
//Components
import Keywords from "./keywords";
import InfoList from "./infoList";
import Comments from "./comments";
import CommentInput from "./commentInput";
import PublishInfoList from "./publishInfoList";
import Abstract from "./abstract";

import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import { IPaperRecord } from "../../../../model/paper";

// const shave = require("shave").default;
const styles = require("./searchItem.scss");

export interface ISearchItemProps {
  paper: IPaperRecord;
  commentInput: string;
  changeCommentInput: (comment: string) => void;
  isAbstractOpen: Boolean;
  toggleAbstract: () => void;
  isCommentsOpen: Boolean;
  toggleComments: () => void;
  handleCommentPost: () => void;
  isLoading: Boolean;
}

const mockCitedPaperAvgIF = 2.22;
const mockPlutoScore = 234;

class SearchItem extends React.PureComponent<ISearchItemProps, {}> {
  // private restParagraphElement: HTMLDivElement;
  // private restParagraphElementMaxHeight: number;
  // private restParagraphElementClientHeight: number;
  public componentDidMount() {
    // this.restParagraphElementClientHeight = this.restParagraphElement.clientHeight;
    // this.restParagraphElementMaxHeight = 0;
  }

  public render() {
    const {
      isCommentsOpen,
      commentInput,
      isAbstractOpen,
      toggleAbstract,
      changeCommentInput,
      toggleComments,
      handleCommentPost,
      isLoading,
    } = this.props;
    const {
      title,
      venue,
      authors,
      year,
      fosList,
      citedCount,
      referenceCount,
      doi,
      id,
      abstract,
      comments,
      urls,
    } = this.props.paper;

    let source;
    if (!!doi) {
      source = `https://dx.doi.org/${doi}`;
    } else if (urls.size > 0) {
      source = urls.getIn([0, "url"]);
    }

    return (
      <div className={styles.searchItemWrapper}>
        <div className={styles.contentSection}>
          <div className={styles.title}>{title}</div>
          <PublishInfoList journal={venue} year={year} authors={authors} />
          <Abstract abstract={abstract} isAbstractOpen={isAbstractOpen} toggleAbstract={toggleAbstract} />
          <Keywords keywords={fosList} />
          <InfoList
            referenceCount={referenceCount}
            citedCount={citedCount}
            citedPaperAvgIF={mockCitedPaperAvgIF}
            plutoScore={mockPlutoScore}
            source={source}
            DOI={doi}
            articleId={id}
          />
          <Comments comments={comments} isCommentsOpen={isCommentsOpen} />
          <CommentInput
            isLoading={isLoading}
            isCommentsOpen={isCommentsOpen}
            commentCount={comments.size}
            checkAuthDialog={checkAuthDialog}
            commentInput={commentInput}
            changeCommentInput={changeCommentInput}
            toggleComments={toggleComments}
            handleCommentPost={handleCommentPost}
          />
        </div>
      </div>
    );
  }
}

export default SearchItem;
