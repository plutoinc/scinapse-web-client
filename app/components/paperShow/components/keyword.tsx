import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { IFosRecord } from "../../../model/fos";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
const styles = require("./keyword.scss");

interface PaperShowKeywordProps {
  fos: IFosRecord;
}

const PaperShowKeyword = (props: PaperShowKeywordProps) => {
  return (
    <a
      href={`/search?${papersQueryFormatter.stringifyPapersQuery({
        query: props.fos.fos,
        page: 1,
        filter: {},
      })}`}
      className={styles.buttonWrapper}
    >
      {props.fos.fos}
    </a>
  );
};

export default withStyles<typeof PaperShowKeyword>(styles)(PaperShowKeyword);
