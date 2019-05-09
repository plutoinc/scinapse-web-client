import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Fos, NewFOS } from "../../../model/fos";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import ActionTicketManager from "../../../helpers/actionTicketManager";
const styles = require("./keyword.scss");

interface PaperShowKeywordProps {
  fos: Fos | NewFOS;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

function isOldFos(fos: Fos | NewFOS): fos is Fos {
  return (fos as Fos).fos !== undefined;
}

const PaperShowKeyword: React.FunctionComponent<PaperShowKeywordProps> = props => {
  const fos = props.fos;

  if (isOldFos(fos)) {
    return (
      <a
        href={`/search?${papersQueryFormatter.stringifyPapersQuery({
          query: fos.fos || "",
          sort: "RELEVANCE",
          page: 1,
          filter: {},
        })}`}
        rel="noopener"
        target="_blank"
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType: props.pageType,
            actionType: "fire",
            actionArea: props.actionArea || props.pageType,
            actionTag: "fos",
            actionLabel: String(fos.id),
          });
        }}
        className={styles.buttonWrapper}
      >
        {fos.fos}
      </a>
    );
  } else {
    return (
      <a
        href={`/search?${papersQueryFormatter.stringifyPapersQuery({
          query: fos.name || "",
          sort: "RELEVANCE",
          page: 1,
          filter: {},
        })}`}
        rel="noopener"
        target="_blank"
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType: props.pageType,
            actionType: "fire",
            actionArea: props.actionArea || props.pageType,
            actionTag: "fos",
            actionLabel: String(fos.id),
          });
        }}
        className={styles.buttonWrapper}
      >
        {fos.name}
      </a>
    );
  }
};

export default withStyles<typeof PaperShowKeyword>(styles)(PaperShowKeyword);
