import React from 'react';
import { useSelector } from 'react-redux';

import { formulaeToHTMLStr } from '../../helpers/displayFormula';
import { getMemoizedPaper } from './select';
import { AppState } from '../../reducers';
import MobileVenueAuthors from '../../components/common/paperItem/mobileVenueAuthors';
import PaperItemButtonGroup from '../../components/common/paperItem/paperItemButtonGroup';
import GoBackResultBtn from '../../components/paperShow/backButton';
import ReferencePapers from '../../components/paperShow/refCitedPapers/referencePapers';
import CitedPapers from '../../components/paperShow/refCitedPapers/citedPapers';
const s = require('./mobilePaperShow.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

interface MobilePaperShowProps {}

const MobilePaperShow: React.FC<MobilePaperShowProps> = ({}) => {
  useStyles(s);
  const paper = useSelector((state: AppState) => getMemoizedPaper(state));
  const refTabWrapper = React.useRef<HTMLDivElement | null>(null);
  const citedTabWrapper = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className={s.container}>
      <div className={s.contentWrapper}>
        <GoBackResultBtn />
        <h1 className={s.title} dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(paper.title) }} />
        <MobileVenueAuthors paper={paper} pageType={'paperShow'} actionArea="paperDescription" />
        <PaperItemButtonGroup
          paper={paper}
          pageType={'paperShow'}
          actionArea="paperDescription"
          saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
        />
        <div className={s.abstractHeader}>Abstract</div>
        <div className={s.abstractContent} dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(paper.abstract) }} />
      </div>

      <div className={s.refCitedTabWrapper} ref={refTabWrapper}>
        <div className={s.tabPaperTitle}>{paper.title}</div>
        <PaperItemButtonGroup
          paper={paper}
          pageType={'paperShow'}
          actionArea="refCitedTab"
          saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
        />
      </div>
      <div className={s.citedBy}>
        <article className={s.paperShow}>
          <div>
            <span className={s.sectionTitle}>References</span>
            <span className={s.sectionCount}>{paper.referenceCount}</span>
          </div>
          <div className={s.otherPapers}>
            <div className={s.references}>
              <ReferencePapers isMobile refTabEl={refTabWrapper.current} />
            </div>
          </div>
        </article>
      </div>
      <div className={s.sectionDivider} />
      <div className={s.refCitedTabWrapper} ref={citedTabWrapper} />
      <div className={s.citedBy}>
        <article className={s.paperShow}>
          <div>
            <span className={s.sectionTitle}>Cited By</span>
            <span className={s.sectionCount}>{paper.citedCount}</span>
          </div>
          <div className={s.otherPapers}>
            <CitedPapers isMobile citedTabEl={citedTabWrapper.current} />
          </div>
        </article>
      </div>
    </div>
  );
};

export default MobilePaperShow;
