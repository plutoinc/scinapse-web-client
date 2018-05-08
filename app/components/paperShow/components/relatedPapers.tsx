import * as React from "react";
import { Location } from "history";
import { PaperRecord } from "../../../model/paper";
import { withStyles } from "../../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../../model/currentUser";
import { PaperShowStateRecord } from "../records";
import ReferencePaperItem from "./referencePaperItem";
import CommonPagination from "../../common/commonPagination";
import ArticleSpinner from "../../common/spinner/articleSpinner";
import { RELATED_PAPERS } from "../constants";
const styles = require("./relatedPapers.scss");

interface RelatedPapersProps {
  type: RELATED_PAPERS;
  currentUser: CurrentUserRecord;
  paperShow: PaperShowStateRecord;
  location: Location;
  toggleAuthors: (paperId: number, relatedPapersType: RELATED_PAPERS) => void;
  handleClickPagination: (page: number) => void;
  handlePostBookmark: (paper: PaperRecord) => void;
  handleRemoveBookmark: (paper: PaperRecord) => void;
  toggleCitationDialog: () => void;
}

@withStyles<typeof RelatedPapers>(styles)
export default class RelatedPapers extends React.PureComponent<RelatedPapersProps, {}> {
  public render() {
    const { type, paperShow, handleClickPagination } = this.props;

    const totalPage = type === "cited" ? paperShow.citedPaperTotalPage : paperShow.referencePaperTotalPage;
    const currentPage = type === "cited" ? paperShow.citedPaperCurrentPage : paperShow.referencePaperCurrentPage;

    return (
      <div>
        <div>{this.mapPaperNode()}</div>
        <div>
          <CommonPagination
            type={`paper_show_${type}_papers`}
            totalPage={totalPage}
            currentPageIndex={currentPage}
            onItemClick={handleClickPagination}
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
        const meta = targetPaperMetaList.find(paperMeta => paperMeta.paperId === paper.id);

        if (!meta) {
          return null;
        }

        return <ReferencePaperItem key={`paperShow_related_${type}_${paper.id}`} paper={paper} />;
      });

      return <div className={styles.searchItems}>{referenceItems}</div>;
    }
  };
}
