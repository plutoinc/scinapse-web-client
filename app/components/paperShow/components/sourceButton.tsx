import * as React from "react";
import * as classNames from "classnames";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { Paper } from "../../../model/paper";
import { withStyles } from "../../../helpers/withStylesHelper";
import ScinapseButtonFactory, { ScinapseButtonType } from "../../common/scinapseButton/scinapseButtonFactory";
import SourceURLPopover from "../../common/sourceURLPopover";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import Icon from "../../../icons";
const styles = require("./pdfSourceButton.scss");

interface SourceButtonProps {
  paper: Paper;
  showFullText: boolean;
  wrapperStyle?: React.CSSProperties;
}

const SourceButton: React.FunctionComponent<SourceButtonProps> = props => {
  const { paper, showFullText } = props;
  const [isSourcePopoverOpen, setIsSourcePopoverOpen] = React.useState(false);
  const anchorEl = React.useRef<HTMLDivElement | null>(null);

  function handleClickSource() {
    ActionTicketManager.trackTicket({
      pageType: "paperShow",
      actionType: "fire",
      actionArea: "paperDescription",
      actionTag: "source",
      actionLabel: String(paper.id),
    });
  }

  function handleCloseSourceDropdown() {
    setIsSourcePopoverOpen(false);
  }

  if (!paper.doi && paper.urls.length === 0) {
    // no source
    return null;
  }

  const sourceUrl = paper.doi ? `https://doi.org/${paper.doi}` : paper.urls[0].url;

  const btnStyle: React.CSSProperties = {
    height: "100%",
    width: "36px",
    borderLeft: "solid 1px #f1f3f6",
    borderRight: "solid 1px #d8dde7",
  };

  const reverseBtnStyle: React.CSSProperties = { height: "100%", width: "36px", borderLeft: "solid 1px #6096ff" };
  const Button = ScinapseButtonFactory(ScinapseButtonType.buttonWithArrow);

  return (
    <ClickAwayListener onClickAway={handleCloseSourceDropdown}>
      <div ref={anchorEl}>
        <Button
          aria-label="Scinapse viewInSource button in paper"
          isUpArrow={!isSourcePopoverOpen}
          hasArrow={paper.urls.length > 0}
          text="View in Source"
          arrowIconClassName={styles.arrowIcon}
          className={classNames({
            [styles.downloadButton]: true,
            [styles.reverseDownloadBtn]: !showFullText,
          })}
          textWrapperClassName={styles.sourceButtonTextWrapper}
          linkProps={{
            href: sourceUrl,
            target: "_blank",
            rel: "noopener",
            className: styles.linkClassName,
            onClick: e => {
              e.preventDefault();
              handleClickSource();
              window.open(sourceUrl, "_blank");
            },
          }}
          dropdownBtnProps={{
            onClick: () => {
              setIsSourcePopoverOpen(!isSourcePopoverOpen);
            },
            style: !showFullText ? reverseBtnStyle : btnStyle,
            className: styles.dropdownBtn,
          }}
          leftIconNode={<Icon icon="EXTERNAL_SOURCE" className={styles.sourceIcon} />}
        />
      </div>
      <SourceURLPopover
        isOpen={isSourcePopoverOpen}
        handleCloseFunc={handleCloseSourceDropdown}
        paperSources={paper.urls}
        pageType="paperShow"
        paperId={paper.id}
        anchorEl={anchorEl.current}
        actionArea="paperDescription"
      />
    </ClickAwayListener>
  );
};

export default withStyles<typeof SourceButton>(styles)(SourceButton);
