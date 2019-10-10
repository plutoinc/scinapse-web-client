import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { formulaeToHTMLStr } from '../../helpers/displayFormula';
import { getMemoizedPaper } from './select';
import { AppState } from '../../reducers';
import MobileVenueAuthors from '../../components/common/paperItem/mobileVenueAuthors';
import MobilePaperShowButtonGroup from '../../components/mobilePaperShowButtonGroup';
import CopyDOIButton from '../../components/copyDOIButton/copyDOIButton';
import MobilePaperShowTab from '../../components/mobilePaperShowTab/mobilePaperShowTab';
import GoBackResultBtn from '../../components/paperShow/backButton';
import { PaperShowMatchParams } from './types';
import { AvailablePaperShowTab } from '../../components/paperShowTabItem/paperShowTabItem';
import { fetchMobilePaperShowData } from '../../actions/paperShow';
import MobileRelatedPapers from '../../components/mobileRelatedPapers/mobileRelatedPapers';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
import { fetchRefPaperData, fetchCitedPaperData } from './sideEffect';
import MobileRefCitedPapers from '../../components/paperShow/refCitedPapers/mobileRefCitedPapers';

const s = require('./mobilePaperShow.scss');
const useStyles = require('isomorphic-style-loader/useStyles');
const NAVBAR_HEIGHT = parseInt(s.headerHeight, 10);

let ticking = false;

type MobilePaperShowProps = RouteComponentProps<PaperShowMatchParams>;
type CurrentPosition = 'abovePaperInfo' | 'underPaperInfo' | 'onRelatedList' | 'onRefList' | 'onCitedList';

function getActiveTab(currentPosition: CurrentPosition): AvailablePaperShowTab | null {
  if (currentPosition === 'onRelatedList') return AvailablePaperShowTab.related;
  if (currentPosition === 'onRefList') return AvailablePaperShowTab.ref;
  if (currentPosition === 'onCitedList') return AvailablePaperShowTab.cited;
  return null;
}

