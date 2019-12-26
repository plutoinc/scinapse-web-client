import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '../../helpers/withStylesHelper';
import PaperShowCollectionControlButton from '../paperShowCollectionControlButton';
import CiteBox from './components/citeBox';
import { Paper } from '../../model/paper';
import { CurrentUser } from '../../model/currentUser';
import SourceButton from '../../components/paperShow/components/sourceButton';
import ViewFullTextBtn from '../../components/paperShow/components/viewFullTextBtn';
import RequestPaperBtn from './components/paperRequestBtn';
import { openRequestPaperDialog } from '../../reducers/requestPaperDialog';
const s = require('./actionBar.scss');

interface PaperShowActionBarProps {
  paper: Paper;
  dispatch: Dispatch<any>;
  hasPDFFullText: boolean;
  isLoadingPDF: boolean;
  currentUser: CurrentUser;
  handleClickFullText: () => void;
  lastRequestedDate: string | null;
}

const PaperShowActionBar: React.FC<PaperShowActionBarProps> = props => {
  const requestFullTextBtnEl = React.useRef<HTMLDivElement | null>(null);

  const requestButton = (
    <div className={s.actionItem} ref={requestFullTextBtnEl}>
      <RequestPaperBtn
        actionArea="paperDescription"
        isLoading={props.isLoadingPDF}
        paper={props.paper}
        onClick={() => props.dispatch(openRequestPaperDialog())}
        lastRequestedDate={props.lastRequestedDate}
      />
    </div>
  );

  return (
    <div className={s.actionBar}>
      <div className={s.actions}>
        <div className={s.leftSide}>
          {!props.hasPDFFullText ? (
            requestButton
          ) : (
            <div className={s.actionItem}>
              <ViewFullTextBtn
                paperId={props.paper.id}
                handleClickFullText={props.handleClickFullText}
                isLoading={props.isLoadingPDF}
              />
            </div>
          )}
          {props.paper.bestPdf && (
            <div className={s.actionItem}>
              <SourceButton paper={props.paper} showFullText={props.paper.bestPdf.hasBest} />
            </div>
          )}
          <div className={s.actionItem}>
            <CiteBox actionArea="paperDescription" paper={props.paper} />
          </div>
        </div>
        <div className={s.rightSide}>
          <PaperShowCollectionControlButton paperId={props.paper.id} />
        </div>
      </div>
    </div>
  );
};

export default connect()(withStyles<typeof PaperShowActionBar>(s)(PaperShowActionBar));
