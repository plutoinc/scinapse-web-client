import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import ScinapseInput from "../../../common/scinapseInput";
import { withStyles } from "../../../../helpers/withStylesHelper";
import ScinapseButton from "../../../common/scinapseButton";
import Icon from "../../../../icons";
import alertToast from "../../../../helpers/makePlutoToastAction";
import PlutoAxios from "../../../../api/pluto";
import { Author } from "../../../../model/author/author";
import AuthorAPI, { SimplePaper } from "../../../../api/author";
import { CurrentUser } from "../../../../model/currentUser";
import { Paper } from "../../../../model/paper";
const styles = require("./selectedPublication.scss");

interface SelectedPublicationsDialogProps {
  isOpen: boolean;
  author: Author;
  currentUser: CurrentUser;
  handleClose: React.ReactEventHandler<{}>;
  handleSubmit: (papers: Paper[]) => void;
}

interface SelectedPublicationsDialogState {
  papers: SimplePaper[];
  selectedPapers: SimplePaper[];
  searchInput: string;
  isLoading: boolean;
}

class SelectedPublicationsDialog extends React.PureComponent<
  SelectedPublicationsDialogProps,
  SelectedPublicationsDialogState
> {
  public constructor(props: SelectedPublicationsDialogProps) {
    super(props);

    this.state = {
      papers: [],
      selectedPapers: [],
      searchInput: "",
      isLoading: false,
    };
  }

  public async componentDidMount() {
    const { author, currentUser } = this.props;

    if (currentUser.is_author_connected && currentUser.author_id === author.id) {
      const res = await AuthorAPI.getSelectedPapers(author.id);

      this.setState(prevState => ({
        ...prevState,
        papers: res.data.content.filter(paper => !paper.is_selected),
        selectedPapers: res.data.content.filter(paper => paper.is_selected),
      }));
    }
  }

  public render() {
    const { isOpen, handleClose } = this.props;
    const { searchInput, isLoading, papers, selectedPapers } = this.state;

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        classes={{
          paper: styles.dialogPaper,
        }}
      >
        <div className={styles.dialogHeader}>
          <div>Selected Publications</div>
          <div className={styles.closeButton} onClick={handleClose}>
            <Icon className={styles.closeIcon} icon="X_BUTTON" />
          </div>
        </div>
        <ScinapseInput onChange={this.handleChangeSearchInput} value={searchInput} placeholder="Filter Publications" />
        <div className={styles.contentSection}>
          <div className={styles.alreadySelectedPapers}>{this.getPaperList(selectedPapers)}</div>
          {this.getPaperList(papers)}
        </div>
        <div className={styles.footer}>
          <div className={styles.buttonsWrapper}>
            <ScinapseButton
              style={{
                color: "#1e2a35",
                opacity: 0.25,
                width: "64px",
                height: "40px",
              }}
              gaCategory="SelectedPublications"
              content="Cancel"
              onClick={handleClose}
            />
            <ScinapseButton
              style={{
                backgroundColor: isLoading ? "#ecf1fa" : "#6096ff",
                cursor: isLoading ? "not-allowed" : "pointer",
                width: "200px",
                height: "40px",
              }}
              disabled={isLoading}
              gaCategory="SelectedPublications"
              content="Save selected publications"
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

  private handleSavingSelectedPublications = async (e: any) => {
    const { author, handleClose, handleSubmit } = this.props;
    const { papers, selectedPapers } = this.state;

    this.setState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const selectedPaperIds = papers.filter(paper => paper.is_selected).map(paper => paper.paperId);
      const alreadySelectedPaperIds = selectedPapers.filter(paper => paper.is_selected).map(paper => paper.paperId);

      const fullPapers = await AuthorAPI.updateSelectedPapers({
        authorId: author.id,
        paperIds: [...selectedPaperIds, ...alreadySelectedPaperIds],
      });

      this.setState(prevState => ({ ...prevState, isLoading: false }));
      handleSubmit(fullPapers);
      handleClose(e);
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false }));
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: "error",
        message: error.message,
      });
    }
  };

  private getPaperList = (papers: SimplePaper[]) => {
    const { searchInput } = this.state;

    if (papers && papers.length > 0) {
      return papers.filter(paper => paper.title.includes(searchInput)).map(paper => {
        return (
          <div
            onClick={() => {
              this.handleTogglePaper(paper);
            }}
            className={styles.paperItemWrapper}
            key={paper.paperId}
          >
            <Checkbox
              classes={{
                root: styles.checkBox,
                checked: styles.checkedCheckboxIcon,
              }}
              color="primary"
              checked={paper.is_selected}
            />
            <div className={styles.paperItemTitle}>{paper.title}</div>
          </div>
        );
      });
    }
    return null;
  };

  private handleTogglePaper = (paper: SimplePaper) => {
    const { papers, selectedPapers } = this.state;

    const index = papers.indexOf(paper);
    if (index !== -1) {
      const newPaper = { ...papers[index], is_selected: !papers[index].is_selected };
      const newPapers = [...papers.slice(0, index), newPaper, ...papers.slice(index + 1)];
      return this.setState(prevState => ({ ...prevState, papers: newPapers }));
    }

    const selectedPaperIndex = selectedPapers.indexOf(paper);
    if (selectedPaperIndex !== -1) {
      const newPaper = {
        ...selectedPapers[selectedPaperIndex],
        is_selected: !selectedPapers[selectedPaperIndex].is_selected,
      };
      const newPapers = [
        ...selectedPapers.slice(0, selectedPaperIndex),
        newPaper,
        ...selectedPapers.slice(selectedPaperIndex + 1),
      ];
      return this.setState(prevState => ({ ...prevState, selectedPapers: newPapers }));
    }
  };
}

export default withStyles<typeof SelectedPublicationsDialog>(styles)(SelectedPublicationsDialog);
