import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import ScinapseInput from "../../../common/scinapseInput";
import { withStyles } from "../../../../helpers/withStylesHelper";
import ScinapseButton from "../../../common/scinapseButton";
import Icon from "../../../../icons";
import alertToast from "../../../../helpers/makePlutoToastAction";
import PlutoAxios from "../../../../api/pluto";
import { Paper } from "../../../../model/paper";
import { Author } from "../../../../model/author/author";
const styles = require("./selectedPublication.scss");

interface SelectedPublicationsDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  author: Author;
  papers: Paper[];
  selectedPublications: Paper[];
  handleClose: React.ReactEventHandler<{}>;
  handleSavingSelectedPublications: (paperIds: number[]) => Promise<void>;
}

interface SelectedPublicationsDialogState {
  selectedPapers: Paper[];
  searchInput: string;
}

class SelectedPublicationsDialog extends React.PureComponent<
  SelectedPublicationsDialogProps,
  SelectedPublicationsDialogState
> {
  public constructor(props: SelectedPublicationsDialogProps) {
    super(props);

    this.state = {
      selectedPapers: [],
      searchInput: "",
    };
  }

  public async componentDidMount() {
    const { selectedPublications } = this.props;
    const selectedPaperIds = selectedPublications.map(paper => paper.id);
    const selectedPapers = res.data.content
      ? res.data.content.filter(simplePaper => selectedPaperIds.includes(simplePaper.id))
      : [];
    this.setState(prevState => ({ ...prevState, papers: res.data.content || [], selectedPapers }));
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
              gaCategory="ProfileMetaSetup"
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
              gaCategory="ProfileMetaSetup"
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
    const { selectedPapers } = this.state;

    try {
      await handleSavingSelectedPublications(selectedPapers.map(paper => paper.id));
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
    const { papers, selectedPapers, searchInput } = this.state;

    if (papers && papers.length > 0) {
      return papers.filter(paper => paper.title.includes(searchInput)).map(paper => {
        return (
          <div className={styles.paperItemWrapper} key={paper.id}>
            <Checkbox
              classes={{
                root: styles.checkBox,
                checked: styles.checkedCheckboxIcon,
              }}
              onChange={() => {
                this.handleTogglePaper(paper);
              }}
              color="primary"
              checked={selectedPapers.includes(paper)}
            />
            <span className={styles.paperItemTitle}>{paper.title}</span>
          </div>
        );
      });
    }
    return null;
  };

  private handleTogglePaper = (paper: SimplePaper) => {
    const { selectedPapers } = this.state;
    const index = selectedPapers.indexOf(paper);

    if (index !== -1) {
      const newSelectedPapers = [...selectedPapers.slice(0, index), ...selectedPapers.slice(index + 1)];
      this.setState(prevState => ({ ...prevState, selectedPapers: newSelectedPapers }));
    } else {
      this.setState(prevState => ({ ...prevState, selectedPapers: [paper, ...selectedPapers] }));
    }
  };
}

export default withStyles<typeof SelectedPublicationsDialog>(styles)(SelectedPublicationsDialog);
