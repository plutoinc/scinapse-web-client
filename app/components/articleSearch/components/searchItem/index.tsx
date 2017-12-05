import * as React from "react";
import { List } from "immutable";
//Components
import Keywords from "./keywords";
import InfoList from "./infoList";
import Comments from "./comments";
import CommentInput from "./commentInput";
import PublishInfoList from "./PublishInfoList";

import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import { recordifyComment, ICommentRecord } from "../../../../model/comment";
import { recordifyMember } from "../../../../model/member";
import { IPaperRecord } from "../../../../model/paper";

// const shave = require("shave").default;
const styles = require("./searchItem.scss");

export interface ISearchItemProps {
  paper: IPaperRecord;
}

export interface ISearchItemStates {
  isContentOpen: Boolean;
  isCommentsOpen: Boolean;
  commentInput: string;
}

const mockReferenceCount = 3;
const mockCitedPaperAvgIF = 2.22;
const mockPlutoScore = 234;
const mockSource = "https://pluto.network";
const mockCommentCreatedBy = recordifyMember({
  id: null,
  email: null,
  name: "Mathilda Potter fdsjfdshfjkdhfjdksh",
  profileImage: null,
  institution: "Indian Institute of Technologydfsdfsjfdlfsdjklfsdjlkj",
  major: null,
  reputation: null,
  articleCount: 0,
  reviewCount: 0,
  commentCount: 0,
});
const mockComment: ICommentRecord = recordifyComment({
  id: null,
  reviewId: null,
  createdAt: null,
  createdBy: mockCommentCreatedBy,
  comment: `A novel electrochemical cell based on a CaF2 solid-state electrolyte has been developed to measure the electromotive force (emf) of binary alkaline earth-liquid metal alloys as functions of both composition and temperature.`,
});
const mockComments = List([mockComment, mockComment, mockComment]);

class SearchItem extends React.PureComponent<ISearchItemProps, ISearchItemStates> {
  // private restParagraphElement: HTMLDivElement;
  // private restParagraphElementMaxHeight: number;
  // private restParagraphElementClientHeight: number;

  public constructor(props: ISearchItemProps) {
    super(props);

    this.state = {
      isContentOpen: false,
      isCommentsOpen: false,
      commentInput: "",
    };
  }

  public componentDidMount() {
    // this.restParagraphElementClientHeight = this.restParagraphElement.clientHeight;
    // this.restParagraphElementMaxHeight = 0;
  }

  private getAbstract = (abstract: string) => {
    console.log(abstract);
    if (abstract === null) return null;

    const restParagraphStartIndex = abstract.indexOf("\n");
    const firstParagraph = abstract.substring(0, restParagraphStartIndex);
    const restParagraph = abstract.substring(restParagraphStartIndex);

    // if (this.state.isContentOpen) {
    //   this.restParagraphElementMaxHeight = this.restParagraphElementClientHeight;
    // } else {
    //   this.restParagraphElementMaxHeight = 0;
    // }

    return (
      <div className={styles.content}>
        <span>{firstParagraph}</span>
        {!this.state.isContentOpen ? (
          <span
            className={styles.contentToggleButton}
            onClick={() => {
              this.setState({
                isContentOpen: !this.state.isContentOpen,
              });
            }}
          >
            ...(More)
          </span>
        ) : null}
        <div
          className={styles.restParagraph}
          // style={
          //   !!this.restParagraphElementClientHeight
          //     ? {
          //         maxHeight: `${this.restParagraphElementMaxHeight}px`,
          //       }
          //     : null
          // }
          // ref={r => {
          //   this.restParagraphElement = r;
          // }}
        >
          {restParagraph}
          <span
            className={styles.contentToggleButton}
            onClick={() => {
              this.setState({
                isContentOpen: !this.state.isContentOpen,
              });
            }}
          >
            (Less)
          </span>
        </div>
      </div>
    );
  };

  private toggleComments = () => {
    this.setState({
      isCommentsOpen: !this.state.isCommentsOpen,
    });
  };

  private changeCommentInput = (commentInput: string) => {
    this.setState({ commentInput });
  };

  public render() {
    const { title, venue, authors, year, fosList, citation, doi, id, abstract } = this.props.paper;

    return (
      <div className={styles.searchItemWrapper}>
        <div className={styles.contentSection}>
          <div className={styles.title}>{title}</div>
          <PublishInfoList journal={venue} year={year} authors={authors} />
          {this.getAbstract(abstract)}
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
          <Comments comments={mockComments} isCommentsOpen={this.state.isCommentsOpen} />
          <CommentInput
            isCommentsOpen={this.state.isCommentsOpen}
            commentCount={mockComments.size}
            checkAuthDialog={checkAuthDialog}
            commentInput={this.state.commentInput}
            changeCommentInput={this.changeCommentInput}
            toggleComments={this.toggleComments}
          />
        </div>
      </div>
    );
  }
}

export default SearchItem;
