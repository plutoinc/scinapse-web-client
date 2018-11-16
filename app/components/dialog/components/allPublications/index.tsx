import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import ScinapseInput from "../../../common/scinapseInput";
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
          <div>Add Publications</div>
          <div className={styles.closeButton} onClick={handleClose}>
            <Icon className={styles.closeIcon} icon="X_BUTTON" />
          </div>
        </div>
        <div className={styles.description}>
          당신이 저자인 논문을 검색해서 추가하세요. 추가된 논문은 프로필페이지에는 즉각적으로 반영되지만, 실제 저자 내부
          데이터 베이스에는 내부 검토 후 반영됩니다.
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
                width: "200px",
                height: "40px",
              }}
              disabled={isLoading}
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
    const { papers, searchInput } = this.state;

    if (papers && papers.length > 0) {
      return papers.filter(paper => paper.title.includes(searchInput)).map(paper => {
        return (
          <div
            onClick={() => {
              this.handleTogglePaper(paper);
            }}
            className={styles.paperItemWrapper}
            key={paper.id}
          >
            <Checkbox
              classes={{
                root: styles.checkBox,
                checked: styles.checkedCheckboxIcon,
              }}
              color="primary"
              checked={false}
            />
            <span className={styles.paperItemTitle}>{paper.title}</span>
          </div>
        );
      });
    }
    return (
      <div>
        <div className={styles.noPaperIcon}>☝️️</div>
        <div className={styles.noPaper}>Search and add your publications</div>
      </div>
    );
  };

  private handleSubmitSearch = async () => {
    const { author } = this.props;
    const { searchInput } = this.state;

    if (searchInput && searchInput.length > 0) {
      try {
        const res = await AuthorAPI.queryAuthorPapers(searchInput, author.id);
        console.log(res);
      } catch (err) {
        const error = PlutoAxios.getGlobalError(err);
        console.error(error);
        alertToast({
          type: "error",
          message: "Had an error to search the papers",
        });
      }
    }
  };

  private handleTogglePaper = (paper: Paper) => {
    console.log(paper);
  };
}

export default withStyles<typeof AllPublicationsDialog>(styles)(AllPublicationsDialog);
