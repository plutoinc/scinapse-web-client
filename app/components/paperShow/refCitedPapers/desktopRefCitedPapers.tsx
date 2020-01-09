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

  return (
    <div>
      <SearchContainer paperId={props.paperId} type="reference" />
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
