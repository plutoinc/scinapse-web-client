import * as React from "react";
import { Link } from "react-router-dom";
import { LocationDescriptorObject } from "history";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./relatedKeywordList.scss");

interface RelatedKeywordListProps {
  keywordList: string[];
  shouldRender: boolean;
  locationDescriptor: LocationDescriptorObject;
  query: string;
}

const RelatedKeywordList: React.SFC<RelatedKeywordListProps> = ({
  keywordList,
  shouldRender,
  locationDescriptor,
  query,
}) => {
  if (!shouldRender || keywordList.length === 0) {
    return null;
  }

  const relatedKeywordItems = keywordList.filter(k => query.indexOf(k) === -1).map(keyword => (
    <div key={keyword} className={styles.relatedKeywords}>
      <Link to={locationDescriptor}>{keyword.toLowerCase()}</Link>
    </div>
  ));

  return <div className={styles.relatedKeywordsContainer}>{relatedKeywordItems}</div>;
};

export default withStyles<typeof RelatedKeywordList>(styles)(RelatedKeywordList);
