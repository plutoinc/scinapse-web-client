import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

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

const NAVBAR_HEIGHT = parseInt(s.headerHeight, 10);
console.log(NAVBAR_HEIGHT);

type MobilePaperShowProps = RouteComponentProps<PaperShowMatchParams>;

let ticking = false;

const MobilePaperShow: React.FC<MobilePaperShowProps> = props => {
  useStyles(s);
  const { paper, currentUser } = useSelector((state: AppState) => {
    return {
      paper: getMemoizedPaper(state),
      currentUser: state.currentUser,
    };
  });
  const dispatch = useDispatch();
  const buttonGroupWrapper = React.useRef<HTMLDivElement | null>(null);
  const fixedButtonHeader = React.useRef<HTMLDivElement | null>(null);
  const refTabWrapper = React.useRef<HTMLDivElement | null>(null);
  const citedTabWrapper = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleScroll() {
      console.log('fire handleScroll');
      if (!ticking) {
        requestAnimationFrame(() => {
          if (
            !buttonGroupWrapper.current ||
            !fixedButtonHeader.current ||
            !refTabWrapper.current ||
            !citedTabWrapper.current
          )
            return (ticking = false);
          console.log('inside raF', buttonGroupWrapper.current);
          const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
          const currentScrollTop = scrollTop + NAVBAR_HEIGHT;
          const buttonGroupOffsetTop = buttonGroupWrapper.current.offsetTop - 16 /* margin */;
          const refTabWrapperOffset = refTabWrapper.current.offsetTop - fixedButtonHeader.current.clientHeight;

          console.log(currentScrollTop, refTabWrapperOffset);

          if (currentScrollTop < buttonGroupOffsetTop) {
            fixedButtonHeader.current.style.display = 'none';
          } else if (currentScrollTop >= buttonGroupOffsetTop) {
            fixedButtonHeader.current.style.display = 'block';
          }

          ticking = false;
        });
      }
      ticking = true;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial time
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  React.useEffect(
    () => {
      const { match, location } = props;
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
    [props.location, currentUser]
  );

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

      <div ref={fixedButtonHeader} className={s.fixedTab}>
        <div className={s.tabPaperTitle}>{paper.title}</div>
        <PaperItemButtonGroup
          paper={paper}
          pageType={'paperShow'}
          actionArea="refCitedTab"
          saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
        />
      </div>

      <div className={s.refCitedTabWrapper} ref={refTabWrapper} />
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
