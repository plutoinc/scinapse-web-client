import React from 'react';
import { useSelector } from 'react-redux';
import { Paper } from '../../../model/paper';
import CitationListLinkButton from './citationListLinkButton';
import SourceButton from './sourceButton';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperSource } from '../../../api/paper';
import MoreDropdownButton from './moreDropdownButton';
import { AppState } from '../../../reducers';
import { UserDevice } from '../../layouts/reducer';
import PaperItemButtonGroup from './paperItemButtonGroup';
import ResolveUnconfirmedButtons from './resolveUnconfirmedButtons';
const s = require('./paperItemButtonGroup.scss');

interface UnconfirmedPaperItemButtonGroupProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  fetchProfileShowData: () => void;
  paperSource?: PaperSource;
  saved?: boolean;
  dropdownContents?: React.ReactElement[];
  ownProfileSlug?: string;
  isEditable?: boolean;
}

const UnconfirmedPaperItemButtonGroup: React.FC<UnconfirmedPaperItemButtonGroupProps> = ({
  paper,
  pageType,
  actionArea,
  paperSource,
  dropdownContents,
  ownProfileSlug,
  isEditable,
  fetchProfileShowData,
}) => {
  const userDevice = useSelector<AppState, UserDevice>(state => state.layout.userDevice);

  if (paper.isConfirmed || !isEditable) {
    return (
      <PaperItemButtonGroup
        paper={paper}
        pageType={pageType}
        actionArea={actionArea}
        paperSource={paperSource}
        saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
        dropdownContents={dropdownContents}
      />
    );
  }

  if (userDevice === UserDevice.MOBILE) {
    return (
      <div className={s.mobileWrapper}>
        <div className={s.buttonWrapper}>
          <CitationListLinkButton paper={paper} pageType={pageType} actionArea={actionArea} />
        </div>
        <ResolveUnconfirmedButtons
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          ownProfileSlug={ownProfileSlug}
          isMobile={userDevice === UserDevice.MOBILE}
          fetchProfileShowData={fetchProfileShowData}
        />
      </div>
    );
  }

  return (
    <div className={s.groupWrapper}>
      <div className={s.buttonListBox}>
        <CitationListLinkButton paper={paper} pageType={pageType} actionArea={actionArea} />
        <SourceButton paper={paper} pageType={pageType} actionArea={actionArea} paperSource={paperSource} />
        <MoreDropdownButton dropdownContents={dropdownContents} paper={paper} />
      </div>
      <div className={s.buttonListBox}>
        <ResolveUnconfirmedButtons
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          ownProfileSlug={ownProfileSlug}
          fetchProfileShowData={fetchProfileShowData}
        />
      </div>
    </div>
  );
};

export default withStyles<typeof UnconfirmedPaperItemButtonGroup>(s)(UnconfirmedPaperItemButtonGroup);
