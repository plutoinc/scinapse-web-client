import * as React from "react";
import { Link } from "react-router-dom";
import { trackAndOpenLink } from "../../../helpers/handleGA";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { Fos } from "../../../model/fos";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./keywords.scss");

export interface KeywordsProps {
  keywords: Fos[];
}

const Keywords = (props: KeywordsProps) => {
  const { keywords } = props;

  const keywordItems = keywords.map((keyword, index) => {
    if (keyword) {
      let keywordContent = keyword.fos;
      if (index !== keywords.length - 1) {
        keywordContent = `${keyword.fos} · `;
      }

      return (
        <Link
          to={{
            pathname: "/search",
            search: papersQueryFormatter.stringifyPapersQuery({
              query: keyword.fos || "",
              sort: "RELEVANCE",
              page: 1,
              filter: {},
            }),
          }}
          onClick={() => {
            trackAndOpenLink("SearchItemKeyword");
          }}
          className={styles.keyword}
          key={`keyword_${index}`}
        >
          {keywordContent}
        </Link>
      );
    }
  });

  return <div className={styles.keywords}>{keywordItems}</div>;
};

export default withStyles<typeof Keywords>(styles)(Keywords);
