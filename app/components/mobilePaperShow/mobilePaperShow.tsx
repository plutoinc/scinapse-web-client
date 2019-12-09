import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from '@pluto_network/pluto-design-elements';
import PaperShowHelmet from '../paperShow/helmet';
import { formulaeToHTMLStr } from '../../helpers/displayFormula';
import { AppState } from '../../reducers';
import MobileVenueAuthors from '../common/paperItem/mobileVenueAuthors';
import MobilePaperShowButtonGroup from '../mobilePaperShowButtonGroup';
import CopyDOIButton from '../copyDOIButton/copyDOIButton';
import MobilePaperShowTab from '../mobilePaperShowTab/mobilePaperShowTab';
import GoBackResultBtn from '../paperShow/backButton';
import { AvailablePaperShowTab } from '../paperShowTabItem/paperShowTabItem';
import MobileRelatedPapers from '../mobileRelatedPapers/mobileRelatedPapers';
import MobileRefCitedPapers from '../paperShow/refCitedPapers/mobileRefCitedPapers';
import PaperShowFigureList from '../paperShow/components/paperShowFigureList';
import Icon from '../../icons';
import { Paper } from '../../model/paper';
import { PaperShowMatchParams } from '../../containers/paperShow/types';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
import RefCitedPapersContainer from '../../containers/refCitedPapersContainer';
import ArticleSpinner from '../common/spinner/articleSpinner';

const s = require('./mobilePaperShow.scss');
const useStyles = require('isomorphic-style-loader/useStyles');
const NAVBAR_HEIGHT = parseInt(s.navbarHeight, 10);

let ticking = false;

type MobilePaperShowProps = RouteComponentProps<PaperShowMatchParams> & {
  paper: Paper;
};
type CurrentPosition = 'abovePaperInfo' | 'underPaperInfo' | 'onRelatedList' | 'onRefList' | 'onCitedList';

function getActiveTab(currentPosition: CurrentPosition): AvailablePaperShowTab | null {
  if (currentPosition === 'onRelatedList') return AvailablePaperShowTab.related;
  if (currentPosition === 'onRefList') return AvailablePaperShowTab.ref;
  if (currentPosition === 'onCitedList') return AvailablePaperShowTab.cited;
  return null;
}

