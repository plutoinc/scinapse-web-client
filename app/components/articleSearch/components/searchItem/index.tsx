import * as React from "react";
import { IArticleRecord } from "../../../../model/article";
//Components
import Authors from "./authors";
import Keywords from "./keywords";
import InfoList from "./infoList";
import Comments from "./comments";
import CommentInput from "./commentInput";

import { trackAndOpenLink } from "../../../../helpers/handleGA";
import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import { List } from "immutable";
import { recordifyAuthor, IAuthorRecord } from "../../../../model/author";
import { recordifyComment, ICommentRecord } from "../../../../model/comment";
import { recordifyMember } from "../../../../model/member";

// const shave = require("shave").default;
const styles = require("./searchItem.scss");

export interface ISearchItemProps {
  article: IArticleRecord;
}

export interface ISearchItemStates {
  isContentOpen: Boolean;
  isCommentsOpen: Boolean;
  commentInput: string;
}

const mockAuthor: IAuthorRecord = recordifyAuthor({
  id: 332,
  type: null,
  institution: "University of Washington",
  name: "Darning Shan",
  hIndex: 11,
  member: null,
});
const mockAuthors: List<IAuthorRecord> = List([mockAuthor, mockAuthor, mockAuthor]);
const mockKeywords: List<string> = List(["Apoptosis", "test", "test2", "test3"]);
const mockReferenceCount = 3;
const mockCitedCount = 4;
const mockCitedPaperAvgIF = 2.22;
const mockPlutoScore = 234;
const mockSource = "https://pluto.network";
const mockDOI = "mockDOItest";
const mockArticleId = 23;
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
  private restParagraphElement: HTMLDivElement;
  private restParagraphElementMaxHeight: number;
  private restParagraphElementClientHeight: number;

  public constructor(props: ISearchItemProps) {
    super(props);

    this.state = {
      isContentOpen: false,
      isCommentsOpen: false,
      commentInput: "",
    };
  }

  public componentDidMount() {
    this.restParagraphElementClientHeight = this.restParagraphElement.clientHeight;
    this.restParagraphElementMaxHeight = 0;
  }

  private getContent = () => {
    const mockContent = `A cluster of risk factors for cardiovascular disease and type 2 diabetes mellitus, which occur together more often than by chance alone, have become known as the metabolic syndrome. The risk factors include raised blood pressure, dyslipidemia (raised triglycerides and lowered high-density lipoprotein cholesterol), raised fasting glucose, and central obesity. Various diagnostic criteria have been proposed by different organizations over the past decade. Most recently, these have come from the International Diabetes Federation and the American Heart Association/National Heart, Lung, and Blood Institute. The main difference concerns the measure for central obesity, with this being an obligatory component in the International Diabetes Federation definition, lower than in the American Heart Association/National Heart, Lung, and Blood Institute criteria, and ethnic specific. The present article represents the outcome of a meeting between several major organizations in an attempt to unify criteria. It was agreed that there should not be an obligatory component, but that waist measurement would continue to be a useful preliminary screening tool. Three abnormal findings out of 5 would qualify a person for the metabolic syndrome. A single set of cut points would be used for all components except waist circumference, for which further work is required. In the interim, national or regional cut points for waist circumference can be used.
    A cluster of risk factors for cardiovascular disease and type 2 diabetes mellitus, which occur together more often than by chance alone, have become known as the metabolic syndrome. The risk factors include raised blood pressure, dyslipidemia (raised triglycerides and lowered high-density lipoprotein cholesterol), raised fasting glucose, and central obesity. Various diagnostic criteria have been proposed by different organizations over the past decade. Most recently, these have come from the International Diabetes Federation and the American Heart Association/National Heart, Lung, and Blood Institute. The main difference concerns the measure for central obesity, with this being an obligatory component in the International Diabetes Federation definition, lower than in the American Heart Association/National Heart, Lung, and Blood Institute criteria, and ethnic specific. The present article represents the outcome of a meeting between several major organizations in an attempt to unify criteria. It was agreed that there should not be an obligatory component, but that waist measurement would continue to be a useful preliminary screening tool. Three abnormal findings out of 5 would qualify a person for the metabolic syndrome. A single set of cut points would be used for all components except waist circumference, for which further work is required. In the interim, national or regional cut points for waist circumference can be used.
    A cluster of risk factors for cardiovascular disease and type 2 diabetes mellitus, which occur together more often than by chance alone, have become known as the metabolic syndrome. The risk factors include raised blood pressure, dyslipidemia (raised triglycerides and lowered high-density lipoprotein cholesterol), raised fasting glucose, and central obesity. Various diagnostic criteria have been proposed by different organizations over the past decade. Most recently, these have come from the International Diabetes Federation and the American Heart Association/National Heart, Lung, and Blood Institute. The main difference concerns the measure for central obesity, with this being an obligatory component in the International Diabetes Federation definition, lower than in the American Heart Association/National Heart, Lung, and Blood Institute criteria, and ethnic specific. The present article represents the outcome of a meeting between several major organizations in an attempt to unify criteria. It was agreed that there should not be an obligatory component, but that waist measurement would continue to be a useful preliminary screening tool. Three abnormal findings out of 5 would qualify a person for the metabolic syndrome. A single set of cut points would be used for all components except waist circumference, for which further work is required. In the interim, national or regional cut points for waist circumference can be used.`;

    const restParagraphStartIndex = mockContent.indexOf("\n");
    const firstParagraph = mockContent.substring(0, restParagraphStartIndex);
    const restParagraph = mockContent.substring(restParagraphStartIndex);

    if (this.state.isContentOpen) {
      this.restParagraphElementMaxHeight = this.restParagraphElementClientHeight;
    } else {
      this.restParagraphElementMaxHeight = 0;
    }

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
          style={
            !!this.restParagraphElementClientHeight
              ? {
                  maxHeight: `${this.restParagraphElementMaxHeight}px`,
                }
              : null
          }
          ref={r => {
            this.restParagraphElement = r;
          }}
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
    return (
      <div className={styles.searchItemWrapper}>
        <div className={styles.contentSection}>
          <div className={styles.title}>
            Apoptosis of malignant human B cells by ligation of CD20 with monoclonal antibodies.
          </div>
          <div className={styles.publishInfoList}>
            <a
              onClick={() => {
                trackAndOpenLink("https://medium.com/pluto-network", "searchItemJournal");
              }}
              className={styles.underline}
            >
              Blood
            </a>
            <span className={styles.bold}>[IF: 5.84]</span>
            <div className={styles.separatorLine} />
            <span className={styles.bold}>1988</span>
            <div className={styles.separatorLine} />
            <Authors authors={mockAuthors} />
          </div>
          {this.getContent()}
          <Keywords keywords={mockKeywords} />
          <InfoList
            referenceCount={mockReferenceCount}
            citedCount={mockCitedCount}
            citedPaperAvgIF={mockCitedPaperAvgIF}
            plutoScore={mockPlutoScore}
            source={mockSource}
            DOI={mockDOI}
            articleId={mockArticleId}
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
