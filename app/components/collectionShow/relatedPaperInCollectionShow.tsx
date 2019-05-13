import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import CollectionAPI from "../../api/collection";
import { Paper } from "../../model/paper";
import PaperItem from "../common/paperItem";
import ArticleSpinner from "../common/spinner/articleSpinner";
import ActionTicketManager from "../../helpers/actionTicketManager";
const styles = require("./relatedPaperInCollectionShow.scss");

interface RelatedPaperInCollectionShowProps {
  collectionId: number;
}

const RelatedPaperInCollectionShow: React.FunctionComponent<RelatedPaperInCollectionShowProps> = props => {
  const { collectionId } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [relatedPapers, setRelatedPapers] = React.useState<Paper[]>([]);

  React.useEffect(
    () => {
      setIsLoading(true);
      CollectionAPI.getRelatedPaperInCollection(collectionId).then(result => {
        if (result.content && result.content.length !== 0) {
          ActionTicketManager.trackTicket({
            pageType: "collectionShow",
            actionType: "view",
            actionArea: "relatedPaperList",
            actionTag: "viewRelatedPaper",
            actionLabel: String(collectionId),
          });
        }
        setRelatedPapers(result.content);
        setIsLoading(false);
      });
    },
    [collectionId]
  );

  if (relatedPapers.length === 0) {
    return null;
  }

  const paperItems = relatedPapers.map((paper, index) => {
    if (index < 3) {
      return (
        <PaperItem
          key={paper.id}
          paper={paper}
          omitAbstract={true}
          pageType="collectionShow"
          actionArea="relatedPaperList"
          wrapperClassName={styles.paperItemWrapper}
        />
      );
    }
  });
  return (
    <div className={styles.relatedPaperContainer}>
      <div className={styles.titleContext}>📄 How about these papers?</div>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      ) : (
        paperItems
      )}
    </div>
  );
};

export default withStyles<typeof styles>(styles)(RelatedPaperInCollectionShow);
