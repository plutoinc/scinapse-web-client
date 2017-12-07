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
}

const mockReferenceCount = 3;
const mockCitedPaperAvgIF = 2.22;
const mockPlutoScore = 234;
const mockSource = "https://pluto.network";

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
    } = this.props;
    const { title, venue, authors, year, fosList, citation, doi, id, abstract, comments } = this.props.paper;
    return (
      <div className={styles.searchItemWrapper}>
        <div className={styles.contentSection}>
          <div className={styles.title}>{title}</div>
          <PublishInfoList journal={venue} year={year} authors={authors} />
          <Abstract abstract={abstract} isAbstractOpen={isAbstractOpen} toggleAbstract={toggleAbstract} />
          <Keywords keywords={fosList} />
          <InfoList
            referenceCount={mockReferenceCount}
            citedCount={citation}
            citedPaperAvgIF={mockCitedPaperAvgIF}
            plutoScore={mockPlutoScore}
            source={mockSource}
            DOI={doi}
            articleId={id}
          />
          <Comments comments={comments} isCommentsOpen={isCommentsOpen} />
          <CommentInput
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
