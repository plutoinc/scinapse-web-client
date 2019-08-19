import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Icon from '../../../icons';
import { withStyles } from '../../../helpers/withStylesHelper';
import { CurrentUser } from '../../../model/currentUser';
import { Paper } from '../../../model/paper';
import EnvChecker from '../../../helpers/envChecker';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import CollectionButton from './collectionButton';
import formatNumber from '../../../helpers/formatNumber';
import { addPaperToRecommendation, openRecommendationPapersGuideDialog } from '../../../actions/recommendation';
import { PaperSource } from '../../../api/paper';
import { AppState } from '../../../reducers';
import { LayoutState, UserDevice } from '../../layouts/records';
const styles = require('./paperActionButtons.scss');

interface HandleClickClaim {
  paperId: number;
}
interface DomainSourceBtnProps {
  source: PaperSource;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  currentUserDevice: UserDevice;
  onClick: () => void;
}

const DomainSourceBtn: React.FC<DomainSourceBtnProps> = ({ source, onClick, currentUserDevice }) => {
  if (!source.source || !source.doi) return null;

  const buttonContext = currentUserDevice == UserDevice.MOBILE ? 'Source' : source.host;

  return (
    <a
      href={`https://doi.org/${source.doi}`}
      target="_blank"
      rel="noopener nofollow noreferrer"
      className={styles.sourceButton}
      onClick={onClick}
    >
      <img
        className={styles.faviconIcon}
        src={`https://www.google.com/s2/favicons?domain=${source.source}`}
        alt={`${source.host} favicon`}
      />
      <span className={styles.sourceHostInfo}> {buttonContext}</span>
      <Icon icon="SOURCE" className={styles.extSourceIcon} />
    </a>
  );
};

export interface PaperActionButtonsProps {
  paper: Paper;
  paperNote?: string;
  currentUser: CurrentUser;
  hasCollection: boolean;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  dispatch: Dispatch<any>;
  hasRemoveButton?: boolean;
  handleRemovePaper?: (paper: Paper) => void;
  isRepresentative?: boolean;
  handleToggleRepresentative?: (paper: Paper) => void;
  onRemovePaperCollection?: (paperId: number) => Promise<void>;
  sourceDomain?: PaperSource;
  layout: LayoutState;
}

export interface PaperActionButtonsState
  extends Readonly<{
      isAdditionalMenuOpen: boolean;
    }> {}

class PaperActionButtons extends React.PureComponent<PaperActionButtonsProps, PaperActionButtonsState> {
  private additionalMenuAnchorEl: HTMLElement | null;

  public constructor(props: PaperActionButtonsProps) {
    super(props);

    this.state = {
      isAdditionalMenuOpen: false,
    };
  }

  public render() {
    const { paper, pageType, paperNote, actionArea, hasCollection, onRemovePaperCollection } = this.props;
    return (
      <div className={styles.infoList}>
        {this.getCitedButton()}
        {this.getSourceButton()}
        {this.getCitationQuoteButton()}
        <CollectionButton
          hasCollection={hasCollection}
          paperId={paper.id}
          paperNote={paperNote}
          pageType={pageType}
          actionArea={actionArea}
          onRemove={onRemovePaperCollection}
        />
        {this.getMoreButton()}
      </div>
    );
  }

