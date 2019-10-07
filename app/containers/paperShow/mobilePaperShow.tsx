import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { formulaeToHTMLStr } from '../../helpers/displayFormula';
import { getMemoizedPaper } from './select';
import { AppState } from '../../reducers';
import MobileVenueAuthors from '../../components/common/paperItem/mobileVenueAuthors';
import MobilePaperShowButtonGroup from '../../components/mobilePaperShowButtonGroup';
import CopyDOIButton from '../../components/copyDOIButton/copyDOIButton';
import MobilePaperShowTab from '../../components/mobilePaperShowTab/mobilePaperShowTab';
import GoBackResultBtn from '../../components/paperShow/backButton';
import ReferencePapers from '../../components/paperShow/refCitedPapers/referencePapers';
import CitedPapers from '../../components/paperShow/refCitedPapers/citedPapers';
import { PaperShowMatchParams, PaperShowPageQueryParams } from './types';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
import { fetchPaperShowData } from './sideEffect';
import PlutoAxios from '../../api/pluto';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { CommonError } from '../../model/error';
import { AvailablePaperShowTab } from '../../components/paperShowTabItem/paperShowTabItem';

const s = require('./mobilePaperShow.scss');
const useStyles = require('isomorphic-style-loader/useStyles');
const NAVBAR_HEIGHT = parseInt(s.headerHeight, 10);

let ticking = false;

type MobilePaperShowProps = RouteComponentProps<PaperShowMatchParams>;
type CurrentPosition = 'abovePaperInfo' | 'underPaperInfo' | 'onRefList' | 'onCitedList';

const MobilePaperShow: React.FC<MobilePaperShowProps> = props => {
  useStyles(s);
  const { match, location } = props;
  const { paper, currentUser, shouldPatch } = useSelector((state: AppState) => {
    return {
      paper: getMemoizedPaper(state),
      currentUser: state.currentUser,
      shouldPatch: !state.configuration.succeedAPIFetchAtServer || state.configuration.renderedAtClient,
    };
  });
  const dispatch = useDispatch();
  const [currentPosition, setCurrentPosition] = React.useState<CurrentPosition>('abovePaperInfo');
  const lastPosition = React.useRef<CurrentPosition>('abovePaperInfo');
  const buttonGroupWrapper = React.useRef<HTMLDivElement | null>(null);
  const fixedButtonHeader = React.useRef<HTMLDivElement | null>(null);
  const refTabWrapper = React.useRef<HTMLDivElement | null>(null);
  const citedTabWrapper = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (
            !buttonGroupWrapper.current ||
            !fixedButtonHeader.current ||
            !refTabWrapper.current ||
            !citedTabWrapper.current
          )
            return (ticking = false);
          const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
          const currentScrollTop = scrollTop + NAVBAR_HEIGHT;
          const buttonGroupOffsetTop = buttonGroupWrapper.current.offsetTop - 16 /* margin */;
          const refTabWrapperOffsetTop = refTabWrapper.current.offsetTop - fixedButtonHeader.current.clientHeight;
          const citedTabWrapperOffsetTop = citedTabWrapper.current.offsetTop - fixedButtonHeader.current.clientHeight;

          if (currentScrollTop < buttonGroupOffsetTop && lastPosition.current !== 'abovePaperInfo') {
            setCurrentPosition('abovePaperInfo');
            lastPosition.current = 'abovePaperInfo';
          } else if (
            currentScrollTop >= buttonGroupOffsetTop &&
            currentScrollTop < refTabWrapperOffsetTop &&
            lastPosition.current !== 'underPaperInfo'
          ) {
            setCurrentPosition('underPaperInfo');
            lastPosition.current = 'underPaperInfo';
          } else if (
            currentScrollTop >= refTabWrapperOffsetTop &&
            currentScrollTop < citedTabWrapperOffsetTop &&
            lastPosition.current !== 'onRefList'
          ) {
            setCurrentPosition('onRefList');
            lastPosition.current = 'onRefList';
          } else if (currentScrollTop >= citedTabWrapperOffsetTop && lastPosition.current !== 'onCitedList') {
            setCurrentPosition('onCitedList');
            lastPosition.current = 'onCitedList';
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
      const queryParams: PaperShowPageQueryParams = getQueryParamsObject(location.search);
      const cancelToken = axios.CancelToken.source();

      console.log(shouldPatch);

      if (!shouldPatch) return;

      fetchPaperShowData(
        {
          dispatch,
          match,
          pathname: location.pathname,
          queryParams,
          cancelToken: cancelToken.token,
        },
        currentUser
      )
        .then(() => {
          ActionTicketManager.trackTicket({
            pageType: 'paperShow',
            actionType: 'view',
            actionArea: '200',
            actionTag: 'pageView',
            actionLabel: String(match.params.paperId),
          });
        })
        .catch(err => {
          if (!axios.isCancel(err)) {
            const error = PlutoAxios.getGlobalError(err) as CommonError;
            ActionTicketManager.trackTicket({
              pageType: 'paperShow',
              actionType: 'view',
              actionArea: String(error.status),
              actionTag: 'pageView',
              actionLabel: String(match.params.paperId),
            });
          }
        });

      return () => {
        cancelToken.cancel();
      };
    },
    [location.search, location.pathname, currentUser, dispatch, match, shouldPatch]
  );

  function handleClickPaperShowTab(tab: AvailablePaperShowTab) {
    if (!refTabWrapper.current || !citedTabWrapper.current || !fixedButtonHeader.current) return;

    let destination = 0;
    if (tab === AvailablePaperShowTab.ref) {
      destination = refTabWrapper.current.offsetTop - fixedButtonHeader.current.clientHeight;
    } else if (tab === AvailablePaperShowTab.cited) {
      destination = citedTabWrapper.current.offsetTop - fixedButtonHeader.current.clientHeight;
    }

    window.scrollTo(0, destination);
  }

  if (!paper) return null;

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
        {(currentPosition === 'onRefList' || currentPosition === 'onCitedList') && (
          <div className={s.fixedRefCitedTab}>
            <MobilePaperShowTab active={AvailablePaperShowTab.ref} onClick={handleClickPaperShowTab} paper={paper} />
          </div>
        )}
      </div>

      <div ref={refTabWrapper}>
        <MobilePaperShowTab active={AvailablePaperShowTab.ref} onClick={handleClickPaperShowTab} paper={paper} />
      </div>
      <ReferencePapers isMobile refTabEl={refTabWrapper.current} />
      <div ref={citedTabWrapper}>
        <MobilePaperShowTab active={AvailablePaperShowTab.cited} onClick={handleClickPaperShowTab} paper={paper} />
      </div>
      <CitedPapers isMobile citedTabEl={citedTabWrapper.current} />
    </div>
  );
};

export default withRouter(MobilePaperShow);
