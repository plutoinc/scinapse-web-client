import React from 'react';
import { useLocation } from 'react-router-dom';
import getQueryParamsObject from '../../../helpers/getQueryParamsObject';
import RefCitedPaperList from './refCitedPaperList';
import SearchContainer from './searchContainer';
import { AppState } from '../../../reducers';
import RefCitedPagination from './refCitedPagination';
import { REF_CITED_CONTAINER_TYPE } from '../constants';
import { useSelector } from 'react-redux';
const useStyles = require('isomorphic-style-loader/useStyles');
const styles = require('./referencePapers.scss');

interface Props {
  paperId: string;
  type: REF_CITED_CONTAINER_TYPE;
}

const DesktopRefCitedPapers: React.FC<Props> = props => {
  useStyles(styles);
  const location = useLocation();
  const paperIds = useSelector((state: AppState) => {
    if (props.type === 'reference') {
      return state.paperShow.referencePaperIds;
    }
    return state.paperShow.citedPaperIds;
  });

  const isLoading = useSelector((state: AppState) =>
    props.type === 'reference' ? state.paperShow.isLoadingReferencePapers : state.paperShow.isLoadingCitedPapers
  );

  React.useEffect(() => {
    if (isLoading && location.state?.scrollTo === props.type && wrapperNode.current) {
      // 175 means means margin top for comfortable of viewing 
      window.scrollTo(0, wrapperNode.current.offsetTop - 175);
    }
  }, [isLoading, location.state, props.type]);

  const wrapperNode = React.useRef<HTMLDivElement | null>(null);

  return (
    <div ref={wrapperNode}>
      <SearchContainer paperId={props.paperId} type={props.type} />
      <div>
        <RefCitedPaperList
          type={props.type}
          paperIds={paperIds}
          queryParamsObject={getQueryParamsObject(location.search)}
          isLoading={isLoading}
        />
      </div>
      <div>
        <RefCitedPagination type={props.type} paperId={props.paperId} />
      </div>
    </div>
  );
};

export default DesktopRefCitedPapers;
