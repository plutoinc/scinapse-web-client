import * as React from "react";
import { List } from "immutable";
import { trackAndOpenLink } from "../../../../helpers/handleGA";
import EnvChecker from "../../../../helpers/envChecker";
import papersQueryFormatter from "../../../../helpers/papersQueryFormatter";
import { IFosRecord } from "../../../../model/fos";

const styles = require("./keywords.scss");

export interface IKeywordsProps {
  keywords: List<IFosRecord>;
}

const Keywords = (props: IKeywordsProps) => {
  const { keywords } = props;
  const origin = EnvChecker.getOrigin();

  const keywordItems = keywords.map((keyword, index) => {
    let keywordContent = keyword.fos;
    if (index !== keywords.size - 1) {
      keywordContent = `${keyword.fos} · `;
    }

    return (
      <a
        href={`${origin}/search?page=1&query=${papersQueryFormatter.formatPapersQuery({ text: keyword.fos })}`}
        target="_blank"
        onClick={() => {
          trackAndOpenLink("SearchItemKeyword");
        }}
        className={styles.keyword}
        key={`keyword_${index}`}
      >
        {keywordContent}
      </a>
    );
  });

  return <div className={styles.keywords}>{keywordItems}</div>;
};

export default Keywords;
