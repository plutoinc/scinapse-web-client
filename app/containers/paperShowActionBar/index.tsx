import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import FullTextDialog from "./components/fullTextDialog";
import PaperShowCollectionControlButton from "../paperShowCollectionControlButton";
import CiteBox from "./components/citeBox";
import { Paper } from "../../model/paper";
import { CurrentUser } from "../../model/currentUser";
import SourceButton from "../../components/paperShow/components/sourceButton";
import ViewFullTextBtn from "../../components/paperShow/components/viewFullTextBtn";
import FullTextBtn from "./components/fullTextBtn";
const s = require("./actionBar.scss");

interface PaperShowActionBarProps {
  paper: Paper | null;
  hasBestPdf: boolean;
  showFullText: boolean;
  isLoadingOaCheck: boolean;
  currentUser: CurrentUser;
  handleClickFullText: () => void;
}

const PaperShowActionBar: React.FunctionComponent<PaperShowActionBarProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!props.paper) return null;

  const hasSource = props.paper.urls.length > 0;

  return (
    <div className={s.actionBar}>
      <div className={s.actions}>
        <div className={s.leftSide}>
          {!props.hasBestPdf ? (
            <div className={s.actionItem}>
              <FullTextBtn
                isLoadingOaCheck={props.isLoadingOaCheck}
                paperId={props.paper!.id}
                handleSetIsOpen={setIsOpen}
              />
            </div>
          ) : (
            <div className={s.actionItem}>
              <ViewFullTextBtn
                handleClickFullText={props.handleClickFullText}
                isLoadingOaCheck={props.isLoadingOaCheck}
              />
            </div>
          )}
          {hasSource && (
            <div className={s.actionItem}>
              <SourceButton paper={props.paper} showFullText={props.hasBestPdf} />
            </div>
          )}
          <div className={s.actionItem}>
            <CiteBox paper={props.paper} />
          </div>
          <FullTextDialog
            paperId={props.paper.id}
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
          />
        </div>
        <div className={s.rightSide}>
          <PaperShowCollectionControlButton />
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof PaperShowActionBar>(s)(PaperShowActionBar);
