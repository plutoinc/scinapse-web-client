import * as React from "react";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import * as format from "date-fns/format";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import Title from "../../common/paperItem/title";
import Abstract from "../../common/paperItem/abstract";
import AuthorSection from "../components/authors";
import { withStyles } from "../../../helpers/withStylesHelper";
import { PaperItemWithToggleListProps, VenueSectionProps, TrackingProps } from "../types";
import Icon from "../../../icons";
const s = require("../paperItemWithToggleList.scss");

const IFLabel: React.FC<{ IF: number | null }> = props => {
  const { IF } = props;

  if (IF)
    return (
      <span className={s.ifLabel}>
        <span>
          <Tooltip
            title="Impact Factor"
            placement="top"
            classes={{ tooltip: s.arrowBottomTooltip }}
            disableFocusListener
            disableTouchListener
          >
            <span>
              <Icon className={s.ifIconWrapper} icon="IMPACT_FACTOR" />
            </span>
          </Tooltip>
          {IF ? IF.toFixed(2) : 0}
        </span>
      </span>
    );
  return null;
};

const VenueSection: React.FC<VenueSectionProps & TrackingProps> = props => {
  const { paper, pageType, actionArea } = props;
  const publishedYearInfoSection = paper.publishedDate ? (
    <span>{`${format(paper.publishedDate, "YYYY")} in `}</span>
  ) : null;

  let content;
  if (paper.journal) {
    content = (
      <span>
        <Link
          onClick={() => {
            ActionTicketManager.trackTicket({
              pageType,
              actionType: "fire",
              actionArea: actionArea || pageType,
              actionTag: "journalShow",
              actionLabel: String(paper.journal!.id),
            });
          }}
          className={s.journalLink}
          to={`/journals/${paper.journal.id}`}
        >
          {paper.journal.title}
        </Link>
        <IFLabel IF={paper.journal.impactFactor} />
      </span>
    );
  } else if (paper.conferenceInstance && paper.conferenceInstance.conferenceSeries) {
    content = <span>{` in ${paper.conferenceInstance.conferenceSeries.name}`}</span>;
  }

  if (content) {
    return (
      <div className={s.venueSection}>
        <Icon icon="JOURNAL" className={s.journalIcon} />
        {publishedYearInfoSection}
        {content}
      </div>
    );
  }

  return null;
};

const BasePaperItem: React.FC<PaperItemWithToggleListProps & TrackingProps> = React.memo(props => {
  const { paper, pageType, actionArea, searchQueryText } = props;

  let source: string;
  if (!!paper.doi) {
    source = `https://doi.org/${paper.doi}`;
  } else if (paper.urls && paper.urls.length > 0) {
    source = paper.urls[0].url;
  } else {
    source = "";
  }

  return (
    <>
      <Title
        paperId={paper.id}
        paperTitle={paper.title}
        highlightTitle={paper.titleHighlighted}
        highlightAbstract={paper.abstractHighlighted}
        pageType={pageType}
        actionArea={actionArea}
        source={source}
        titleClassName={s.title}
        disableNewTabIcon
      />
      <VenueSection pageType={pageType} actionArea={actionArea} paper={paper} />
      <AuthorSection paper={paper} pageType={pageType} actionArea={actionArea} />
      <Abstract
        paperId={paper.id}
        pageType={pageType}
        actionArea={actionArea}
        abstract={paper.abstractHighlighted || paper.abstract}
        searchQueryText={searchQueryText}
        maxLength={200}
      />
    </>
  );
});

export default withStyles<typeof BasePaperItem>(s)(BasePaperItem);
