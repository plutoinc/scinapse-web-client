import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Fos, NewFOS } from "../../../model/fos";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { trackEvent } from "../../../helpers/handleGA";
import { PageType, ActionArea } from "../../../helpers/actionTicketManager/actionTicket";
import ActionTicketManager from "../../../helpers/actionTicketManager";
const styles = require("./keyword.scss");

interface PaperShowKeywordProps {
  fos: Fos | NewFOS;
  pageType: PageType;
  actionArea?: ActionArea;
}

function isOldFos(fos: Fos | NewFOS): fos is Fos {
  return (fos as Fos).fos !== undefined;
}

const PaperShowKeyword = (props: PaperShowKeywordProps) => {
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
        target="_blank"
        onClick={() => {
          trackEvent({
            category: "New Paper Show",
            action: "Click FOS by referers in paperContent",
            label: `Click FOS id : ${fos.id} `,
          });

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
        target="_blank"
        onClick={() => {
          trackEvent({
            category: "New Paper Show",
            action: "Click FOS by referers in paperContent",
            label: `Click FOS id : ${fos.id} `,
          });

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
