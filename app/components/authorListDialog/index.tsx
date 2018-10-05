import * as React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "../../helpers/withStylesHelper";
import PaperAPI from "../../api/paper";
import PlutoAxios from "../../api/pluto";
import alertToast from "../../helpers/makePlutoToastAction";
import { Author } from "../../model/author/author";
import AuthorListItem from "../common/authorListItem";
import { Paper } from "../../model/paper";
import Icon from "../../icons";
const styles = require("./authorListDialog.scss");

interface AuthorListDialogProps {
  paper: Paper;
  handleCloseDialogRequest: () => void;
}

interface AuthorListDialogStates {
  authors: Author[];
  isLoading: boolean;
  currentPage: number;
  totalPage: number;
  totalElements: number;
}

@withStyles<typeof AuthorListDialog>(styles)
class AuthorListDialog extends React.PureComponent<AuthorListDialogProps, AuthorListDialogStates> {
  public constructor(props: AuthorListDialogProps) {
    super(props);

    this.state = {
      authors: [],
      isLoading: false,
      currentPage: 0,
      totalPage: 0,
      totalElements: 0,
    };
  }
  public componentDidMount() {
    this.fetchAuthorList();
  }

  public render() {
    const { handleCloseDialogRequest, paper } = this.props;
    const { totalElements } = this.state;

    return (
      <div className={styles.dialogWrapper}>
        <div className={styles.header}>
          <div className={styles.title}>{`Authors (${totalElements})`}</div>
          <div className={styles.closeBtnWrapper} onClick={handleCloseDialogRequest}>
            <Icon className={styles.closeBtn} icon="X_BUTTON" />
          </div>
        </div>
        <div className={styles.subHeader}>
          <div className={styles.paperTitle}>{paper.title}</div>
          <div className={styles.paperDescription}>{this.getJournalText()}</div>
        </div>
        <div className={styles.contentBox}>{this.getAuthorList()}</div>
      </div>
    );
  }

  private getJournalText = () => {
    const { paper } = this.props;
    const { journal, year } = paper;

    if (!journal) {
      return null;
    }
    return (
      <div className={styles.journalText}>
        {year ? (
          <span className={styles.bold}>
            {year}
            {` in `}
          </span>
        ) : null}
        <Link to={`/journals/${journal.id}`} className={styles.journalName}>
          {journal.fullTitle}
        </Link>
        {journal.impactFactor ? (
          <span className={styles.bold}>{` [IF: ${journal.impactFactor ? journal.impactFactor.toFixed(2) : 0}]`}</span>
        ) : null}
      </div>
    );
  };

  private getAuthorList = () => {
    const { authors } = this.state;

    if (authors && authors.length > 0) {
      return authors.map(author => <AuthorListItem author={author} key={author.id} />);
    }
    return null;
  };

  private fetchAuthorList = async (page = 1) => {
    const { paper } = this.props;
    const { isLoading } = this.state;

    if (!isLoading) {
      try {
        this.setState(prevState => ({ ...prevState, isLoading: true }));

        const res = await PaperAPI.getAuthorsOfPaper({ paperId: paper.id, page });

        this.setState(prevState => ({
          ...prevState,
          authors: [...prevState.authors, ...res.authors],
          isLoading: false,
          currentPage: page,
          totalPage: res.page.totalPages,
          totalElements: res.page.totalElements,
        }));
      } catch (err) {
        const error = PlutoAxios.getGlobalError(err);
        this.setState(prevState => ({ ...prevState, isLoading: false }));
        if (error) {
          alertToast({
            type: "error",
            message: error.message,
          });
        }
      }
    }
  };
}
export default AuthorListDialog;
