import * as React from "react";
import { Location, LocationDescriptor } from "history";
import { Paper } from "../../../model/paper";
import { withStyles } from "../../../helpers/withStylesHelper";
import { CurrentUser } from "../../../model/currentUser";
import ReferencePaperItem from "./referencePaperItem";
import LinkPagination from "../../common/linkPagination";
import ArticleSpinner from "../../common/spinner/articleSpinner";
import { RELATED_PAPERS } from "../constants";
import { PaperShowState } from "../records";
const styles = require("./relatedPapers.scss");

interface RelatedPapersProps {
  type: RELATED_PAPERS;
  papers: Paper[];
  currentUser: CurrentUser;
  paperShow: PaperShowState;
  location: Location;
  getLinkDestination: (page: number) => LocationDescriptor;
}

@withStyles<typeof RelatedPapers>(styles)
export default class RelatedPapers extends React.PureComponent<RelatedPapersProps, {}> {
  public render() {
    const { type, paperShow, getLinkDestination } = this.props;

    const totalPage = type === "cited" ? paperShow.citedPaperTotalPage : paperShow.referencePaperTotalPage;
    const currentPage = type === "cited" ? paperShow.citedPaperCurrentPage : paperShow.referencePaperCurrentPage;

    return (
      <div>
        <div>{this.mapPaperNode()}</div>
        <div>
          <LinkPagination
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
    const { type, paperShow, papers } = this.props;

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

        return <ReferencePaperItem key={`paperShow_related_${type}_${paper.id}`} paper={paper} />;
      });

      return <div className={styles.searchItems}>{referenceItems}</div>;
    }
  };
}
