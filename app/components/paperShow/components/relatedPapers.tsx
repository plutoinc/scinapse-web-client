import * as React from "react";
import { Location, LocationDescriptor } from "history";
import { Paper } from "../../../model/paper";
import { withStyles } from "../../../helpers/withStylesHelper";
import { CurrentUser } from "../../../model/currentUser";
import DesktopPagination from "../../common/desktopPagination";
import ArticleSpinner from "../../common/spinner/articleSpinner";
import { RELATED_PAPERS } from "../constants";
import { PaperShowState } from "../records";
import PaperItem from "../../common/paperItem";
const styles = require("./relatedPapers.scss");

interface ReferencePapersProps {
  type: RELATED_PAPERS;
  papers: Paper[];
  currentUser: CurrentUser;
  paperShow: PaperShowState;
  location: Location;
  getLinkDestination: (page: number) => LocationDescriptor;
}

@withStyles<typeof ReferencePapers>(styles)
export default class ReferencePapers extends React.PureComponent<ReferencePapersProps, {}> {
  public render() {
    const { type, paperShow, getLinkDestination } = this.props;

    const totalPage = type === "cited" ? paperShow.citedPaperTotalPage : paperShow.referencePaperTotalPage;
    const currentPage = type === "cited" ? paperShow.citedPaperCurrentPage : paperShow.referencePaperCurrentPage;

    return (
      <div>
        <div>{this.mapPaperNode()}</div>
        <div>
          <DesktopPagination
            type={`paper_show_${type}_papers`}
            totalPage={totalPage}
            currentPageIndex={currentPage - 1}
            getLinkDestination={getLinkDestination}
            wrapperStyle={{
              margin: "24px 0",
            }}
          />
        </div>
      </div>
    );
  }

  private mapPaperNode = () => {
    const { type, paperShow, papers, currentUser } = this.props;

    const targetLoadingStatus = type === "cited" ? paperShow.isLoadingCitedPapers : paperShow.isLoadingReferencePapers;

    if (!papers || papers.length === 0) {
      return null;
    } else if (targetLoadingStatus) {
      return <ArticleSpinner style={{ margin: "200px auto" }} />;
    } else {
      const referenceItems = papers.map(paper => {
        if (!paper) {
          return null;
        }

        return <PaperItem currentUser={currentUser} key={`paperShow_related_${type}_${paper.id}`} paper={paper} />;
      });

      return <div className={styles.searchItems}>{referenceItems}</div>;
    }
  };
}
