import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../reducers";
import { ICurrentUserStateRecord } from "../../model/currentUser";
import { getMockArticle } from "./__mocks__/mockArticle";
import TagList from "./components/tagList";
import ArticleInfo from "./components/articleInfo";
import AuthorList from "./components/authorList";
import Abstract from "./components/abstract";
import Article from "./components/article";
import ArticleEvaluate from "./components/evaluate";
import { IArticleShowStateRecord } from "./records";
import { changeArticleEvaluationTab } from "./actions";

const styles = require("./articleShow.scss");

interface IArticlePageParams {
  articleId?: number;
}

interface IArticleShowProps extends RouteComponentProps<IArticlePageParams>, DispatchProp<any> {
  currentUser: ICurrentUserStateRecord;
  articleShow: IArticleShowStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUser: state.currentUser,
    articleShow: state.articleShow,
  };
}

// TODO: Remove mock data
const mockUser = {
  nickName: "Jeffrey C. Lagarias",
  organization: "University of Michigan",
};

const mockLink = "https://pluto.network";

const mockAuthors = [mockUser, mockUser, mockUser, mockUser, mockUser];

const mockContent = `Reproducibility, data sharing, personal data privacy concerns and patient enrolment in clinical trials are huge medical challenges for contemporary clinical research. A new technology, Blockchain, may be a key to addressing these challenges and should draw the attention of the whole clinical research community.

Blockchain brings the Internet to its definitive decentralisation goal. The core principle of Blockchain is that any service relying on trusted third parties can be built in a transparent, decentralised, secure "trustless" manner at the top of the Blockchain (in fact, there is trust, but it is hardcoded in the Blockchain protocol via a complex cryptographic algorithm). Therefore, users have a high degree of control over and autonomy and trust of the data and its integrity. Blockchain allows for reaching a substantial level of historicity and inviolability of data for the whole document flow in a clinical trial. Hence, it ensures traceability, prevents a posteriori reconstruction and allows for securely automating the clinical trial through what are called Smart Contracts. At the same time, the technology ensures fine-grained control of the data, its security and its shareable parameters, for a single patient or group of patients or clinical trial stakeholders.

In this commentary article, we explore the core functionalities of Blockchain applied to clinical trials and we illustrate concretely its general principle in the context of consent to a trial protocol. Trying to figure out the potential impact of Blockchain implementations in the setting of clinical trials will shed new light on how modern clinical trial methods could evolve and benefit from Blockchain technologies in order to tackle the aforementioned challenges.`;

@withRouter
class ArticleShow extends React.PureComponent<IArticleShowProps, {}> {
  private handleEvaluationTabChange = () => {
    const { dispatch } = this.props;

    dispatch(changeArticleEvaluationTab());
  };

  public componentDidMount() {
    const { match } = this.props;
    const { articleId } = match.params;

    if (match.params.articleId) {
      console.log(articleId);
      // TODO: Add load article logic
      // loadArticle(articleId);
    }
  }

  public render() {
    const { articleShow } = this.props;
    //TODO: Remove mockArticle after setting API
    const mockArticle = getMockArticle();

    return (
      <div className={styles.articleShowContainer}>
        <div className={styles.articleContentContainer}>
          <TagList tags={mockArticle.tags} />
          <div className={styles.title}>{mockArticle.title}</div>
          <ArticleInfo from="Arxiv" createdAt="July 17, 2017" user={mockUser} />
          <AuthorList authors={mockAuthors} />
          <Abstract content={mockContent} />
          <Article link={mockLink} />
          <ArticleEvaluate articleShow={articleShow} handleEvaluationTabChange={this.handleEvaluationTabChange} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ArticleShow);