  private getSourceButton = () => {
    const { paper, pageType, actionArea, currentUser, sourceDomain, dispatch, layout } = this.props;

    if (sourceDomain) {
      return (
        <DomainSourceBtn
          onClick={() => {
            ActionTicketManager.trackTicket({
              pageType,
              actionType: 'fire',
              actionArea: actionArea || pageType,
              actionTag: 'source',
              actionLabel: String(paper.id),
            });
            addPaperToRecommendation(currentUser.isLoggedIn, paper.id);
            dispatch(openRecommendationPapersGuideDialog(currentUser.isLoggedIn, 'sourceButton'));
          }}
          pageType={pageType}
          actionArea={actionArea}
          source={sourceDomain}
          currentUserDevice={layout.userDevice}
        />
      );
    }

    const buttonContent = (
      <>
        <Icon className={styles.sourceButtonIcon} icon="EXTERNAL_SOURCE" />
        <span>Source</span>
      </>
    );

    if (!paper.doi) {
      return null;
    }

    return (
      <a
        href={`https://doi.org/${paper.doi}`}
        target="_blank"
        rel="noopener nofollow noreferrer"
        className={styles.sourceButton}
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType,
            actionType: 'fire',
            actionArea: actionArea || pageType,
            actionTag: 'source',
            actionLabel: String(paper.id),
          });
          addPaperToRecommendation(currentUser.isLoggedIn, paper.id);
          dispatch(openRecommendationPapersGuideDialog(currentUser.isLoggedIn, 'sourceButton'));
        }}
      >
        {buttonContent}
      </a>
    );
  };

  private getCitedButton = () => {
    const { paper, pageType, actionArea, currentUser, dispatch } = this.props;

    if (!paper.citedCount) {
      return null;
    } else {
      return (
        <Link
          to={{
            pathname: `/papers/${paper.id}`,
            hash: 'cited',
          }}
          onClick={() => {
            ActionTicketManager.trackTicket({
              pageType,
              actionType: 'fire',
              actionArea: actionArea || pageType,
              actionTag: 'citedList',
              actionLabel: String(paper.id),
            });
            addPaperToRecommendation(currentUser.isLoggedIn, paper.id);
            dispatch(openRecommendationPapersGuideDialog(currentUser.isLoggedIn, 'citationButton'));
          }}
          className={styles.citedButton}
        >
          <span>{`${formatNumber(paper.citedCount)} Citations`}</span>
        </Link>
      );
    }
  };

  private getCitationQuoteButton = () => {
    const { paper, currentUser, pageType, actionArea } = this.props;

    if (paper.doi) {
      return (
        <span className={styles.DOIMetaButtonsWrapper}>
          <span
            className={styles.citationIconWrapper}
            onClick={() => {
              addPaperToRecommendation(currentUser.isLoggedIn, paper.id);
              GlobalDialogManager.openCitationDialog(paper.id);
              ActionTicketManager.trackTicket({
                pageType,
                actionType: 'fire',
                actionArea: actionArea || pageType,
                actionTag: 'citePaper',
                actionLabel: String(paper.id),
              });
            }}
          >
            <Icon className={styles.citationIcon} icon="CITATION_QUOTE" />
            <span>Cite</span>
          </span>
        </span>
      );
    } else {
      return null;
    }
  };

  private additionalMenuItems = () => {
    const {
      currentUser,
      paper,
      handleRemovePaper,
      hasRemoveButton,
      isRepresentative,
      handleToggleRepresentative,
      hasCollection,
    } = this.props;
    return (
      <div className={styles.menuItems}>
        {hasCollection &&
          currentUser.isLoggedIn && (
            <MenuItem
              classes={{ root: styles.additionalMenuItem }}
              onClick={() => {
                GlobalDialogManager.openCollectionDialog(paper.id);
                this.closeAdditionalMenu();
              }}
            >
              Add to other collections
            </MenuItem>
          )}
        {hasRemoveButton ? (
          <MenuItem
            classes={{ root: styles.additionalMenuItem }}
            onClick={() => {
              if (handleRemovePaper) {
                handleRemovePaper(paper);
              }
              this.closeAdditionalMenu();
            }}
          >
            Delete this paper
          </MenuItem>
        ) : null}
        {handleToggleRepresentative && (
          <MenuItem
            classes={{ root: styles.additionalMenuItem }}
            onClick={() => {
              handleToggleRepresentative(paper);
              this.closeAdditionalMenu();
            }}
          >
            {isRepresentative ? 'Remove from representative publications' : 'Add to representative publications'}
          </MenuItem>
        )}
        <MenuItem
          classes={{ root: styles.additionalMenuItem }}
          onClick={() => {
            this.handleClickClaim({
              paperId: this.props.paper.id,
            });
            this.closeAdditionalMenu();
          }}
        >
          Suggest change
        </MenuItem>
      </div>
    );
  };

  private getMoreButton = () => {
    return (
      <ClickAwayListener onClickAway={this.closeAdditionalMenu}>
        <div className={styles.claimButton}>
          <div ref={el => (this.additionalMenuAnchorEl = el)}>
            <IconButton onClick={this.toggleAdditionalMenu} classes={{ root: styles.additionalMenuIcon }}>
              <Icon className={styles.ellipsisIcon} icon="ELLIPSIS" />
            </IconButton>
          </div>
          <Popper
            className={styles.speechBubble}
            anchorEl={this.additionalMenuAnchorEl!}
            placement="bottom-end"
            open={this.state.isAdditionalMenuOpen}
            disablePortal
          >
            <div className={styles.contentWrapper}>{this.additionalMenuItems()}</div>
          </Popper>
        </div>
      </ClickAwayListener>
    );
  };

  private toggleAdditionalMenu = () => {
    this.setState({
      isAdditionalMenuOpen: !this.state.isAdditionalMenuOpen,
    });
  };

  private closeAdditionalMenu = () => {
    if (this.state.isAdditionalMenuOpen) {
      this.setState({
        isAdditionalMenuOpen: false,
      });
    }
  };

  private handleClickClaim = ({ paperId }: HandleClickClaim) => {
    const targetId = paperId;

    if (!EnvChecker.isOnServer()) {
      window.open(
        // tslint:disable-next-line:max-line-length
        `https://docs.google.com/forms/d/e/1FAIpQLScS76iC1pNdq94mMlxSGjcp_BuBM4WqlTpfPDt19LgVJ-t7Ng/viewform?usp=pp_url&entry.130188959=${targetId}&entry.1298741478`,
        '_blank'
      );
    }
  };
}

const mapStateToProps = (state: AppState) => {
  return {
    layout: state.layout,
  };
};

export default connect(mapStateToProps)(withStyles<typeof PaperActionButtons>(styles)(PaperActionButtons));
