import * as React from 'react';
import { debounce } from 'lodash';
import * as classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';
import ScinapseInput from '../../../common/scinapseInput';
import { withStyles } from '../../../../helpers/withStylesHelper';
import ArticleSpinner from '../../../common/spinner/articleSpinner';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../../../icons';
import alertToast from '../../../../helpers/makePlutoToastAction';
import PlutoAxios from '../../../../api/pluto';
import { Author } from '../../../../model/author/author';
import AuthorAPI, { SimplePaper } from '../../../../api/author';
import { CurrentUser } from '../../../../model/currentUser';
import { Paper } from '../../../../model/paper';
import { trackEvent } from '../../../../helpers/handleGA';
const styles = require('./representativePublication.scss');

const MAXIMUM_SELECT_COUNT = 5;

interface RepresentativePublicationsDialogProps {
  isOpen: boolean;
  author: Author;
  currentUser: CurrentUser;
  handleClose: React.ReactEventHandler<{}>;
  handleSubmit: (papers: Paper[]) => void;
}

interface RepresentativePublicationsDialogState {
  papers: SimplePaper[];
  representativePapers: SimplePaper[];
  searchInput: string;
  isLoading: boolean;
}

class RepresentativePublicationsDialog extends React.PureComponent<
  RepresentativePublicationsDialogProps,
  RepresentativePublicationsDialogState
> {
  public constructor(props: RepresentativePublicationsDialogProps) {
    super(props);

    this.state = {
      papers: [],
      representativePapers: [],
      searchInput: '',
      isLoading: false,
    };
  }

  public async componentDidMount() {
    const { author, currentUser } = this.props;

    if (currentUser.isAuthorConnected && currentUser.authorId === author.id) {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      try {
        const res = await AuthorAPI.getSelectedPapers(author.id);
        this.setState(prevState => ({
          ...prevState,
          isLoading: false,
          papers: res.data.content.filter(paper => !paper.isRepresentative),
          representativePapers: res.data.content.filter(paper => paper.isRepresentative),
        }));
      } catch (err) {
        console.error(err);
        this.setState(prevState => ({ ...prevState, isLoading: false }));
        alertToast({
          type: 'error',
          message: 'Had an error to get the publications information from server',
        });
      }
    }
  }

  public render() {
    const { isOpen, handleClose } = this.props;
    const { searchInput, isLoading, papers, representativePapers } = this.state;

    const content = isLoading ? (
      <div className={styles.contentSection}>
        <ArticleSpinner style={{ margin: '100px auto' }} />
      </div>
    ) : (
      <div className={styles.contentSection}>
        <div className={styles.alreadySelectedPapers}>{this.getPaperList(representativePapers)}</div>
        {this.getPaperList(papers)}
      </div>
    );

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        classes={{
          paper: styles.dialogPaper,
        }}
      >
        <div className={styles.dialogHeader}>
          <div className={styles.mainTitle}>Representative Publications</div>
          <div className={styles.closeButton} onClick={handleClose}>
            <Icon className={styles.closeIcon} icon="X_BUTTON" />
          </div>
          <span className={styles.sectionGuideContext}>Select the best papers to represent you! (Up to 5 papers)</span>
        </div>
        <ScinapseInput
          onChange={this.handleChangeSearchInput}
          value={searchInput}
          placeholder="Filter Publications"
          icon="SEARCH"
        />

        {content}
        <div className={styles.footer}>
          <span
            className={classNames({
              [styles.remainingText]: true,
              [styles.noRemainingText]: this.getRemainedPaperCount() === 0,
            })}
          >
            {MAXIMUM_SELECT_COUNT - this.getRemainedPaperCount()} / 5 Selected
          </span>
          <div className={styles.buttonsWrapper}>
            <Button
              elementType="button"
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              onClick={this.handleSavingSelectedPublications}
            >
              <span>{`Save ${MAXIMUM_SELECT_COUNT - this.getRemainedPaperCount()} representative publications`}</span>
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  private trackFilter = (query: string) => {
    trackEvent({
      category: 'New Author Show',
      action: 'filter papers to select representative publications',
      label: query,
    });
  };

  // tslint:disable-next-line:member-ordering
  private delayedTrackFilterUsage = debounce(this.trackFilter, 3000);

  private getRemainedPaperCount = () => {
    const { papers, representativePapers } = this.state;

    const selectedPaperCount = papers.filter(paper => paper.isRepresentative).length;
    const alreadySelectedPaperCount = representativePapers.filter(paper => paper.isRepresentative).length;

    const remainingPaperCount = MAXIMUM_SELECT_COUNT - (selectedPaperCount + alreadySelectedPaperCount);

    return remainingPaperCount;
  };

  private handleChangeSearchInput = (e: React.FormEvent<HTMLInputElement>) => {
    const searchInput = e.currentTarget.value;

    this.delayedTrackFilterUsage(searchInput);
    this.setState(prevState => ({ ...prevState, searchInput }));
  };

  private handleSavingSelectedPublications = async (e: any) => {
    const { author, handleClose, handleSubmit } = this.props;
    const { papers, representativePapers } = this.state;

    this.setState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const selectedPaperIds = papers.filter(paper => paper.isRepresentative).map(paper => paper.paperId);
      const alreadySelectedPaperIds = representativePapers
        .filter(paper => paper.isRepresentative)
        .map(paper => paper.paperId);

      const fullPapers = await AuthorAPI.updateRepresentativePapers({
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
        type: 'error',
        message: error.message,
      });
    }
  };

  private getPaperList = (papers: SimplePaper[]) => {
    const { searchInput } = this.state;

    if (papers && papers.length > 0) {
      return papers.filter(paper => paper.title.toLowerCase().includes(searchInput.toLowerCase())).map(paper => {
        return (
          <div
            onClick={() => {
              this.handleTogglePaper(paper);
            }}
            key={paper.paperId}
            className={classNames({
              [styles.disabledSelectItem]: this.getRemainedPaperCount() === 0 && !paper.isRepresentative,
              [styles.paperItemWrapper]: true,
            })}
          >
            <Checkbox
              classes={{
                root: styles.checkBox,
                checked: styles.checkedCheckboxIcon,
              }}
              color="primary"
              checked={paper.isRepresentative}
            />
            <div className={styles.paperItemTitle}>{paper.title}</div>
          </div>
        );
      });
    }

    return null;
  };

  private handleTogglePaper = (paper: SimplePaper) => {
    const { papers, representativePapers } = this.state;

    if (this.getRemainedPaperCount() === 0 && !paper.isRepresentative) {
      window.alert('You have exceeded the number of choices available.');
      return null;
    }

    const index = papers.indexOf(paper);
    if (index !== -1) {
      const newPaper = { ...papers[index], isRepresentative: !papers[index].isRepresentative };
      const newPapers = [...papers.slice(0, index), newPaper, ...papers.slice(index + 1)];
      return this.setState(prevState => ({ ...prevState, papers: newPapers }));
    }

    const selectedPaperIndex = representativePapers.indexOf(paper);
    if (selectedPaperIndex !== -1) {
      const newPaper = {
        ...representativePapers[selectedPaperIndex],
        isRepresentative: !representativePapers[selectedPaperIndex].isRepresentative,
      };
      const newPapers = [
        ...representativePapers.slice(0, selectedPaperIndex),
        newPaper,
        ...representativePapers.slice(selectedPaperIndex + 1),
      ];
      return this.setState(prevState => ({ ...prevState, representativePapers: newPapers }));
    }
  };
}

export default withStyles<typeof RepresentativePublicationsDialog>(styles)(RepresentativePublicationsDialog);
