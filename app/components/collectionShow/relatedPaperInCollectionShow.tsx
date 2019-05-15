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

function observeRelatedPaper(
  root: HTMLDivElement | null,
  threshold: number | number[] | undefined,
  collectionId: number
) {
  return new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        const { target, isIntersecting } = entry;
        if (isIntersecting) {
          ActionTicketManager.trackTicket({
            pageType: "collectionShow",
            actionType: "view",
            actionArea: "relatedPaperList",
            actionTag: "viewRelatedPaper",
            actionLabel: String(collectionId),
          });
          observer.unobserve(target);
        }
      });
    },
    { root, threshold }
  );
}
const RelatedPaperInCollectionShow: React.FunctionComponent<RelatedPaperInCollectionShowProps> = props => {
  const { collectionId } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [relatedPapers, setRelatedPapers] = React.useState<Paper[]>([]);
  const relatedPapersAnchor = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(
    () => {
      setIsLoading(true);
      CollectionAPI.getRelatedPaperInCollection(collectionId).then(result => {
        const observer = observeRelatedPaper(relatedPapersAnchor.current, 0.1, collectionId);

        setRelatedPapers(result.content);
        if (relatedPapersAnchor.current) {
          observer.observe(relatedPapersAnchor.current);
        }
        setIsLoading(false);
      });
    },
    [collectionId]
  );

  if (relatedPapers.length === 0) {
    return null;
  }

  const relatedPaperItems = relatedPapers.map((paper, index) => {
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
    <div className={styles.relatedPaperContainer} ref={relatedPapersAnchor}>
      <div className={styles.titleContext}>📄 How about these papers?</div>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      ) : (
        relatedPaperItems
      )}
    </div>
  );
};

export default withStyles<typeof styles>(styles)(RelatedPaperInCollectionShow);
