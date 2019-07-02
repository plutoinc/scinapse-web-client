import * as React from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import FullTextDialog from './components/fullTextDialog';
import PaperShowCollectionControlButton from '../paperShowCollectionControlButton';
import CiteBox from './components/citeBox';
import { Paper } from '../../model/paper';
import { CurrentUser } from '../../model/currentUser';
import SourceButton from '../../components/paperShow/components/sourceButton';
import ViewFullTextBtn from '../../components/paperShow/components/viewFullTextBtn';
import RequestFullTextBtn from './components/fullTextRequestBtn';
const s = require('./actionBar.scss');

interface PaperShowActionBarProps {
  paper: Paper;
  hasPDFFullText: boolean;
  isLoadingPDF: boolean;
  currentUser: CurrentUser;
  handleClickFullText: () => void;
}

const PaperShowActionBar: React.FC<PaperShowActionBarProps> = React.memo(props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const requestFullTextBtnEl = React.useRef<HTMLDivElement | null>(null);
  const hasSource = props.paper.urls.length > 0;

  return (
    <div className={s.actionBar}>
      <div className={s.actions}>
        <div className={s.leftSide}>
          {!props.hasPDFFullText ? (
            <div className={s.actionItem} ref={requestFullTextBtnEl}>
              <RequestFullTextBtn
                actionArea="paperDescription"
                isLoading={props.isLoadingPDF}
                paperId={props.paper!.id}
                currentUser={props.currentUser}
                handleSetIsOpen={setIsOpen}
              />
            </div>
          ) : (
            <div className={s.actionItem}>
              <ViewFullTextBtn
                paperId={props.paper.id}
                handleClickFullText={props.handleClickFullText}
                isLoading={props.isLoadingPDF}
              />
            </div>
          )}
          {hasSource &&
            props.paper.bestPdf && (
              <div className={s.actionItem}>
                <SourceButton
                  paper={props.paper}
                  showFullText={props.paper.bestPdf.hasBest}
                  currentUser={props.currentUser}
                />
              </div>
            )}
          <div className={s.actionItem}>
            <CiteBox actionArea="paperDescription" paper={props.paper} currentUser={props.currentUser} />
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
          <PaperShowCollectionControlButton paperId={props.paper.id} />
        </div>
      </div>
    </div>
  );
});

export default withStyles<typeof PaperShowActionBar>(s)(PaperShowActionBar);
