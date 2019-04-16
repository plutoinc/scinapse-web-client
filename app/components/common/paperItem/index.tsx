import * as React from "react";
import { CurrentUser } from "../../../model/currentUser";
import Abstract from "./abstract";
import PaperActionButtons from "./paperActionButtons";
import Title from "./title";
import VenueAndAuthors from "./venueAndAuthors";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Paper } from "../../../model/paper";
import SavedCollections from "./savedCollections";
const styles = require("./paperItem.scss");

export interface PaperItemProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  shouldBlockUnverifiedUser?: boolean;
  actionArea: Scinapse.ActionTicket.ActionArea;
  currentPage?: number;
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

class BasePaperItem extends React.PureComponent<PaperItemProps> {
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
      shouldBlockUnverifiedUser,
      currentPage,
    } = this.props;
    const { title, titleHighlighted, authors, publishedDate, doi, urls, journal, conferenceInstance, relation } = paper;

    const abstract = !omitAbstract ? (
      <Abstract
        paperId={paper.id}
        pageType={pageType}
        actionArea={actionArea}
        abstract={paper.abstractHighlighted || paper.abstract}
        searchQueryText={searchQueryText}
        currentPage={currentPage}
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
      <div style={wrapperStyle} className={`${wrapperClassName ? wrapperClassName : styles.paperItemWrapper}`}>
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
            shouldBlockUnverifiedUser={!!shouldBlockUnverifiedUser}
            currentPage={currentPage}
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

export default withStyles<typeof BasePaperItem>(styles)(BasePaperItem);
