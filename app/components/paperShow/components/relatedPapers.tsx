import * as React from "react";
import { Location, LocationDescriptor } from "history";
import { Paper } from "../../../model/paper";
import { withStyles } from "../../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../../model/currentUser";
import { PaperShowStateRecord } from "../records";
import ReferencePaperItem from "./referencePaperItem";
import LinkPagination from "../../common/linkPagination";
import ArticleSpinner from "../../common/spinner/articleSpinner";
import { RELATED_PAPERS } from "../constants";
const styles = require("./relatedPapers.scss");

interface RelatedPapersProps {
  type: RELATED_PAPERS;
  currentUser: CurrentUserRecord;
  paperShow: PaperShowStateRecord;
  location: Location;
  toggleAuthors: (paperId: number, relatedPapersType: RELATED_PAPERS) => void;
  getLinkDestination: (page: number) => LocationDescriptor;
  handlePostBookmark: (paper: Paper) => void;
  handleRemoveBookmark: (paper: Paper) => void;
  toggleCitationDialog: () => void;
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
    const { type, paperShow } = this.props;

    const targetPaperList = type === "cited" ? paperShow.citedPapers : paperShow.referencePapers;
    const targetPaperMetaList = type === "cited" ? paperShow.citedPapersMeta : paperShow.referencePapersMeta;
    const targetLoadingStatus = type === "cited" ? paperShow.isLoadingCitedPapers : paperShow.isLoadingReferencePapers;

    if (!targetPaperList || targetPaperList.isEmpty()) {
      return null;
    } else if (targetLoadingStatus) {
      return <ArticleSpinner style={{ margin: "200px auto" }} />;
    } else {
      const referenceItems = targetPaperList.map(paper => {
        const meta = targetPaperMetaList.find(paperMeta => paperMeta!.paperId === paper!.id);

        if (!meta || !paper) {
          return null;
        }

        return <ReferencePaperItem key={`paperShow_related_${type}_${paper.id}`} paper={paper} />;
      });

      return <div className={styles.searchItems}>{referenceItems}</div>;
    }
  };
}
