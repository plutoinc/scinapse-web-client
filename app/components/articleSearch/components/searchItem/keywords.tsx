import * as React from "react";
import { List } from "immutable";
import { trackAndOpenLink } from "../../../../helpers/handleGA";
import { IFosRecord } from "../../../../model/paper";
import EnvChecker from "../../../../helpers/envChecker";

const styles = require("./keywords.scss");

export interface IKeywordsProps {
  keywords: List<IFosRecord>;
}

const Keywords = (props: IKeywordsProps) => {
  const origin = EnvChecker.getOrigin();

  const keywordItems = props.keywords.map((keyword, index) => {
    let keywordContent = keyword.fos;
    if (index !== props.keywords.size - 1) {
      keywordContent = `${keyword.fos} · `;
    }
    const encodedKeyword = encodeURIComponent(keyword.fos);

    return (
      <span
        onClick={() => {
          trackAndOpenLink(`${origin}/search?page=1&query=${encodedKeyword}`, "SearchItemKeyword");
        }}
        className={styles.keyword}
        key={`keyword_${index}`}
      >
        {keywordContent}
      </span>
    );
  });

  return <div className={styles.keywords}>{keywordItems}</div>;
};

export default Keywords;
