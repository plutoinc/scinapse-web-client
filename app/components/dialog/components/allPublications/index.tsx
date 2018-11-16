import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import ScinapseInput from "../../../common/scinapseInput";
import { withStyles } from "../../../../helpers/withStylesHelper";
import ScinapseButton from "../../../common/scinapseButton";
import Icon from "../../../../icons";
import { Author } from "../../../../model/author/author";
// import AuthorAPI, { SimplePaper } from "../../../../api/author";
// import alertToast from "../../../../helpers/makePlutoToastAction";
// import PlutoAxios from "../../../../api/pluto";
import { CurrentUser } from "../../../../model/currentUser";
import { Paper } from "../../../../model/paper";
const styles = require("./selectedPublication.scss");

interface AllPublicationsDialogProps {
  isOpen: boolean;
  author: Author;
  currentUser: CurrentUser;
  handleClose: React.ReactEventHandler<{}>;
}

interface AllPublicationsDialogState {
  papers: Paper[];
  searchInput: string;
  isLoading: boolean;
}

class AllPublicationsDialog extends React.PureComponent<AllPublicationsDialogProps, AllPublicationsDialogState> {
  public constructor(props: AllPublicationsDialogProps) {
    super(props);

    this.state = {
      papers: [],
      searchInput: "",
      isLoading: false,
    };
  }

  public render() {
    const { isOpen, handleClose } = this.props;
    const { searchInput, isLoading, papers } = this.state;

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
    console.log(e);
    // const { author, handleClose } = this.props;
    // const { papers } = this.state;

    // try {
    //   const selectedPaperIds = papers.filter(paper => paper.is_selected).map(paper => paper.paperId);
    //   await AuthorAPI.updateSelectedPapers({
    //     authorId: author.id,
    //     paperIds: selectedPaperIds,
    //   });
    //   handleClose(e);
    // } catch (err) {
    //   const error = PlutoAxios.getGlobalError(err);
    //   alertToast({
    //     type: "error",
    //     message: error.message,
    //   });
    // }
  };

  private getPaperList = () => {
    // const { searchInput } = this.state;

    // if (papers && papers.length > 0) {
    //   return papers.filter(paper => paper.title.includes(searchInput)).map(paper => {
    //     return (
    //       <div
    //         onClick={() => {
    //           this.handleTogglePaper(paper);
    //         }}
    //         className={styles.paperItemWrapper}
    //         key={paper.paperId}
    //       >
    //         <Checkbox
    //           classes={{
    //             root: styles.checkBox,
    //             checked: styles.checkedCheckboxIcon,
    //           }}
    //           color="primary"
    //           checked={paper.is_selected}
    //         />
    //         <span className={styles.paperItemTitle}>{paper.title}</span>
    //       </div>
    //     );
    //   });
    // }
    return null;
  };

  private handleTogglePaper = (paper: SimplePaper) => {
    console.log(paper);
  };
}

export default withStyles<typeof AllPublicationsDialog>(styles)(AllPublicationsDialog);
