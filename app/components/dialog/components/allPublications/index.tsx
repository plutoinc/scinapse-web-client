import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import ScinapseInput from "../../../common/scinapseInput";
import Authors from "../../../common/paperItem/authors";
import PaperItemJournal from "../../../common/paperItem/journal";
import { withStyles } from "../../../../helpers/withStylesHelper";
import ScinapseButton from "../../../common/scinapseButton";
import Icon from "../../../../icons";
import { Author } from "../../../../model/author/author";
import AuthorAPI from "../../../../api/author";
import alertToast from "../../../../helpers/makePlutoToastAction";
import PlutoAxios from "../../../../api/pluto";
import { CurrentUser } from "../../../../model/currentUser";
import { Paper } from "../../../../model/paper";
const styles = require("./allPublications.scss");

interface AllPublicationsDialogProps {
  isOpen: boolean;
  author: Author;
  currentUser: CurrentUser;
  handleClose: () => void;
  handleSubmitAddPapers: (authorId: number, papers: Paper[]) => Promise<void>;
}

interface AllPublicationsDialogState {
  papers: Paper[];
  selectedPapers: Paper[];
  isLoading: boolean;
  currentPage: number;
  isEnd: boolean;
  searchInput: string;
}

class AllPublicationsDialog extends React.PureComponent<AllPublicationsDialogProps, AllPublicationsDialogState> {
  public constructor(props: AllPublicationsDialogProps) {
    super(props);

    this.state = {
      papers: [],
      selectedPapers: [],
      isLoading: false,
      currentPage: 1,
      isEnd: false,
      searchInput: "",
    };
  }

