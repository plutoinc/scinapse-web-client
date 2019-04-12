import * as React from "react";
import { CurrentUser } from "../../../model/currentUser";
import Abstract from "./abstract";
import PaperActionButtons from "./paperActionButtons";
import Title from "./title";
import VenueAndAuthors from "./venueAndAuthors";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Paper } from "../../../model/paper";
import EnvChecker from "../../../helpers/envChecker";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import SavedCollections from "./savedCollections";
const styles = require("./paperItem.scss");

export interface PaperItemProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  hasCollection?: boolean;
  paperNote?: string;
  searchQueryText?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  currentUser?: CurrentUser;
  omitAbstract?: boolean;
  omitButtons?: boolean;
  hasRemoveButton?: boolean;
  handleRemovePaper?: (paper: Paper) => void;
  isRepresentative?: boolean;
  handleToggleRepresentative?: (paper: Paper) => void;
  onRemovePaperCollection?: (paperId: number) => Promise<void>;
}

class RawPaperItem extends React.PureComponent<PaperItemProps> {
  private paperItemWrapper: HTMLDivElement | null;

  public componentDidMount() {
    const { pageType, paper, actionArea } = this.props;
    if (!EnvChecker.isOnServer() && this.paperItemWrapper) {
      const options = {
        threshold: 1.0,
      };

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            ActionTicketManager.trackTicket({
              pageType,
              actionType: "view",
              actionArea: actionArea || pageType,
              actionTag: "paperShow",
              actionLabel: String(paper.id),
            });
            observer.unobserve(this.paperItemWrapper!);
          }
        });
      }, options);

      observer.observe(this.paperItemWrapper);
    }
  }

  public render() {
    const {
      searchQueryText,
      paper,
      paperNote,
      wrapperClassName,
      currentUser,
      wrapperStyle,
      pageType,
      omitAbstract,
      omitButtons,
      hasRemoveButton,
      handleRemovePaper,
      isRepresentative,
      handleToggleRepresentative,
      actionArea,
      hasCollection,
      onRemovePaperCollection,
    } = this.props;
    const { title, titleHighlighted, authors, publishedDate, doi, urls, journal, conferenceInstance, relation } = paper;

    const abstract = !omitAbstract ? (
      <Abstract
        paperId={paper.id}
        pageType={pageType}
        actionArea={actionArea}
        abstract={paper.abstractHighlighted || paper.abstract}
        searchQueryText={searchQueryText}
      />
    ) : null;
    const buttons =
      !omitButtons && currentUser ? (
        <PaperActionButtons
          currentUser={currentUser}
          paper={paper}
          paperNote={paperNote}
          hasCollection={!!hasCollection}
          pageType={pageType}
          actionArea={actionArea}
          hasRemoveButton={hasRemoveButton}
          handleRemovePaper={handleRemovePaper}
          isRepresentative={isRepresentative}
          handleToggleRepresentative={handleToggleRepresentative}
          onRemovePaperCollection={onRemovePaperCollection}
        />
      ) : null;

    let source: string;
    if (!!doi) {
      source = `https://doi.org/${doi}`;
    } else if (urls && urls.length > 0) {
      source = urls[0].url;
    } else {
      source = "";
    }

    return (
      <div
        ref={el => (this.paperItemWrapper = el)}
        style={wrapperStyle}
        className={`${wrapperClassName ? wrapperClassName : styles.paperItemWrapper}`}
      >
        <div className={styles.contentSection}>
          {!!relation && relation.savedInCollections.length >= 1 ? (
            <SavedCollections collections={relation.savedInCollections} />
          ) : null}
          <Title
            pageType={pageType}
            actionArea={actionArea}
            title={titleHighlighted || title}
            paperId={paper.id}
            searchQueryText={searchQueryText}
            source={source}
          />
          <VenueAndAuthors
            pageType={pageType}
            actionArea={actionArea}
            paper={paper}
            journal={journal}
            conferenceInstance={conferenceInstance}
            publishedDate={publishedDate}
            authors={authors}
          />
          {abstract}
          {buttons}
        </div>
      </div>
    );
  }
}

export default withStyles<typeof RawPaperItem>(styles)(RawPaperItem);
