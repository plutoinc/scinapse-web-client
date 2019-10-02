import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import classNames from 'classnames';

import { formulaeToHTMLStr } from '../../helpers/displayFormula';
import { getMemoizedPaper } from './select';
import { AppState } from '../../reducers';
import MobileVenueAuthors from '../../components/common/paperItem/mobileVenueAuthors';
import PaperItemButtonGroup from '../../components/common/paperItem/paperItemButtonGroup';
import GoBackResultBtn from '../../components/paperShow/backButton';
import ReferencePapers from '../../components/paperShow/refCitedPapers/referencePapers';
import CitedPapers from '../../components/paperShow/refCitedPapers/citedPapers';
import { PaperShowMatchParams, PaperShowPageQueryParams } from './types';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
import { fetchPaperShowData } from './sideEffect';
import PlutoAxios from '../../api/pluto';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { CommonError } from '../../model/error';
const s = require('./mobilePaperShow.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

type MobilePaperShowProps = RouteComponentProps<PaperShowMatchParams>;
type CurrentPosition = 'abovePaperInfo' | 'underPaperInfo' | 'onRefList' | 'onCitedList';

const NAVBAR_HEIGHT = parseInt(s.headerHeight, 10);
let ticking = false;

const MobilePaperShow: React.FC<MobilePaperShowProps> = props => {
  useStyles(s);
  const { match, location } = props;
  const { paper, currentUser } = useSelector((state: AppState) => {
    return {
      paper: getMemoizedPaper(state),
      currentUser: state.currentUser,
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

          console.log(currentScrollTop, buttonGroupOffsetTop, refTabWrapperOffsetTop);

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
    [location, currentUser, dispatch, match]
  );

  function clickRefCitedTab(tab: 'ref' | 'cited') {
    if (!refTabWrapper.current || !citedTabWrapper.current || !fixedButtonHeader.current) return;

    const destination =
      tab === 'ref'
        ? refTabWrapper.current.offsetTop - fixedButtonHeader.current.clientHeight
        : citedTabWrapper.current.offsetTop - fixedButtonHeader.current.clientHeight;
    window.scrollTo(0, destination);
  }

  if (!paper) return null;

  return (
    <div className={s.container}>
      <div className={s.contentWrapper}>
        <GoBackResultBtn />
        <h1 className={s.title} dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(paper.title) }} />
        <MobileVenueAuthors paper={paper} pageType={'paperShow'} actionArea="paperDescription" />
        <div ref={buttonGroupWrapper}>
          <PaperItemButtonGroup
            paper={paper}
            pageType={'paperShow'}
            actionArea="paperDescription"
            saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
          />
        </div>
        <div className={s.abstractHeader}>Abstract</div>
        <div className={s.abstractContent} dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(paper.abstract) }} />
      </div>

      <div
        ref={fixedButtonHeader}
        className={classNames({
          [s.fixedTab]: true,
          [s.active]: currentPosition !== 'abovePaperInfo',
        })}
      >
        <div className={s.tabPaperTitle}>{paper.title}</div>
        {currentPosition === 'underPaperInfo' && (
          <div className={s.buttonGroupWrapper}>
            <PaperItemButtonGroup
              paper={paper}
              pageType={'paperShow'}
              actionArea="refCitedTab"
              saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
            />
          </div>
        )}
        {(currentPosition === 'onRefList' || currentPosition === 'onCitedList') && (
          <div className={s.fixedRefCitedTab}>
            <span
              onClick={() => clickRefCitedTab('ref')}
              className={classNames({
                [s.refCitedTabItem]: currentPosition !== 'onRefList',
                [s.activeRefCitedTabItem]: currentPosition === 'onRefList',
              })}
            >{`References (${paper.referenceCount})`}</span>
            <span
              onClick={() => clickRefCitedTab('cited')}
              className={classNames({
                [s.refCitedTabItem]: currentPosition !== 'onCitedList',
                [s.activeRefCitedTabItem]: currentPosition === 'onCitedList',
              })}
            >{`Citations (${paper.citedCount})`}</span>
          </div>
        )}
      </div>

      <div className={s.refCitedTab} ref={refTabWrapper}>
        <span onClick={() => clickRefCitedTab('ref')} className={s.activeRefCitedTabItem}>{`References (${
          paper.referenceCount
        })`}</span>
        <span onClick={() => clickRefCitedTab('cited')} className={s.refCitedTabItem}>{`Citations (${
          paper.citedCount
        })`}</span>
      </div>
      <ReferencePapers isMobile refTabEl={refTabWrapper.current} />

      <div className={s.refCitedTab} ref={citedTabWrapper}>
        <span onClick={() => clickRefCitedTab('ref')} className={s.refCitedTabItem}>{`References (${
          paper.referenceCount
        })`}</span>
        <span onClick={() => clickRefCitedTab('cited')} className={s.activeRefCitedTabItem}>{`Citations (${
          paper.citedCount
        })`}</span>
      </div>
      <CitedPapers isMobile citedTabEl={citedTabWrapper.current} />
    </div>
  );
};

export default MobilePaperShow;