const MobilePaperShow: React.FC<MobilePaperShowProps> = ({ paper, location }) => {
  useStyles(s);
  const isLoading = useSelector((state: AppState) => state.paperShow.isLoadingPaper);
  const relatedPaperIds = useSelector((state: AppState) => state.relatedPapersState.paperIds, isEqual);

  const [currentPosition, setCurrentPosition] = React.useState<CurrentPosition>('abovePaperInfo');
  const lastPosition = React.useRef<CurrentPosition>('abovePaperInfo');
  const buttonGroupWrapper = React.useRef<HTMLDivElement | null>(null);
  const fixedTab = React.useRef<HTMLDivElement | null>(null);
  const refSection = React.useRef<HTMLDivElement | null>(null);
  const citedSection = React.useRef<HTMLDivElement | null>(null);
  const relatedTabWrapper = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(
    () => {
      function handleScroll() {
        if (!ticking) {
          requestAnimationFrame(() => {
            if (!buttonGroupWrapper.current || !fixedTab.current || !refSection.current || !citedSection.current) {
              return (ticking = false);
            }

            const scrollTop =
              (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            const currentScrollTop = Math.round(scrollTop) + NAVBAR_HEIGHT;
            const buttonGroupOffsetTop = buttonGroupWrapper.current.offsetTop - 16 /* margin */;
            const refSectionOffsetTop = refSection.current.offsetTop - fixedTab.current.clientHeight;
            const citedSectionOffsetTop = citedSection.current.offsetTop - fixedTab.current.clientHeight;

            if (relatedTabWrapper.current) {
              const relatedTabWrapperOffsetTop =
                relatedTabWrapper.current.offsetTop -
                fixedTab.current.clientHeight +
                relatedTabWrapper.current.clientHeight;

              if (currentScrollTop < buttonGroupOffsetTop && lastPosition.current !== 'abovePaperInfo') {
                setCurrentPosition('abovePaperInfo');
                lastPosition.current = 'abovePaperInfo';
              } else if (
                currentScrollTop >= buttonGroupOffsetTop &&
                currentScrollTop < relatedTabWrapperOffsetTop &&
                lastPosition.current !== 'underPaperInfo'
              ) {
                setCurrentPosition('underPaperInfo');
                lastPosition.current = 'underPaperInfo';
              } else if (
                currentScrollTop >= relatedTabWrapperOffsetTop &&
                currentScrollTop < refSectionOffsetTop &&
                lastPosition.current !== 'onRelatedList'
              ) {
                setCurrentPosition('onRelatedList');
                lastPosition.current = 'onRelatedList';
              } else if (
                currentScrollTop >= refSectionOffsetTop &&
                currentScrollTop < citedSectionOffsetTop &&
                lastPosition.current !== 'onRefList'
              ) {
                setCurrentPosition('onRefList');
                lastPosition.current = 'onRefList';
              } else if (currentScrollTop >= citedSectionOffsetTop && lastPosition.current !== 'onCitedList') {
                setCurrentPosition('onCitedList');
                lastPosition.current = 'onCitedList';
              }
            } else {
              if (currentScrollTop < buttonGroupOffsetTop && lastPosition.current !== 'abovePaperInfo') {
                setCurrentPosition('abovePaperInfo');
                lastPosition.current = 'abovePaperInfo';
              } else if (
                currentScrollTop >= buttonGroupOffsetTop &&
                currentScrollTop < refSectionOffsetTop &&
                lastPosition.current !== 'underPaperInfo'
              ) {
                setCurrentPosition('underPaperInfo');
                lastPosition.current = 'underPaperInfo';
              } else if (
                currentScrollTop >= refSectionOffsetTop &&
                currentScrollTop < citedSectionOffsetTop &&
                lastPosition.current !== 'onRefList'
              ) {
                setCurrentPosition('onRefList');
                lastPosition.current = 'onRefList';
              } else if (currentScrollTop >= citedSectionOffsetTop && lastPosition.current !== 'onCitedList') {
                setCurrentPosition('onCitedList');
                lastPosition.current = 'onCitedList';
              }
            }

            ticking = false;
          });
        }
        ticking = true;
      }

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    },
    [isLoading]
  );

  function handleClickPaperShowTab(tab: AvailablePaperShowTab) {
    if (!refSection.current || !citedSection.current || !fixedTab.current) return;

    let destination = 0;
    if (relatedTabWrapper.current && tab === AvailablePaperShowTab.related) {
      destination = relatedTabWrapper.current.offsetTop - fixedTab.current.clientHeight - NAVBAR_HEIGHT;
    } else if (tab === AvailablePaperShowTab.ref) {
      // NOTE: 12 means kind of margin-top
      destination = refSection.current.offsetTop - fixedTab.current.clientHeight - NAVBAR_HEIGHT;
    } else if (tab === AvailablePaperShowTab.cited) {
      destination = citedSection.current.offsetTop - fixedTab.current.clientHeight - NAVBAR_HEIGHT;
    }

    window.scrollTo(0, destination);
  }

  const activeTabInFixedHeader = getActiveTab(currentPosition);
  const shouldShowRelatedTab = relatedPaperIds && relatedPaperIds.length > 0;
  const queryParams = getQueryParamsObject(location.search);
  const refPage = queryParams['ref-page'] || 1;
  const refQuery = queryParams['ref-query'] || '';
  const refSort = queryParams['ref-sort'] || 'NEWEST_FIRST';
  const citedPage = queryParams['cited-page'] || 1;
  const citedQuery = queryParams['cited-query'] || '';
  const citedSort = queryParams['cited-sort'] || 'NEWEST_FIRST';
  // TODO: add fallback logic for PDF address
  const pdfURL = paper.bestPdf && paper.bestPdf.hasBest && paper.bestPdf.url;

  if (isLoading) {
    return (
      <div className={s.loadingContainer}>
        <ArticleSpinner />
      </div>
    );
  }

  return (
    <>
      <PaperShowHelmet paper={paper} />
      <div className={s.container}>
        <div className={s.contentWrapper}>
          <GoBackResultBtn className={s.backBtn} />
          <h1 className={s.title} dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(paper.title) }} />
          <MobileVenueAuthors paper={paper} pageType={'paperShow'} actionArea="paperDescription" />
          <div ref={buttonGroupWrapper}>
            <MobilePaperShowButtonGroup
              className={s.btnGroupWrapper}
              paper={paper}
              pageType={'paperShow'}
              actionArea="paperDescription"
              saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
            />
          </div>
          <div className={s.abstractHeaderWrapper}>
            <div className={s.abstractHeader}>Abstract</div>
            <CopyDOIButton
              className={s.copyDOIButton}
              doi={paper.doi}
              paperId={paper.id}
              pageType="paperShow"
              actionArea="paperDescription"
            />
          </div>
          <div className={s.abstractContent} dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(paper.abstract) }} />
        </div>
        {pdfURL && (
          <div style={{ margin: '16px 16px 0 16px' }}>
            <Button elementType="anchor" href={pdfURL} size="large" color="black" fullWidth={true} target="_blank">
              <Icon icon="SOURCE" />
              <span>View PDF</span>
            </Button>
          </div>
        )}
        <div className={s.container}>
          <PaperShowFigureList paper={paper} isMobile />
        </div>
        <div
          ref={fixedTab}
          className={classNames({
            [s.fixedTab]: true,
            [s.active]: currentPosition !== 'abovePaperInfo',
          })}
        >
          {currentPosition === 'underPaperInfo' && (
            <div className={s.buttonGroupWrapper}>
              <MobilePaperShowButtonGroup
                className={s.fixedBtnGroupWrapper}
                paper={paper}
                pageType="paperShow"
                actionArea="refCitedTab"
                saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
              />
            </div>
          )}
          {!!activeTabInFixedHeader && (
            <div className={s.fixedRefCitedTab}>
              <MobilePaperShowTab
                active={activeTabInFixedHeader}
                onClick={handleClickPaperShowTab}
                paper={paper}
                shouldShowRelatedTab={shouldShowRelatedTab}
              />
            </div>
          )}
        </div>
      </div>
      <div className={s.paperListSection}>
        {shouldShowRelatedTab && (
          <>
            <div ref={relatedTabWrapper} style={{ marginTop: '48px', marginBottom: '36px' }}>
              <MobilePaperShowTab
                active={AvailablePaperShowTab.related}
                onClick={handleClickPaperShowTab}
                shouldShowRelatedTab={shouldShowRelatedTab}
                paper={paper}
              />
            </div>
            <div className={s.relatedPaperTitle}>📖 Papers frequently viewed together</div>
            <MobileRelatedPapers paperIds={relatedPaperIds} className={s.relatedPapers} />
          </>
        )}
        <div className={s.refCitedSection} ref={refSection}>
          <RefCitedPapersContainer
            type="reference"
            parentPaperId={paper.id}
            page={refPage}
            sort={refSort}
            query={refQuery}
          >
            <MobileRefCitedPapers type="reference" parentPaperId={paper.id} paperCount={paper.referenceCount} />
          </RefCitedPapersContainer>
        </div>
        <div className={s.refCitedSection} ref={citedSection}>
          <RefCitedPapersContainer
            type="cited"
            parentPaperId={paper.id}
            page={citedPage}
            sort={citedSort}
            query={citedQuery}
          >
            <MobileRefCitedPapers type="cited" parentPaperId={paper.id} paperCount={paper.citedCount} />
          </RefCitedPapersContainer>
        </div>
      </div>
    </>
  );
};

export default withRouter(MobilePaperShow);