const MobilePaperShow: React.FC<MobilePaperShowProps> = props => {
  useStyles(s);
  const { match, location } = props;
  const dispatch = useDispatch();

  const paper = useSelector((state: AppState) => getMemoizedPaper(state));
  const currentUser = useSelector((state: AppState) => state.currentUser, isEqual);
  const shouldPatch = useSelector(
    (state: AppState) => !state.configuration.succeedAPIFetchAtServer || state.configuration.renderedAtClient
  );
  const relatedPaperIds = useSelector((state: AppState) => state.relatedPapersState.paperIds, isEqual);

  const [currentPosition, setCurrentPosition] = React.useState<CurrentPosition>('abovePaperInfo');
  const lastShouldPatch = React.useRef(shouldPatch);
  const lastPosition = React.useRef<CurrentPosition>('abovePaperInfo');
  const buttonGroupWrapper = React.useRef<HTMLDivElement | null>(null);
  const fixedButtonHeader = React.useRef<HTMLDivElement | null>(null);
  const refSection = React.useRef<HTMLDivElement | null>(null);
  const citedSection = React.useRef<HTMLDivElement | null>(null);
  const relatedTabWrapper = React.useRef<HTMLDivElement | null>(null);

  const paperId = paper && paper.id;

  React.useEffect(() => {
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (
            !buttonGroupWrapper.current ||
            !fixedButtonHeader.current ||
            !refSection.current ||
            !citedSection.current
          ) {
            return (ticking = false);
          }

          const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
          const currentScrollTop = scrollTop + NAVBAR_HEIGHT;
          const buttonGroupOffsetTop = buttonGroupWrapper.current.offsetTop - 16 /* margin */;
          const refSectionOffsetTop = refSection.current.offsetTop - fixedButtonHeader.current.clientHeight;
          const citedSectionOffsetTop = citedSection.current.offsetTop - fixedButtonHeader.current.clientHeight;

          if (relatedTabWrapper.current) {
            const relatedTabWrapperOffsetTop =
              relatedTabWrapper.current.offsetTop -
              fixedButtonHeader.current.clientHeight +
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
  }, []);

  React.useEffect(
    () => {
      const cancelToken = axios.CancelToken.source();
      // NOTE: prevent patching from the change of shouldPatch variable
      if (shouldPatch && !lastShouldPatch.current) {
        lastShouldPatch.current = true;
        return;
      }
      // NOTE: prevent double patching
      if (!shouldPatch) return;

      dispatch(
        fetchMobilePaperShowData({
          paperId: parseInt(match.params.paperId, 10),
          isLoggedIn: currentUser.isLoggedIn,
          cancelToken: cancelToken.token,
        })
      );

      return () => {
        cancelToken.cancel();
      };
    },
    [location.pathname, currentUser.isLoggedIn, dispatch, match, shouldPatch]
  );

  const queryParams = getQueryParamsObject(location.search);
  const refPage = queryParams['ref-page'] || 1;
  const refQuery = queryParams['ref-query'] || '';
  const refSort = queryParams['ref-sort'] || 'NEWEST_FIRST';
  const citedPage = queryParams['cited-page'] || 1;
  const citedQuery = queryParams['cited-query'] || '';
  const citedSort = queryParams['cited-sort'] || 'NEWEST_FIRST';
  React.useEffect(
    () => {
      if (!paperId) return;
      // NOTE: prevent patching from the change of shouldPatch variable
      if (shouldPatch && !lastShouldPatch.current) {
        lastShouldPatch.current = true;
        return;
      }
      // NOTE: prevent double patching
      if (!shouldPatch) return;

      const cancelToken = axios.CancelToken.source();
      dispatch(fetchRefPaperData(paperId, refPage, refQuery, refSort, cancelToken.token));

      return () => {
        cancelToken.cancel();
      };
    },
    [refPage, refQuery, refSort, dispatch, paperId, shouldPatch]
  );
  React.useEffect(
    () => {
      if (!paperId) return;
      // NOTE: prevent patching from the change of shouldPatch variable
      if (shouldPatch && !lastShouldPatch.current) {
        lastShouldPatch.current = true;
        return;
      }
      // NOTE: prevent double patching
      if (!shouldPatch) return;

      const cancelToken = axios.CancelToken.source();
      dispatch(fetchCitedPaperData(paperId, citedPage, citedQuery, citedSort, cancelToken.token));

      return () => {
        cancelToken.cancel();
      };
    },
    [citedPage, citedQuery, citedSort, dispatch, paperId, shouldPatch]
  );

  function handleClickPaperShowTab(tab: AvailablePaperShowTab) {
    if (!refSection.current || !citedSection.current || !fixedButtonHeader.current) return;

    let destination = 0;
    if (tab === AvailablePaperShowTab.ref) {
      destination = refSection.current.offsetTop - fixedButtonHeader.current.clientHeight;
    } else if (tab === AvailablePaperShowTab.cited) {
      destination = citedSection.current.offsetTop - fixedButtonHeader.current.clientHeight;
    }

    window.scrollTo(0, destination);
  }

  if (!paper || !paperId) return null;

  const activeTabInFixedHeader = getActiveTab(currentPosition);

  return (
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
      <div>View PDF</div>
      <div
        ref={fixedButtonHeader}
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
            <MobilePaperShowTab active={activeTabInFixedHeader} onClick={handleClickPaperShowTab} paper={paper} />
          </div>
        )}
      </div>
      {relatedPaperIds &&
        relatedPaperIds.length > 0 && (
          <>
            <div ref={relatedTabWrapper}>
              <MobilePaperShowTab
                active={AvailablePaperShowTab.related}
                onClick={handleClickPaperShowTab}
                paper={paper}
              />
            </div>
            <MobileRelatedPapers paperIds={relatedPaperIds} className={s.relatedPapers} />
          </>
        )}
      <div className={s.refCitedSection} ref={refSection}>
        <MobileRefCitedPapers type="reference" paperId={paperId} paperCount={paper.referenceCount} />
      </div>
      <div className={s.refCitedSection} ref={citedSection}>
        <MobileRefCitedPapers type="cited" paperId={paperId} paperCount={paper.citedCount} />
      </div>
    </div>
  );
};

export default withRouter(MobilePaperShow);
