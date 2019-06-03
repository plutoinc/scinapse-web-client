import * as React from 'react';
import { Location, LocationDescriptor } from 'history';
import { Paper } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import { CurrentUser } from '../../../model/currentUser';
import DesktopPagination from '../../common/desktopPagination';
import { RELATED_PAPERS } from '../constants';
import { PaperShowState } from '../../../containers/paperShow/records';
import PaperItem from '../../common/paperItem';
import PaperItemWithToggleList from '../../paperItemWithToggleList';
import MobilePagination from '../../common/mobilePagination';
import { getUserGroupName } from '../../../helpers/abTestHelper';
const styles = require('./relatedPapers.scss');

interface ReferencePapersProps
  extends Readonly<{
      isMobile: boolean;
      type: RELATED_PAPERS;
      papers: Paper[];
      currentUser: CurrentUser;
      paperShow: PaperShowState;
      location: Location;
      getLinkDestination: (page: number) => LocationDescriptor;
    }> {}

interface PaperListProps {
  papers: Paper[];
  type: RELATED_PAPERS;
  currentUser: CurrentUser;
  refCitedPaperItemUserGroup: string;
}
const PaperList: React.FC<PaperListProps> = props => {
  const { type, papers, currentUser, refCitedPaperItemUserGroup } = props;

  if (!papers || papers.length === 0) return null;

  const referenceItems = papers.map(paper => {
    if (!refCitedPaperItemUserGroup) {
      return (
        <div className={styles.paperShowPaperItemWrapper} key={paper.id}>
          <PaperItem
            pageType="paperShow"
            actionArea={type === 'reference' ? 'refList' : 'citedList'}
            currentUser={currentUser}
            paper={paper}
            wrapperStyle={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0, maxWidth: '100%' }}
          />
        </div>
      );
    }

    if (refCitedPaperItemUserGroup === 'refCitedPaperItem') {
      return (
        <PaperItemWithToggleList
          pageType="paperShow"
          actionArea={type === 'reference' ? 'refList' : 'citedList'}
          paper={paper}
          key={paper.id}
        />
      );
    } else if (refCitedPaperItemUserGroup === 'control') {
      return (
        <div className={styles.paperShowPaperItemWrapper} key={paper.id}>
          <PaperItem
            pageType="paperShow"
            actionArea={type === 'reference' ? 'refList' : 'citedList'}
            currentUser={currentUser}
            paper={paper}
            wrapperStyle={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0, maxWidth: '100%' }}
          />
        </div>
      );
    }
  });

  return <div className={styles.searchItems}>{referenceItems}</div>;
};

interface ReferencePapersState {
  refCitedPaperItemUserGroup: string;
}

@withStyles<typeof ReferencePapers>(styles)
export default class ReferencePapers extends React.PureComponent<ReferencePapersProps, ReferencePapersState> {
  public constructor(props: ReferencePapersProps) {
    super(props);

    this.state = {
      refCitedPaperItemUserGroup: '',
    };
  }

  public componentDidMount() {
    this.setState({
      refCitedPaperItemUserGroup: getUserGroupName('refCitedPaperItem')!,
    });
  }

  public render() {
    return (
      <>
        <div>
          <PaperList
            type={this.props.type}
            papers={this.props.papers}
            currentUser={this.props.currentUser}
            refCitedPaperItemUserGroup={this.state.refCitedPaperItemUserGroup}
          />
        </div>
        <div>{this.getPagination()}</div>
      </>
    );
  }

  private getPagination = () => {
    const { type, paperShow, getLinkDestination, isMobile } = this.props;
    const totalPage = type === 'cited' ? paperShow.citedPaperTotalPage : paperShow.referencePaperTotalPage;
    const currentPage = type === 'cited' ? paperShow.citedPaperCurrentPage : paperShow.referencePaperCurrentPage;

    if (isMobile) {
      return (
        <MobilePagination
          totalPageCount={totalPage}
          currentPageIndex={currentPage - 1}
          getLinkDestination={getLinkDestination}
          wrapperStyle={{
            margin: '12px 0',
          }}
        />
      );
    } else {
      return (
        <DesktopPagination
          type={`paper_show_${type}_papers`}
          totalPage={totalPage}
          currentPageIndex={currentPage - 1}
          getLinkDestination={getLinkDestination}
          wrapperStyle={{ margin: '32px 0 56px 0' }}
          actionArea={type === 'reference' ? 'refList' : 'citedList'}
        />
      );
    }
  };
}
