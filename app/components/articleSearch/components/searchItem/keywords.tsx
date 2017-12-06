import * as React from "react";
import { List } from "immutable";
import { Link } from "react-router-dom";
import { trackAction } from "../../../../helpers/handleGA";
import { IFosRecord } from "../../../../model/paper";

const styles = require("./keywords.scss");

export interface IKeywordsProps {
  keywords: List<IFosRecord>;
}

const Keywords = (props: IKeywordsProps) => {
  const keywordItems = props.keywords.map((keyword, index) => {
    let keywordContent = keyword.fos;
    if (index !== props.keywords.size - 1) {
      keywordContent = `${keyword.fos} · `;
    }
    return (
      <Link
        to={`/search?query=${keyword.fos}&page=1&keyword=${keyword.fos}`}
        onClick={() => trackAction(`/search?query=${keyword.fos}&page=1&keyword=${keyword.fos}`, "SearchItemKeyword")}
        className={styles.keyword}
        key={`keyword_${index}`}
      >
        {keywordContent}
      </Link>
    );
  });

  return <div className={styles.keywords}>{keywordItems}</div>;
};

export default Keywords;
