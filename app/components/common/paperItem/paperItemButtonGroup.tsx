import React from 'react';
import { useSelector } from 'react-redux';
import { Paper } from '../../../model/paper';
import CitationListLinkButton from './citationListLinkButton';
import SourceButton from './sourceButton';
import CiteButton from './citeButton';
import CollectionButton from './collectionButton';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperSource } from '../../../api/paper';
import MoreDropdownButton from './moreDropdownButton';
import { AppState } from '../../../reducers';
import { UserDevice } from '../../layouts/reducer';
import ResolveNotIncludedButton from './resolveNotIncludedButton';
const s = require('./paperItemButtonGroup.scss');

interface PaperItemButtonGroupProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  paperSource?: PaperSource;
  saved?: boolean;
  dropdownContents?: React.ReactElement[];
  ownProfileSlug?: string;
}

const PaperItemButtonGroup: React.FC<PaperItemButtonGroupProps> = ({
  paper,
  pageType,
  actionArea,
  paperSource,
  saved,
  dropdownContents,
  ownProfileSlug,
}) => {
  const userDevice = useSelector<AppState, UserDevice>(state => state.layout.userDevice);

  const paperControlButton =
    pageType === 'profileShow' && actionArea === 'searchPaperList' && !!ownProfileSlug ? (
      <ResolveNotIncludedButton
        paper={paper}
        pageType={pageType}
        actionArea={actionArea}
        ownProfileSlug={ownProfileSlug}
      />
    ) : (
      <CollectionButton paper={paper} saved={!!saved} pageType={pageType} actionArea={actionArea} />
    );

  if (userDevice === UserDevice.MOBILE) {
    return (
      <div className={s.mobileWrapper}>
        <div className={s.buttonWrapper}>
          <CitationListLinkButton paper={paper} pageType={pageType} actionArea={actionArea} />
        </div>
        <div className={s.buttonWrapper}>
          <SourceButton
            paper={paper}
            pageType={pageType}
            actionArea={actionArea}
            paperSource={paperSource}
            isMobile={userDevice === UserDevice.MOBILE}
          />
        </div>
        <div className={s.buttonWrapper}>{paperControlButton}</div>
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
        <div className={s.buttonWrapper}>
          <CiteButton paper={paper} pageType={pageType} actionArea={actionArea} />
        </div>
        <div className={s.buttonWrapper}>{paperControlButton}</div>
      </div>
    </div>
  );
};

export default withStyles<typeof PaperItemButtonGroup>(s)(PaperItemButtonGroup);