  public render() {
    const { isOpen, handleClose } = this.props;
    const { searchInput, isLoading } = this.state;

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        classes={{
          paper: styles.dialogPaper,
        }}
      >
        <div className={styles.dialogHeader}>
          <div>Add Publications</div>
          <div className={styles.closeButton} onClick={handleClose}>
            <Icon className={styles.closeIcon} icon="X_BUTTON" />
          </div>
        </div>
        <div className={styles.description}>
          Search and add your papers. The papers are immediately added in this author page but they are reflected in the
          internal database after internal review.
        </div>
        <ScinapseInput
          onChange={this.handleChangeSearchInput}
          value={searchInput}
          placeholder="Filter Publications"
          onSubmit={this.handleSubmitSearch}
        />
        <div className={styles.contentSection}>{this.getPaperList()}</div>
        <div className={styles.footer}>
          <div className={styles.buttonsWrapper}>
            <ScinapseButton
              style={{
                backgroundColor: isLoading ? "#ecf1fa" : "#6096ff",
                cursor: isLoading ? "not-allowed" : "pointer",
                width: "140px",
                height: "40px",
              }}
              disabled={isLoading}
              isLoading={isLoading}
              gaCategory="AllPublications"
              content="Add Publications"
              onClick={this.handleSavingSelectedPublications}
            />
          </div>
        </div>
      </Dialog>
    );
  }

  private handleChangeSearchInput = (e: React.FormEvent<HTMLInputElement>) => {
    const searchInput = e.currentTarget.value;
    this.setState(prevState => ({ ...prevState, searchInput }));
  };

  private handleSavingSelectedPublications = async () => {
    const { author, handleClose, handleSubmitAddPapers } = this.props;
    const { selectedPapers } = this.state;

    this.setState(prevState => ({ ...prevState, isLoading: true }));
    try {
      await handleSubmitAddPapers(author.id, selectedPapers);
      this.setState(prevState => ({ ...prevState, isLoading: false }));
      handleClose();
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false }));
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: "error",
        message: error.message,
      });
    }
  };

  private getPaperList = () => {
    const { papers, isEnd } = this.state;

    if (papers && papers.length > 0) {
      const paperList = papers.map(paper => {
        return this.getPaperItem(paper);
      });

      return (
        <div>
          {paperList}
          {!isEnd ? (
            <div className={styles.loadMoreButtonWrapper}>
              <div onClick={this.handleLoadMore} className={styles.loadMoreButton}>
                <span>Load more</span>
                <Icon icon="ARROW_POINT_TO_DOWN" className={styles.downArrowIcon} />
              </div>
            </div>
          ) : null}
        </div>
      );
    }
    return (
      <div>
        <div className={styles.noPaperIcon}>☝️️</div>
        <div className={styles.noPaper}>Search and add your publications</div>
      </div>
    );
  };

  private getPaperItem = (paper: Paper) => {
    const { selectedPapers } = this.state;

    if (paper.is_author_included) {
      return (
        <div key={paper.id} className={styles.paperItemWrapper}>
          <div className={styles.alreadyAddedIcon}>
            <Icon icon="CHECK" className={styles.checkIcon} />
          </div>
          <div className={styles.paperWrapper}>
            <div className={styles.alreadyAddedPaper}> Already added publication</div>
            <div className={styles.titleWrapper}>
              <span className={styles.paperItemTitle} style={{ color: "#bbc2d0" }}>
                {paper.title}
              </span>
            </div>
            <div className={styles.paperMeta}>
              <Icon icon="AUTHOR" />
              <Authors style={{ color: "#bbc2d0" }} readOnly={true} authors={paper.authors} />
            </div>
            <div className={styles.paperMeta}>
              <PaperItemJournal
                journal={paper.journal}
                year={paper.year}
                readOnly={true}
                style={{ display: "flex", color: "#bbc2d0", fontSize: "14px" }}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => {
          this.handleTogglePaper(paper);
        }}
        key={paper.id}
        className={styles.paperItemWrapper}
      >
        <Checkbox
          classes={{
            root: styles.checkBox,
            checked: styles.checkedCheckboxIcon,
          }}
          color="primary"
          checked={selectedPapers.includes(paper)}
        />
        <div className={styles.paperWrapper}>
          <span className={styles.paperItemTitle}>{paper.title}</span>
          <div className={styles.paperMeta}>
            <Icon icon="AUTHOR" />
            <Authors readOnly={true} authors={paper.authors} />
          </div>
          <div className={styles.paperMeta}>
            <PaperItemJournal
              journal={paper.journal}
              year={paper.year}
              readOnly={true}
              style={{ display: "flex", color: "#77828c", fontSize: "14px" }}
            />
          </div>
        </div>
      </div>
    );
  };

  private handleSubmitSearch = () => {
    this.fetchQueryPapers(1);
  };

  private handleLoadMore = () => {
    this.fetchQueryPapers(this.state.currentPage + 1);
  };

  private fetchQueryPapers = async (page: number) => {
    const { author } = this.props;
    const { searchInput, currentPage, papers } = this.state;

    try {
      this.setState(prevState => ({
        ...prevState,
        isLoading: true,
        isEnd: false,
        currentPage: page,
      }));
      const res = await AuthorAPI.queryAuthorPapers({ query: searchInput, authorId: author.id, page });
      this.setState(prevState => ({
        ...prevState,
        isLoading: false,
        papers: page === 1 ? res.data.content : [...papers, ...res.data.content],
        isEnd: res.data.page ? res.data.page.last : false,
      }));
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false, currentPage }));
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      alertToast({
        type: "error",
        message: "Had an error to search the papers",
      });
    }
  };

  private handleTogglePaper = (paper: Paper) => {
    const { selectedPapers } = this.state;

    const index = selectedPapers.indexOf(paper);
    if (index !== -1) {
      this.setState(prevState => ({
        ...prevState,
        selectedPapers: [...selectedPapers.slice(0, index), ...selectedPapers.slice(index + 1)],
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        selectedPapers: [paper, ...selectedPapers],
      }));
    }
  };
}

export default withStyles<typeof AllPublicationsDialog>(styles)(AllPublicationsDialog);
