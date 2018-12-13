import * as React from "react";
import { Fos } from "../../../model/fos";
import { withStyles } from "../../../helpers/withStylesHelper";
import { trackEvent } from "../../../helpers/handleGA";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
const styles = require("./searchKeyword.scss");

interface SearchKeywordProps {
  FOSList?: Fos[];
}

class SearchKeyword extends React.PureComponent<SearchKeywordProps, {}> {
  public render() {
    const { FOSList } = this.props;
    if (!FOSList || FOSList.length === 0) {
      return null;
    } else {
      const FOSNodeArray = FOSList.slice(0, 4).map((fos, index) => {
        if (fos) {
          return (
            <a
              href={`/search?${papersQueryFormatter.stringifyPapersQuery({
                query: fos.fos || "",
                sort: "RELEVANCE",
                page: 1,
                filter: {},
              })}`}
              target="_blank"
              onClick={() => {
                trackEvent({
                  category: "New Paper Show",
                  action: "Click FOS by referers in sideNavigation",
                  label: `Click FOS id : ${fos.id} `,
                });
              }}
              key={index}
            >
              <li className={styles.keywordItem} key={index}>
                {fos.fos}
              </li>
            </a>
          );
        }
      });

      return (
        <div className={styles.searchKeyword}>
          <div className={styles.sideNavigationBlockHeader}>Are you looking for...</div>
          <ul className={styles.keywordList}>{FOSNodeArray}</ul>
        </div>
      );
    }
  }
}

export default withStyles<typeof SearchKeyword>(styles)(SearchKeyword);
