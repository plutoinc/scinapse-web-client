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

function useIntersection(threshold: number | number[] | undefined, paperId: number) {
  const elRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(
    () => {
      const intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              ActionTicketManager.trackTicket({
                pageType: "collectionShow",
                actionType: "view",
                actionArea: "relatedPaperList",
                actionTag: "viewRelatedPaper",
                actionLabel: String(paperId),
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold }
      );
      if (elRef.current) {
        intersectionObserver.observe(elRef.current);
      }
      return () => intersectionObserver.disconnect();
    },
    [elRef]
  );
  return { elRef };
}

const RelatedPaperItem: React.FunctionComponent<{ paper: Paper }> = props => {
  const { paper } = props;
  const { elRef } = useIntersection(0.1, paper.id);

  return (
    <div key={paper.id} ref={elRef}>
      <PaperItem
        key={paper.id}
        paper={paper}
        omitAbstract={true}
        pageType="collectionShow"
        actionArea="relatedPaperList"
        wrapperClassName={styles.paperItemWrapper}
      />
    </div>
  );
};

const RelatedPaperInCollectionShow: React.FunctionComponent<RelatedPaperInCollectionShowProps> = props => {
  const { collectionId } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [relatedPapers, setRelatedPapers] = React.useState<Paper[]>([]);

  React.useEffect(
    () => {
      setIsLoading(true);
      CollectionAPI.getRelatedPaperInCollection(collectionId).then(result => {
        setRelatedPapers(result.content);
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
      return <RelatedPaperItem paper={paper} />;
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
        relatedPaperItems
      )}
    </div>
  );
};

export default withStyles<typeof styles>(styles)(RelatedPaperInCollectionShow);
