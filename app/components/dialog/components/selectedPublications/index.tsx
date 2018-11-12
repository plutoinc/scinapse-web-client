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
const styles = require("./selectedPublication.scss");

interface SelectedPublicationsDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  author: Author;
  handleClose: React.ReactEventHandler<{}>;
  handleSavingSelectedPublications: (paperIds: number[]) => Promise<void>;
}

interface SelectedPublicationsDialogState {
  papers: SimplePaper[];
  searchInput: string;
}

class SelectedPublicationsDialog extends React.PureComponent<
  SelectedPublicationsDialogProps,
  SelectedPublicationsDialogState
> {
  public constructor(props: SelectedPublicationsDialogProps) {
    super(props);

    this.state = {
      papers: [],
      searchInput: "",
    };
  }

  public async componentDidMount() {
    const { author } = this.props;

    const res = await AuthorAPI.getSelectedPapers(author.id);
    this.setState(prevState => ({ ...prevState, papers: res.data.content }));
  }

  public render() {
    const { isOpen, handleClose, isLoading } = this.props;
    const { searchInput } = this.state;

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
        <div className={styles.contentSection}>{this.getPaperList()}</div>
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
    const { handleSavingSelectedPublications, handleClose } = this.props;
    const { papers } = this.state;

    try {
      await handleSavingSelectedPublications(papers.map(paper => paper.paperId));
      handleClose(e);
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: "error",
        message: error.message,
      });
    }
  };

  private getPaperList = () => {
    const { papers, searchInput } = this.state;

    if (papers && papers.length > 0) {
      return papers.filter(paper => paper.title.includes(searchInput)).map(paper => {
        return (
          <div className={styles.paperItemWrapper} key={paper.paperId}>
            <Checkbox
              classes={{
                root: styles.checkBox,
                checked: styles.checkedCheckboxIcon,
              }}
              onChange={() => {
                this.handleTogglePaper(paper);
              }}
              color="primary"
              checked={paper.is_selected}
            />
            <span className={styles.paperItemTitle}>{paper.title}</span>
          </div>
        );
      });
    }
    return null;
  };

  private handleTogglePaper = (paper: SimplePaper) => {
    const { papers } = this.state;
    const index = papers.indexOf(paper);

    if (index !== -1) {
      const newPapers = [...papers.slice(0, index), ...papers.slice(index + 1)];
      this.setState(prevState => ({ ...prevState, papers: newPapers }));
    } else {
      this.setState(prevState => ({ ...prevState, papers: [paper, ...papers] }));
    }
  };
}

export default withStyles<typeof SelectedPublicationsDialog>(styles)(SelectedPublicationsDialog);
